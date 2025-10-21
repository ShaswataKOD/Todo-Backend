import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import createError from '../utils/createError.js'

dotenv.config()

export async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      throw createError(409, 'User already Exists')
      // return res
      //   .status(409)
      //   .json({ success: false, message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const isT = await bcrypt.compare(password, hashedPassword)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (err) {
    // console.error('Registration error:', err.message)
    // res.status(500).json({ success: false, message: 'Registration failed' })
    next(err)
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      throw createError(404, 'User not found')
    }

    if (!user.isVerified) {
      throw createError(403, 'User not found')
    }

    const hash = user.password
    const passwordMatch = await bcrypt.compare(password, hash)

    if (!passwordMatch) {
      throw createError(401, 'Password did not match')
      // return res.status(401).json({ error: 'Password did not match' })
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_KEY,
      {
        expiresIn: '2m',
      }
    )

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: '60d',
      }
    )

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    })
  } catch (error) {
    // console.error('Login error:', error)
    // return res.status(500).json({ error: 'Login failed' })
    next(error)
  }
}

export async function generateRefreshToken(req, res) {
  try {
    const refreshToken = req.headers['refresh-token']

    if (!refreshToken) {
      throw createError(401, 'Refresh Token not found')
    }
    // return res.status(401).json({ message: 'No refresh token provided' })
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY)

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '2m' }
    )

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.REFRESH_TOKEN_KEY,
      { expiresIn: '60d' }
    )

    return res.status(200).json({
      message: 'Tokens refreshed',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error) {
    // return res.status(403).json({ message: 'Invalid token' })
    next(error)
  }
}

import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body

    console.log({ name, email, password })
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(1)
    console.log({ salt })
    const hashedPassword = await bcrypt.hash(password, salt)

    console.log({ hashedPassword })

    const isT = await bcrypt.compare(password, hashedPassword)

    console.log({ isT })

    // {hashedPassword: '$2b$04$1cfv5zUBQdBtIN/5qnKWA.mONcoE4gMcWvL2qjUvyKPhhamT2KKcW'}

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully. User is not verified yet.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (err) {
    console.error('Registration error:', err.message)
    res.status(500).json({ success: false, message: 'Registration failed' })
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ error: 'User with this email not found' })
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'User is not verified' })
    }

    const hash = user.password

    console.log({ password, hash, user })

    const passwordMatch = await bcrypt.compare(password, hash)

    console.log({ passwordMatch })

    // passwordMatch = true

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password did not match' })
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACESS_TOKEN_KEY || '12345',
      {
        expiresIn: '20s',
      }
    )

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_KEY || '123456',
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
    console.error('Login error:', error)
    return res.status(500).json({ error: 'Login failed' })
  }
}

//work left to do

export async function generateRefreshToken(req, res) {
  try {
    const refreshToken = req.headers['refresh-token']
    if (!refreshToken)
      return res.status(401).json({ message: 'No refresh token provided' })

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_KEY || '123456'
    )

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_KEY || '12345',
      { expiresIn: '2m' }
    )

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.REFRESH_TOKEN_KEY || '123456',
      { expiresIn: '60d' }
    )

    res.header('access-token', newAccessToken)
    res.header('refresh-token', newRefreshToken)
    return res
      .status(200)
      .json({
        message: 'Tokens refreshed',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

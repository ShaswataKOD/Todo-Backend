import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

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

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Password did not match' })
    }

    const accessToken = jwt.sign({ userId: user._id }, '12345', {
      expiresIn: '1h',
    })

    const refreshToken = jwt.sign({ userId: user._id }, '123456', {
      expiresIn: '60d',
    })

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

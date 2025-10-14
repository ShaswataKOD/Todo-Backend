import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

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
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ error: 'Authentication Error' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication Failed' })
    }

    const token = jwt.sign({ userId: user._id }, 'fdfg', { expiresIn: '1h' })

    res.status(200).json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
}


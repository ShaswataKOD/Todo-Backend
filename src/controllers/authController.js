import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'

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

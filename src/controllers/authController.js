import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';

export async function registerUser(req, res) {
  try {
    const { name, email, password, otp } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Check OTP validity
    const recentOtp = await OTP.findOne({ email, otp }).sort({ createdAt: -1 });
    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Delete the used OTP
    // await OTP.deleteOne({ _id: recentOtp._id });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
}

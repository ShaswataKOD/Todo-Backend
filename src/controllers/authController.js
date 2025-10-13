// controllers/authController.js

import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';



export async function registerUser(req, res) {
  try {
    const { name,email, password, otp } = req.body;

  
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    await OTP.deleteMany({ email });

  
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

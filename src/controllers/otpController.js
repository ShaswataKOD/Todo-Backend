// controllers/otpController.js

import otpGenerator from "otp-generator";
import OTP from "../models/otpModel.js";
import User from "../models/userModel.js";
import sendVerificationEmail from "../utils/VerificationMail.js";



export async function sendOTP(req, res) {
  try {
    const { email } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

   
    let otp;
    let existingOtp;

    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });

      existingOtp = await OTP.findOne({ otp });
    } while (existingOtp);
    console.log(`Generated OTP for ${email}:`, otp);
    
    await OTP.create({ email, otp });
    await sendVerificationEmail(email, otp);
 
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // otp, 
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
}

import otpModel from '../models/otpModel.js'
import User from '../models/userModel.js'

export async function verifyOtpForEmail(email, otp) {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error('User not found')
  }

  const otpRecord = await otpModel.findOne({ email }).sort({ createdAt: -1 })

  if (!otpRecord) {
    throw new Error('No OTP found. Request a new one.')
  }

  if (otpRecord.isUsed) {
    throw new Error('OTP already used')
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new Error('OTP expired')
  }

  if (otpRecord.otp !== otp) {
    throw new Error('Invalid OTP')
  }

  return user
}

export default verifyOtpForEmail

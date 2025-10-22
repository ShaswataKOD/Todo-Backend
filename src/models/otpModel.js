import mongoose from 'mongoose'
import { string } from 'yup'

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    isUsed: { type: Boolean, default: false, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
)

const Otp = mongoose.model('OTP', otpSchema)

export default Otp

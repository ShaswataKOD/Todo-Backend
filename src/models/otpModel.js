import mongoose from "mongoose"
import sendVerificationEmail from "../utils/VerificationMail.js"

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 5 minutes
  }
});


otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});


const OTP = mongoose.model("OTP", otpSchema);
export default OTP; 

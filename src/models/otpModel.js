import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
}, {
  timestamps: true
});

// ✅ Remove this pre-save hook, email is sent in controller
// otpSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     await sendVerificationEmail(this.email, this.otp);
//   }
//   next();
// });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;

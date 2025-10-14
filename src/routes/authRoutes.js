import express from 'express'
import { registerUser } from '../controllers/authController.js'
import { resetPassword, sendOtp, VerifyOtp } from '../controllers/otpController.js'

const router = express.Router()

router.post('/register', registerUser) 
router.post('/send-otp', sendOtp) 
router.post('/verify-otp', VerifyOtp) 
router.post("/reset-password",resetPassword)
// router.post("forget-password",forgetPassword)

export default router

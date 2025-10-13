import express from 'express'
import { registerUser } from '../controllers/authController.js'
import { sendOtp, VerifyOtp } from '../controllers/otpController.js'

const router = express.Router()

router.post('/register', registerUser) 
router.post('/send-otp', sendOtp) 
router.post('/verify-otp', VerifyOtp) 

export default router

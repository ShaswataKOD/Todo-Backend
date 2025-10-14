import express from 'express'
import { registerUser } from '../controllers/authController.js'
import { resetPassword, sendOtp, VerifyOtp } from '../controllers/otpController.js'
import  verifyToken from  "../Middleware/authValidator.js"

const router = express.Router()

router.post('/register', registerUser) 
// router.post("/login",verifyToken,login)
router.post('/send-otp', sendOtp) 
router.post('/verify-otp', VerifyOtp) 
router.post("/reset-password",resetPassword)


export default router

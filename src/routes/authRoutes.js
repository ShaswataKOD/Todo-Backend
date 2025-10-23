import express from 'express'
import {
  registerUser,
  loginUser,
  generateRefreshToken,
} from '../controllers/authController.js'
import {
  resetPassword,
  sendOtp,
  VerifyOtp,
  forgotPassword,
} from '../controllers/otpController.js'
import {
  validateSignUpRequest,
  validateLoginRequest,
  validateResetPasswordRequest,
} from '../middleware/userValidator.js'
import verifyToken from '../middleware/authValidator.js'

const router = express.Router()

router.post('/register', validateSignUpRequest, registerUser)
router.post('/login', validateLoginRequest, loginUser)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', VerifyOtp)
router.post(
  '/reset-password',
  verifyToken,
  validateResetPasswordRequest,
  resetPassword
)
router.post('/forgotpassword', forgotPassword)
router.post('/refresh', generateRefreshToken)

export default router

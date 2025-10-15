import express from 'express'
import { registerUser, loginUser } from '../controllers/authController.js'
import {
  resetPassword,
  sendOtp,
  VerifyOtp,
} from '../controllers/otpController.js'
import UserValidations from '../Middleware/userValidator.js'

const router = express.Router()

const userValidations = new UserValidations()
// userValidations.validateSignUpRequest,
// userValidations.validateLoginRequest,

// validation is causing issue here
// need to fix the validation codes 


router.post('/register',  registerUser)
router.post('/login',  loginUser)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', VerifyOtp)
router.post(
  '/reset-password',
  userValidations.validateResetPasswordRequest,
  resetPassword
)

export default router

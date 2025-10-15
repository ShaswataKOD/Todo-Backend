import otpGenerator from 'otp-generator'
import Otp from '../models/otpModel.js'
import User from '../models/userModel.js'
import sendVerificationEmail from '../utils/VerificationMail.js'
import { verifyOtpForEmail } from '../utils/verifyOtp.js'
import bcrypt from 'bcryptjs'

// utility  function to make otp
// need to be moived
export async function sendOTPInternal(email) {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  })

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  await Otp.create({ email, otp, isUsed: false, expiresAt })

  await sendVerificationEmail(email, otp)
}

// verify the user for that send this otp

export async function sendOtp(req, res) {
  try {
    const { email } = req.body

    const user = await User.findOne({ email }) // searching if that particular user exists

    if (!user)
      return res.status(400).json({ success: false, message: 'User not found' })
    if (user.isVerified)
      return res
        .status(400)
        .json({ success: false, message: 'User already verified' })

    await sendOTPInternal(email)

    res.status(200).json({ success: true, message: 'OTP sent successfully' })
  } catch (err) {
    console.error('Error sending OTP:', err)
    res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
}

// separate route for verification of otp

// export async function VerifyOtp(req, res) {
//   const { email, otp } = req.body

//   try {
//     const user = await User.findOne({ email })

//     if (!user) {
//       return res.status(400).json({ success: false, message: 'User not found' })
//     }

//     //wha if no user
//     const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 })

//     if (!otpRecord)
//       return res
//         .status(400)
//         .json({ success: false, message: 'No OTP found. Request a new one.' })

//     if (otpRecord.isUsed)
//       return res
//         .status(400)
//         .json({ success: false, message: 'OTP already used' })

//     if (otpRecord.expiresAt < new Date())
//       return res.status(400).json({ success: false, message: 'OTP expired' })
//     if (otpRecord.otp !== otp)
//       return res.status(400).json({ success: false, message: 'Invalid OTP' })

//     // redundant just fr fun
//     otpRecord.isUsed = true
//     await otpRecord.save()

//     user.isVerified = true
//     await user.save()

//     res.status(200).json({
//       success: true,
//       message: 'OTP verified successfully. User is now verified.',
//     })
//   } catch (err) {
//     console.error('OTP verification error:', err.message)
//     res.status(500).json({ success: false, message: 'OTP verification failed' })
//   }
// }

export async function VerifyOtp(req, res) {
  const { email, otp } = req.body

  try {
    const user = await verifyOtpForEmail(email, otp)

    // Mark user as verified if needed
    user.isVerified = true
    await user.save()

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. User is now verified.',
    })
  } catch (err) {
    console.error('OTP verification error:', err.message)
    res.status(400).json({ success: false, message: err.message })
  }
}

// for forget pssws reuse the verify otp and then move the user to the next route to reset

export async function resetPassword(req, res) {
  const { email, currentPassword, newPassword } = req.body

  try {
    if (!email || !currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required' })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: 'Email not verified' })
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Incorrect current password' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (err) {
    console.error('Reset password error:', err.message)
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' })
  }
}

// not working correctly

export async function forgotPassword(req, res) {
  const { email, otp, newPassword } = req.body

  try {
    // Verify OTP (throws error if invalid)
    await verifyOtpForEmail(email, otp)

    // Find the user
    const user = await User.findOne({ email })
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' })

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update user password
    user.password = hashedPassword
    await user.save()

    res
      .status(200)
      .json({ success: true, message: 'Password reset successfully' })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

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

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' })
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: 'User already verified' })
    }

    await sendOTPInternal(email)

    res.status(200).json({ success: true, message: 'OTP sent successfully' })
  } catch (err) {
    console.error('Error sending OTP:', err)
    res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
}

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


// this needed to use authentication thatis acess token
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

// working fixed

export async function forgotPassword(req, res) {
  // get the request from the user
  const { email, otp, currentPassword, newPassword } = req.body
  // validate first once again

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'Enter correct email and password' })
    }
    const user = await User.findOne({ email })

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ sucees: false, message: 'Email not verified' })
    }

    if (currentPassword) {
      const passMatch = await bcrypt.compare(currentPassword, user.password)

      if (!passMatch) {
        return res
          .status(401)
          .json({ sucess: false, message: 'Incorrect current password' })
      }
    } else if (otp) {
      await verifyOtpForEmail(email, otp)
      const otpRecord = await Otp.findOne({ email, otp }).sort({
        createdAt: -1,
      })
      if (otpRecord) {
        otpRecord.isUsed = true
        await otpRecord.save()
      }
    } else {
      return res.status(400).json({
        succes: false,
        message: 'Provide correct Otp or current Password',
      })
    }

    // hash the new passoword and then and save it in the schema
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()

    return res
      .status(200)
      .json({ sucees: true, message: 'password reset sucessful' })
  } catch (error) {
    console.log('Reset Password error', error.message)
    return res
      .status(500)
      .json({ sucess: false, message: 'Internal server error' })
  }
}

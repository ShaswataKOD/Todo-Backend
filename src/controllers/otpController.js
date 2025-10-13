import otpGenerator from 'otp-generator'
import Otp from '../models/otpModel.js'
import User from '../models/userModel.js'
import sendVerificationEmail from '../utils/VerificationMail.js'

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

export async function VerifyOtp(req, res) {
  const { email, otp } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' })
    }

    //now supposing the user does exists
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 })

    if (!otpRecord)
      return res
        .status(400)
        .json({ success: false, message: 'No OTP found. Request a new one.' })

    if (otpRecord.isUsed)
      return res
        .status(400)
        .json({ success: false, message: 'OTP already used' })

    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ success: false, message: 'OTP expired' })
    if (otpRecord.otp !== otp)
      return res.status(400).json({ success: false, message: 'Invalid OTP' })

    // Mark OTP as used
    otpRecord.isUsed = true
    await otpRecord.save()

    // Mark user as verified
    user.isVerified = true
    await user.save()

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. User is now verified.',
    })
  } catch (err) {
    console.error('OTP verification error:', err.message)
    res.status(500).json({ success: false, message: 'OTP verification failed' })
  }
}

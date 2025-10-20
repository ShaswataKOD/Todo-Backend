import otpGenerator from 'otp-generator'
import Otp from '../models/otpModel.js'
import User from '../models/userModel.js'
import sendVerificationEmail from '../utils/VerificationMail.js'
import verifyOtpForEmail from '../utils/verifyOtp.js'
import bcrypt from 'bcryptjs'
import createError from '../utils/createError.js'

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

export async function sendOtp(req, res, next) {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      throw createError(404, 'User not found')
      // return res.status(400).json({ success: false, message: 'User not found' })
    }

    if (!user.isVerified) {
      throw createError(404, 'User not Verified')
      // return res
      //   .status(400)
      //   .json({ success: false, message: 'User already verified' })
    }

    await sendOTPInternal(email)

    res.status(200).json({ success: true, message: 'OTP sent successfully' })
  } catch (err) {
    next(err)
    // console.error('Error sending OTP:', err)
    // res.status(500).json({ success: false, message: 'Failed to send OTP' })
  }
}

export async function VerifyOtp(req, res, next) {
  const { email, otp } = req.body

  try {
    const user = await verifyOtpForEmail(email, otp)

    user.isVerified = true

    await user.save()

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. User is now verified.',
    })
  } catch (err) {
    next(err)
    // console.error('OTP verification error:', err.message)
    // res.status(400).json({ success: false, message: err.message })
  }
}

// this needed to use authentication thatis acess token

export async function resetPassword(req, res, next) {
  const { currentPassword, newPassword } = req.body

  try {
    if (!currentPassword || !newPassword) {
      throw createError(400, 'All fields are required')
      // return res
      //   .status(400)
      //   .json({ success: false, message: 'All fields are required' })
    }

    const userID = req.userId

    if (!userID) {
      throw createError(401, 'User not authorised')
      // return res
      //   .status(401)
      //   .json({ succes: false, error: 'Unauthorised to acess the data' })
    }

    const user = await User.findById(userID)

    if (!user) {
      throw createError(404, 'User not found')
      // return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!user.isVerified) {
      throw createError(403, 'Email not verified')
      // return res
      //   .status(403)
      //   .json({ success: false, message: 'Email not verified' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      throw createError(401, 'Incorrect current Password')
      // return res
      //   .status(401)
      //   .json({ success: false, message: 'Incorrect current password' })
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
    next(err)
    //  console.error('Reset password error:', err.message)
    // return res
    //   .status(500)
    //   .json({ success: false, message: 'Internal server error' })
  }
}

// working fixed

// what if the user is already verified then how is this going to handle that issue ?
// ans - design the UI such that this is not reflected
// export async function forgotPassword(req, res, next) {
//   // get the request from the user
//   const { email, otp, currentPassword, newPassword } = req.body
//   // validate first once again
//   try {
//     if (!email || !newPassword) {
//       throw createError(400, 'Enter correct email and password')
//       // return res
//       //   .status(400)
//       //   .json({ success: false, message: 'Enter correct email and password' })
//     }

//     const user = await User.findOne({ email })

//     if (!user.isVerified) {
//       throw createError(403, 'Email not Verified')
//       // return res
//       //   .status(403)
//       //   .json({ sucees: false, message: 'Email not verified' })
//     }

//     if (currentPassword) {

//       const passMatch = await bcrypt.compare(currentPassword, user.password)

//       if (!passMatch) {
//         throw createError(401, 'Incorrect current password')
//         // // return res
//         //   .status(401)
//         //   .json({ sucess: false, message: 'Incorrect current password' })
//       }
//     }
//     else if (otp) {

//       await verifyOtpForEmail(email, otp)

//       const otpRecord = await Otp.findOne({ email, otp }).sort({
//         createdAt: -1,
//       })

//       if (otpRecord) {
//         otpRecord.isUsed = true
//         await otpRecord.save()
//       }
//     } else {
//       throw createError(400, 'Provide correcct OTP or current password')
//       // return res.status(400).json({
//       //   succes: false,
//       //   message: 'Provide correct Otp or current Password',
//       // })
//     }

//     // hash the new passoword and then and save it in the schema
//     const hashedPassword = await bcrypt.hash(newPassword, 10)
//     user.password = hashedPassword

//     await user.save()

//     return res
//       .status(200)
//       .json({ sucees: true, message: 'password reset sucessful' })
//   }
//   catch (error) {
//     next(error)
//     // console.log('Reset Password error', error.message)
//     // return res
//     //   .status(500)
//     //   .json({ sucess: false, message: 'Internal server error' })
//   }
// }

// modified the logic a little

export async function forgotPassword(req, res, next) {
  try {
    const { email, otp, currentPassword, newPassword } = req.body

    if (!email) {
      throw createError(400, 'Email is required')
    }

    const user = await User.findOne({ email })

    if (!user) {
      throw createError(404, 'user not found')
      // return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (!otp && !newPassword && !currentPassword) {
      const generatedOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      })

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

      await Otp.create({ email, otp: generatedOtp, isUsed: false, expiresAt })

      await sendVerificationEmail(email, generatedOtp)

      return res
        .status(200)
        .json({ success: true, message: 'OTP sent successfully' })
    }

    if (otp && !newPassword) {
      await verifyOtpForEmail(email, otp)

      return res
        .status(200)
        .json({ success: true, message: 'OTP verified successfully' })
    }

    if (!newPassword) {
      throw createError(400, 'New password is required for reset')
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password)

      if (!isMatch) {
        throw createError(401, 'Incorrect current password')
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
      throw createError(400, 'Provide either current password or OTP')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword

    await user.save()

    return res
      .status(200)
      .json({ success: true, message: 'Password reset successful' })
  } catch (error) {
    next(error)
  }
}

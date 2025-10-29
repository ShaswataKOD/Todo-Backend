import config from '../config/constants.js'
import nodemailer from 'nodemailer'
// import dotenv from 'dotenv'

// dotenv.config()

const mailSender = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.MAIL_HOST,
      port: config.MAIL_PORT || 587,
      secure: false,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: `"Task Manager" <${config.MAIL_USER}>`,
      to: email,
      subject,
      html,
    })

    return info
  } catch (error) {
    console.error('Mail send error:', error.message)
    throw error
  }
}

export default mailSender

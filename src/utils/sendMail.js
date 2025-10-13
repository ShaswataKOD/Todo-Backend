import nodemailer from 'nodemailer'

const mailSender = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: `"Task Manager" <${process.env.MAIL_USER}>`,
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

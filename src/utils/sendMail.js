import nodemailer from 'nodemailer'

console.log(process.env.MAIL_USER)
console.log(process.env.MAIL_PASS) // this is getting undefined
const mailSender = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: `"Task Manager" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
    })

    return info
  } catch (error) {
    console.error('Mail send error:', error.message)
    throw error // need to use global error checks
  }
}

export default mailSender

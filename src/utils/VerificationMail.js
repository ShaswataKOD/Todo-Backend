import mailSender from './sendMail.js'
import fs from 'fs'
import path from 'path'

async function sendVerificationEmail(email, otp) {
  try {
    const templatePath = path.join(
      process.cwd(),
      'src/templates/otptemplates.html'
    )

    let html = fs.readFileSync(templatePath, 'utf8')

    html = html.replace('{{OTP}}', otp)

    const mailResponse = await mailSender(email, 'Your OTP Code', html)

    console.log('Email sent: ', mailResponse.messageId)
  } catch (err) {
    console.error('Email send failed:', err.message)
    throw err
  }
}

export default sendVerificationEmail

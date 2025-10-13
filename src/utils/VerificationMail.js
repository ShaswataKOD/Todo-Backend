import mailSender from './sendMail.js';

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Your OTP Code",
      `<h2>Your OTP is:</h2><p>${otp}</p><p>Expires in 5 minutes</p>`
    );
    console.log("Email sent: ", mailResponse.messageId);
  } catch (err) {
    console.error("Email send failed:", err.message);
    throw err;
  }
}

export default sendVerificationEmail;

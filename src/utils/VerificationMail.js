import mailSender from "./sendMail.js"



async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Your OTP Code",
      `<h2>Your OTP is:</h2><p>${otp}</p><p>Expires in 5 minutes</p>`
    );
    console.log("Email sent: ", mailResponse);
  } catch (err) {
    console.error("Email send failed:", err);
    throw err;
  }  
}

// otpSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     await sendVerificationEmail(this.email, this.otp);
//   }
//   next();
// });


export default sendVerificationEmail;
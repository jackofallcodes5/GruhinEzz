const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 5000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP VERIFY ERROR:", error);
  } else {
    console.log("✅ SMTP connection is ready");
  }
});

async function sendOtpEmail(to, otp, userName = "there") {
  const mailOptions = {
    from: `"GruhinEzz" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your GruhinEzz Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Hello ${userName}!</h2>

        <p>Your GruhinEzz verification code is:</p>

        <div style="
          text-align:center;
          margin:28px 0;
          background:#f5ece6;
          border:2px solid #48154c;
          border-radius:16px;
          padding:20px;
        ">
          <span style="
            font-size:38px;
            font-weight:700;
            letter-spacing:12px;
            color:#48154c;
          ">
            ${otp}
          </span>
        </div>

        <p>
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
}

module.exports = { sendOtpEmail };
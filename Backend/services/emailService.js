const { Resend } = require("resend");

// Initialize Resend API Client
const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

if (resendClient) {
  console.log("✅ Resend Email Service is ready");
} else {
  console.warn("⚠️ RESEND_API_KEY is missing in environment variables. Emails will not be sent.");
}

async function sendOtpEmail(to, otp, userName = "there") {
  const subject = "Your GruhinEzz Verification Code";
  const htmlContent = `
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
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  if (!resendClient) {
    console.warn(`⚠️ Cannot send email: RESEND_API_KEY is not set. OTP generated for ${to}: ${otp}`);
    return null;
  }

  try {
    let resendFrom = process.env.RESEND_FROM || process.env.EMAIL_FROM;
    // Resend free tier requires sending from onboarding@resend.dev unless custom domain is verified
    if (!resendFrom || resendFrom.includes("gmail.com")) {
      resendFrom = "GruhinEzz <onboarding@resend.dev>";
    }
    const formattedFrom = resendFrom.includes("<") ? resendFrom : `GruhinEzz <${resendFrom}>`;

    const data = await resendClient.emails.send({
      from: formattedFrom,
      to: [to],
      subject,
      html: htmlContent,
    });

    console.log("✅ OTP email sent via Resend HTTP API:", data);
    return data;
  } catch (resendErr) {
    console.error("❌ Resend email failed:", resendErr.message);
    throw resendErr;
  }
}

module.exports = { sendOtpEmail };
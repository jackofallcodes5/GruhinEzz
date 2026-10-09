const { Resend } = require("resend");

// 1. Brevo (Sendinblue) HTTP API Key
const brevoApiKey = process.env.BREVO_API_KEY;

// 2. Resend API Key
const resendApiKey = process.env.RESEND_API_KEY;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

if (brevoApiKey) {
  console.log("✅ Brevo Email Service is ready (Sends free emails to ANY recipient)");
} else if (resendClient) {
  console.log("✅ Resend Email Service is ready");
} else {
  console.warn("⚠️ Neither BREVO_API_KEY nor RESEND_API_KEY is set in environment variables.");
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

  // Strategy A: Brevo HTTP API (300 emails/day FREE to ANY recipient, no domain required)
  if (process.env.BREVO_API_KEY) {
    try {
      const senderEmail = process.env.SENDER_EMAIL || process.env.EMAIL_USER || "gruhinezzecom@gmail.com";
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "GruhinEzz", email: senderEmail },
          to: [{ email: to }],
          subject,
          htmlContent,
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || JSON.stringify(resData));
      }
      console.log(`✅ OTP email sent via Brevo HTTP API to ${to}:`, resData.messageId || resData);
      return resData;
    } catch (brevoErr) {
      console.error("❌ Brevo email failed:", brevoErr.message);
      throw brevoErr;
    }
  }

  // Strategy B: Resend HTTP API
  if (resendClient) {
    try {
      let resendFrom = process.env.RESEND_FROM || process.env.EMAIL_FROM;
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

      console.log(`✅ OTP email sent via Resend HTTP API to ${to}:`, data);
      return data;
    } catch (resendErr) {
      console.error("❌ Resend email failed:", resendErr.message);
      throw resendErr;
    }
  }

  console.warn(`⚠️ No email provider API key configured. OTP for ${to}: ${otp}`);
  return null;
}

module.exports = { sendOtpEmail };
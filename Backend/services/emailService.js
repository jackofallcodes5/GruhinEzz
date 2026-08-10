const nodemailer = require("nodemailer");

/**
 * Creates a nodemailer transporter.
 *
 * Configure these variables in your .env file:
 *   EMAIL_HOST     — e.g. smtp.gmail.com
 *   EMAIL_PORT     — e.g. 587
 *   EMAIL_USER     — your Gmail/SMTP username
 *   EMAIL_PASS     — your Gmail App Password (NOT your real password)
 *   EMAIL_FROM     — display name + address, e.g. "GruhinEzz <no-reply@gruhinezz.com>"
 *
 * For Gmail: enable 2FA → generate an App Password → paste it as EMAIL_PASS.
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an OTP email to the given address.
 *
 * @param {string} to      Recipient email
 * @param {string} otp     6-digit OTP string
 * @param {string} userName Recipient's display name
 */
async function sendOtpEmail(to, otp, userName = "there") {
  const mailOptions = {
    from: process.env.EMAIL_FROM || `"GruhinEzz" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your GruhinEzz Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:0;background:#efe5e5;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#efe5e5;padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0"
                       style="background:#e2cec0;border-radius:24px;padding:48px 40px;max-width:480px;width:100%;">
                  <tr>
                    <td align="center" style="padding-bottom:32px;">
                      <h1 style="margin:0;font-size:1.6rem;color:#48154c;letter-spacing:-0.5px;">GruhinEzz</h1>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p style="margin:0 0 8px;font-size:1.1rem;font-weight:600;color:#2d2130;">
                        Hi ${userName}!
                      </p>
                      <p style="margin:0 0 28px;font-size:0.95rem;color:#5a4a52;line-height:1.6;">
                        Use the verification code below to complete your sign in to GruhinEzz.
                        This code expires in <strong>10 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="text-align:center;margin:0 0 28px;">
                        <div style="display:inline-block;background:#f5ece6;border:2px solid #48154c;
                                    border-radius:16px;padding:20px 40px;">
                          <span style="font-size:2.4rem;font-weight:700;letter-spacing:12px;color:#48154c;">
                            ${otp}
                          </span>
                        </div>
                      </div>

                      <p style="margin:0;font-size:0.85rem;color:#8a7f7a;text-align:center;">
                        If you didn't request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };

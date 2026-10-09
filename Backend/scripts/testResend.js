require("dotenv").config({ path: __dirname + "/../.env" });
const { sendOtpEmail } = require("../services/emailService");

async function test() {
  try {
    console.log("Testing sendOtpEmail with Resend API key...");
    // Resend free tier sends to the registered email address (e.g. gaurangsandeepdeshpande@gmail.com or recipient)
    const res = await sendOtpEmail("gaurangsandeepdeshpande@gmail.com", "999888", "Gaurang");
    console.log("RESULT:", res);
  } catch (err) {
    console.error("TEST FAILED:", err);
  }
}

test();

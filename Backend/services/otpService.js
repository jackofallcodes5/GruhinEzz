/**
 * In-memory OTP store.
 *
 * Structure: Map<email, { otp: string, expiresAt: number, attempts: number }>
 *
 * This is fine for a single-instance server (dev / MVP).
 * For multi-instance deployments, swap this for a Redis store.
 */
const otpStore = new Map();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

/** Generate a random 6-digit numeric OTP. */
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Create and store a new OTP for the given email.
 * Any previous OTP for that email is overwritten.
 * @param {string} email
 * @returns {string} The generated OTP (for sending via email)
 */
function createOtp(email) {
  const otp = generateOtp();
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
  return otp;
}

/**
 * Verify the OTP submitted by the user.
 *
 * @param {string} email
 * @param {string} submittedOtp
 * @returns {{ valid: boolean, reason?: string }}
 */
function verifyOtp(email, submittedOtp) {
  const key = email.toLowerCase();
  const record = otpStore.get(key);

  if (!record) {
    return { valid: false, reason: "No OTP was requested for this email." };
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return { valid: false, reason: "OTP has expired. Please request a new one." };
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(key);
    return { valid: false, reason: "Too many incorrect attempts. Please request a new OTP." };
  }

  record.attempts += 1;

  if (record.otp !== String(submittedOtp).trim()) {
    return { valid: false, reason: "Incorrect OTP. Please try again." };
  }

  // Valid — clean up so it can't be reused
  otpStore.delete(key);
  return { valid: true };
}

module.exports = { createOtp, verifyOtp };

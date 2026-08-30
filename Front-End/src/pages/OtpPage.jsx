import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import PrimaryButton from "../components/PrimaryButton";
import { sendOtp, verifyOtp } from "../services/authService";
import "./AuthForm.css";
import "./OtpPage.css";

/**
 * OTP verification page.
 *
 * Expects navigation state:
 *   { email, userName, role, token, user }
 *
 * Flow:
 *  1. User arrives on OTP page after login/signup. OTP is NOT sent automatically on mount.
 *  2. User clicks "Send OTP" button to generate & receive their 6-digit verification code.
 *  3. User enters the 6 digits and clicks "Verify & Continue".
 *  4. On successful verification, commits token + user to localStorage and redirects to dashboard.
 */
export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Grab data passed from LoginPage / SignUpPage
  const { email, userName, role, token, user } = location.state || {};

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const inputRefs = useRef([]);

  // Redirect to login if someone navigates here directly without state
  useEffect(() => {
    if (!email || !token) {
      navigate("/login", { replace: true });
    }
  }, [email, token, navigate]);

  // NOTE: Automatic sendOtp on mount is explicitly disabled as requested.
  // OTP is only generated when the user clicks Send OTP / Resend OTP.

  async function triggerSendOtp() {
    setError("");
    setSendingOtp(true);
    try {
      await sendOtp(email, userName);
      setOtpSent(true);
      startCooldown();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setSendingOtp(false);
    }
  }

  function startCooldown(seconds = 60) {
    setResendCooldown(seconds);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // ── Digit box handlers ──────────────────────────────────────────────────────

  function handleDigitChange(index, value) {
    // Accept only a single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    // Auto-advance
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = [...digits];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    // Focus the box after the last pasted digit
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  }

  // ── Submit Verification ─────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!otpSent) {
      setError("Please click 'Send OTP' to receive your verification code first.");
      return;
    }

    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const verifyData = await verifyOtp(email, otp);

      // OTP verified — store token + user, plus session token for persistent login
      localStorage.setItem("gruhinezz_token", token);
      const userToStore = verifyData?.user || user;
      localStorage.setItem("gruhinezz_user", JSON.stringify(userToStore));
      // Store session token so app can skip login on next visit
      if (verifyData?.sessionToken) {
        localStorage.setItem("gruhinezz_session", verifyData.sessionToken);
      }

      // Directly redirect based on role
      if (userToStore.role === "seller") {
        navigate("/seller/setup/info", { replace: true });
      } else if (userToStore.role === "ngo") {
        navigate("/ngo/setup/identity", { replace: true });
      } else {
        navigate("/dashboard/buyer", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Incorrect OTP. Please try again."
      );
      // Shake the boxes on wrong OTP
      inputRefs.current[0]?.parentElement?.classList.add("otp-boxes--shake");
      setTimeout(() => {
        inputRefs.current[0]?.parentElement?.classList.remove(
          "otp-boxes--shake"
        );
      }, 500);
    } finally {
      setLoading(false);
    }
  }

  // ── Send / Resend OTP ───────────────────────────────────────────────────────

  async function handleSendOtpClick() {
    if (resendCooldown > 0 || sendingOtp) return;
    setDigits(["", "", "", "", "", ""]);
    await triggerSendOtp();
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }

  if (!email) return null;

  const maskedEmail = email.replace(/(.{2}).+(@.+)/, "$1•••$2");

  return (
    <AuthLayout activeRole={role || "buyer"} onRoleChange={() => {}}>
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Header */}
        <div className="otp-header">
          <div className="otp-icon">📧</div>
          <h2 className="otp-title">Verify Your Email</h2>
          <p className="otp-subtitle">
            {otpSent ? (
              <>
                We've sent a 6-digit code to{" "}
                <strong>{maskedEmail}</strong>.
                <br />
                Enter it below to continue.
              </>
            ) : (
              <>
                Click <strong>"Send OTP"</strong> below to receive your verification code for{" "}
                <strong>{maskedEmail}</strong>.
              </>
            )}
          </p>
        </div>

        {/* 6-digit boxes */}
        <div className="otp-boxes" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              className={`otp-box ${d ? "otp-box--filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              disabled={!otpSent}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        {/* Action Button */}
        {!otpSent ? (
          <PrimaryButton
            type="button"
            onClick={handleSendOtpClick}
            disabled={sendingOtp}
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </PrimaryButton>
        ) : (
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </PrimaryButton>
        )}

        {/* Resend Link / Countdown Timer */}
        {otpSent && (
          <p className="auth-form__switch">
            Didn't receive the code?{" "}
            {resendCooldown > 0 ? (
              <span className="otp-resend-timer">
                Resend in {resendCooldown}s
              </span>
            ) : (
              <button
                type="button"
                className="otp-resend-btn"
                onClick={handleSendOtpClick}
                disabled={sendingOtp}
              >
                {sendingOtp ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

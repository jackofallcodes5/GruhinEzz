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
 *  1. On mount, calls /api/auth/send-otp so the code arrives in the inbox.
 *  2. User types 6 digits (auto-focus jumps between boxes).
 *  3. On submit, calls /api/auth/verify-otp.
 *  4. On success, commits token + user to localStorage and redirects to dashboard.
 */
export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Grab data passed from LoginPage / SignUpPage
  const { email, userName, role, token, user } = location.state || {};

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const inputRefs = useRef([]);

  // Redirect to login if someone navigates here directly without state
  useEffect(() => {
    if (!email || !token) {
      navigate("/login", { replace: true });
    }
  }, [email, token, navigate]);

  // Send OTP as soon as the page mounts
  useEffect(() => {
    if (email) {
      triggerSendOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function triggerSendOtp() {
    try {
      await sendOtp(email, userName);
      setOtpSent(true);
      startCooldown();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send OTP. Please check your email configuration."
      );
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

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const otp = digits.join("");
    if (otp.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email, otp);

      // OTP verified — now commit token + user and go to the dashboard
      localStorage.setItem("gruhinezz_token", token);
      localStorage.setItem("gruhinezz_user", JSON.stringify(user));
      navigate(`/dashboard/${user.role}`, { replace: true });
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

  // ── Resend ─────────────────────────────────────────────────────────────────

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError("");
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    await triggerSendOtp();
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
              "Sending verification code…"
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
              autoFocus={i === 0}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`OTP digit ${i + 1}`}
            />
          ))}
        </div>

        {error && <p className="auth-form__error">{error}</p>}

        <PrimaryButton type="submit" disabled={loading}>
          Verify & Continue
        </PrimaryButton>

        {/* Resend */}
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
              onClick={handleResend}
            >
              Resend OTP
            </button>
          )}
        </p>
      </form>
    </AuthLayout>
  );
}

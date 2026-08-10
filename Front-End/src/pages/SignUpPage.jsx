import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import FormField from "../components/FormField";
import PrimaryButton from "../components/PrimaryButton";
import { signUp, sendOtp } from "../services/authService";
import "./AuthForm.css";

export default function SignUpPage() {
  const [role, setRole] = useState("buyer");
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    contactNo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await signUp({ role, ...form });
      // Don't store token yet — wait for OTP verification
      await sendOtp(user.email, user.userName);
      navigate("/verify-otp", {
        state: { email: user.email, userName: user.userName, role: user.role, token, user },
        replace: true,
      });
    } catch (err) {
  setError(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
} finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout activeRole={role} onRoleChange={setRole}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField
          name="userName"
          placeholder="Enter User Name"
          value={form.userName}
          onChange={handleChange}
          autoComplete="name"
        />
        <FormField
          name="email"
          type="email"
          placeholder="Enter Email-ID"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
        <FormField
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <FormField
          name="contactNo"
          type="tel"
          placeholder="Contact No"
          value={form.contactNo}
          onChange={handleChange}
          autoComplete="tel"
        />

        {error && <p className="auth-form__error">{error}</p>}

        <PrimaryButton type="submit" disabled={loading}>
          Continue
        </PrimaryButton>

        <p className="auth-form__switch">
          Have Account ? <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import FormField from "../components/FormField";
import PrimaryButton from "../components/PrimaryButton";
import { logIn } from "../services/authService";
import "./AuthForm.css";

export default function LoginPage() {
  const [role, setRole] = useState("buyer");
  const [form, setForm] = useState({ email: "", password: "" });
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
      // TODO: Connect this function to the Node.js backend.
      const { token } = await logIn({ role, ...form });
      localStorage.setItem("gruhinezz_token", token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout activeRole={role} onRoleChange={setRole}>
      <form className="auth-form" onSubmit={handleSubmit}>
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
          autoComplete="current-password"
        />

        {error && <p className="auth-form__error">{error}</p>}

        <PrimaryButton type="submit" disabled={loading}>
          Continue
        </PrimaryButton>

        <p className="auth-form__switch">
          Don't Have Account ? <Link to="/signup">SignUp</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

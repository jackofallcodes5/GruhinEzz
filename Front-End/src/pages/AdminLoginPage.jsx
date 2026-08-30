import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/admin/login", { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem("gruhinezz_admin_token", response.data.token);
        localStorage.setItem("gruhinezz_admin_user", JSON.stringify(response.data.user));
        navigate("/admin/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Admin Credentials. Please check ENV values.");
    } finally {
      setLoading(false);
    }
  };

  const useDefaultCreds = () => {
    setEmail("admin@gruhinezz.com");
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-[#2D1623] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#7A1F49]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#ae3a65]/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#3D1D30]/90 border border-[#5E2546] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-[#7A1F49] flex items-center justify-center text-white shadow-lg mb-4">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
            GruhinEzz Admin
          </h1>
          <p className="text-xs text-[#C79AA7] mt-1.5">
            Portal Control & Partner Verification Dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/40 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 text-red-200 text-xs">
            <AlertCircle size={18} className="shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#E9CDD3] mb-2 uppercase tracking-wider">
              Admin Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C79AA7]">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gruhinezz.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#25111D] border border-[#5E2546] text-white placeholder-[#8A5468] text-sm focus:outline-none focus:border-[#ae3a65] focus:ring-1 focus:ring-[#ae3a65] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E9CDD3] mb-2 uppercase tracking-wider">
              Admin Secret Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#C79AA7]">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#25111D] border border-[#5E2546] text-white placeholder-[#8A5468] text-sm focus:outline-none focus:border-[#ae3a65] focus:ring-1 focus:ring-[#ae3a65] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7A1F49] to-[#ae3a65] hover:from-[#8e2455] hover:to-[#be4372] text-white font-medium py-3.5 text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Authenticating Admin..." : "Login to Admin Dashboard"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#5E2546]/60 text-center">
          <button
            type="button"
            onClick={useDefaultCreds}
            className="text-xs text-[#E9CDD3] hover:text-white underline underline-offset-4 decoration-[#ae3a65]"
          >
            Click to fill default ENV credentials (admin@gruhinezz.com)
          </button>
        </div>
      </div>
    </div>
  );
}

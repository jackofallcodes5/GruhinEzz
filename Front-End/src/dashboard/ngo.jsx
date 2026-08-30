import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import apiClient from "../services/apiClient";
import logoImg from "../assets/logo.png";
import {
  Lock, CheckCircle2, AlertTriangle, HeartHandshake, Users,
  BarChart3, Sparkles, Plus, RefreshCw, Award
} from "lucide-react";
import "./dashboard.css";

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const checkUserVerification = async (parsedUser) => {
    try {
      const response = await apiClient.get("/auth/me");
      if (response.data?.user) {
        setIsVerified(Boolean(response.data.user.isVerified));
        setUser(response.data.user);
        localStorage.setItem("gruhinezz_user", JSON.stringify(response.data.user));
      } else {
        setIsVerified(Boolean(parsedUser.isVerified));
      }
    } catch (err) {
      console.warn("Failed to check NGO verification status:", err.message);
      setIsVerified(Boolean(parsedUser.isVerified));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("gruhinezz_user");
    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "ngo") {
      navigate(`/dashboard/${parsed.role}`, { replace: true });
      return;
    }
    setUser(parsed);
    setIsVerified(Boolean(parsed.isVerified));
    checkUserVerification(parsed);
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const navItems = [
    { key: "overview", icon: "🏠", label: "Overview" },
    { key: "programs", icon: "🌱", label: "Empowerment Programs", locked: !isVerified },
    { key: "partnerships", icon: "🤝", label: "Partnerships", locked: !isVerified },
    { key: "reports", icon: "📊", label: "Impact Reports", locked: !isVerified },
    { key: "settings", icon: "⚙️", label: "Settings", locked: !isVerified },
  ];

  return (
    <div className="dashboard-page">
      {/* ── Sidebar ── */}
      <div className={`dashboard-sidebar ${mobileNavOpen ? "dashboard-sidebar--open" : ""}`}>
        <div className="flex items-center gap-2 px-4 pb-5 pt-2 border-b border-[#e2d3c8]">
          <img src={logoImg} alt="GruhinEzz" className="h-8 w-auto object-contain" />
          <div>
            <div className="dashboard-logo" style={{ padding: 0, border: "none", marginBottom: 0 }}>GruhinEzz</div>
            <p className="text-[10px] text-[#7a6070]">NGO Partner Portal</p>
          </div>
        </div>

        {/* Verification Status Badge in Sidebar */}
        <div className="px-4 py-3 bg-[#f5ece6] border-b border-[#e2d3c8] flex items-center justify-between text-xs">
          <span className="text-[#48154c] font-medium">Status:</span>
          {isVerified ? (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 flex items-center gap-1">
              <Lock size={12} /> Pending Admin
            </span>
          )}
        </div>

        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <a
              key={item.key}
              href="#"
              className={`dashboard-nav__item ${activeTab === item.key ? "active" : ""} ${
                item.locked ? "opacity-60 cursor-not-allowed" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                if (item.locked) {
                  alert("🔒 NGO Portal Locked: Your legal documents are under Admin Verification. Once verified by Admin, all features will unlock!");
                  return;
                }
                setActiveTab(item.key);
                setMobileNavOpen(false);
              }}
            >
              <span className="flex items-center gap-2">
                {item.icon} {item.label}
              </span>
              {item.locked && <Lock size={13} className="ml-auto text-[#ae3a65]" />}
            </a>
          ))}
        </nav>

        <button className="dashboard-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {mobileNavOpen && (
        <div className="dashboard-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      <main className="dashboard-main flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="dashboard-mobile-header">
          <button
            className="dashboard-hamburger"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <span className="dashboard-mobile-logo">GruhinEzz</span>
          <div className="dashboard-avatar dashboard-avatar--sm">
            {user.userName?.[0]?.toUpperCase()}
          </div>
        </div>

        <header className="dashboard-header flex items-center justify-between">
          <div>
            <h1 className="dashboard-header__title flex items-center gap-2">
              Welcome, {user.userName}! 🤝
              {isVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-700 text-white text-xs font-bold font-sans">
                  Verified NGO Partner ✅
                </span>
              )}
            </h1>
            <p className="dashboard-header__subtitle">
              GruhinEzz NGO Partner Portal — Women Empowerment & Community Impact
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              checkUserVerification(user);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e2d3c8] bg-white text-xs text-[#48154c] hover:bg-[#f5ece6]"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh Status
          </button>
        </header>

        {/* Dynamic Verification Banner */}
        <div className="px-6 pt-6">
          {!isVerified ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-xl text-amber-800 shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-amber-950 font-serif">
                    NGO Verification Pending Admin Review
                  </h3>
                  <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                    Your registration certificate, PAN card, and 80G/12A compliance documents have been received. GruhinEzz Admin is verifying your organization. NGO programs, artisan training, and funding portals are <strong>locked</strong> until approval.
                  </p>
                </div>
              </div>
              <button
                onClick={() => checkUserVerification(user)}
                className="shrink-0 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
              >
                Check Verification
              </button>
            </div>
          ) : (
            <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-purple-950 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-200 rounded-xl text-purple-800 shrink-0">
                  <Award size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-purple-950 font-serif">
                    NGO Partner Portal Fully Unlocked! 🌱
                  </h3>
                  <p className="text-xs text-purple-800 leading-relaxed mt-0.5">
                    Congratulations! Your NGO legal documents & representative credentials have been verified by GruhinEzz Admin. You can now launch skill development programs, manage beneficiary women, and access community grants!
                  </p>
                </div>
              </div>
              <div className="shrink-0 px-3.5 py-1.5 bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                <Sparkles size={14} /> NGO Verified
              </div>
            </div>
          )}
        </div>

        {/* Dashboard Main Content Grid */}
        <div className="p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#e2d3c8] rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7a6070]">Beneficiary Women</p>
                <p className="text-2xl font-bold text-[#2d2130] mt-1">
                  {isVerified ? "128 Enrolled" : "0 (Locked)"}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isVerified ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"}`}>
                <Users size={22} />
              </div>
            </div>

            <div className="bg-white border border-[#e2d3c8] rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7a6070]">Skill Training Programs</p>
                <p className="text-2xl font-bold text-[#2d2130] mt-1">
                  {isVerified ? "6 Active" : "0 (Locked)"}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isVerified ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-400"}`}>
                <HeartHandshake size={22} />
              </div>
            </div>

            <div className="bg-white border border-[#e2d3c8] rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7a6070]">Community Impact Score</p>
                <p className="text-2xl font-bold text-[#2d2130] mt-1">
                  {isVerified ? "94.5 / 100" : "N/A (Locked)"}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isVerified ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                <BarChart3 size={22} />
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Create Program */}
            <div className={`bg-white border rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all ${
              isVerified ? "border-[#e2d3c8] hover:border-purple-600" : "border-gray-200 bg-gray-50/70 opacity-90"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2.5 rounded-2xl text-lg ${isVerified ? "bg-[#f5ece6] text-[#48154c]" : "bg-gray-200 text-gray-500"}`}>
                  🌱
                </span>
                {!isVerified ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 flex items-center gap-1">
                    <Lock size={12} /> Locked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-300">
                    Unlocked ✅
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2d2130]">Launch Women Skill Program</h3>
              <p className="text-xs text-[#7a6070] mt-1 leading-relaxed">
                Create new artisan training, micro-entrepreneurship workshops, and financial literacy drives for women.
              </p>
              <button
                onClick={() => {
                  if (!isVerified) {
                    alert("🔒 NGO features are locked until Admin verifies your registration documents.");
                  } else {
                    alert("✨ NGO Program Creation Unlocked! You can now launch new empowerment programs.");
                  }
                }}
                className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isVerified
                    ? "bg-purple-800 hover:bg-purple-900 text-white shadow-xs"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {!isVerified ? <Lock size={14} /> : <Plus size={14} />}
                {!isVerified ? "Locked Until Verification" : "Launch New Program"}
              </button>
            </div>

            {/* Card 2: Beneficiary Network */}
            <div className={`bg-white border rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all ${
              isVerified ? "border-[#e2d3c8] hover:border-purple-600" : "border-gray-200 bg-gray-50/70 opacity-90"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2.5 rounded-2xl text-lg ${isVerified ? "bg-[#f5ece6] text-[#48154c]" : "bg-gray-200 text-gray-500"}`}>
                  👩‍🌾
                </span>
                {!isVerified ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 flex items-center gap-1">
                    <Lock size={12} /> Locked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold border border-purple-300">
                    Unlocked ✅
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2d2130]">Connect Household Entrepreneurs</h3>
              <p className="text-xs text-[#7a6070] mt-1 leading-relaxed">
                Connect trained household women directly with the GruhinEzz Seller Network to help them start selling online.
              </p>
              <button
                onClick={() => {
                  if (!isVerified) {
                    alert("🔒 Network connection is locked until Admin verifies your NGO account.");
                  } else {
                    alert("✨ Beneficiary Network Unlocked! Onboard women entrepreneurs directly to GruhinEzz marketplace.");
                  }
                }}
                className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isVerified
                    ? "bg-[#48154c] hover:bg-[#6b2370] text-white shadow-xs"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {!isVerified ? <Lock size={14} /> : <Users size={14} />}
                {!isVerified ? "Locked Until Verification" : "Manage Beneficiaries"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

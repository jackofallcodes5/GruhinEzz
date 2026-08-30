import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import logoImg from "../assets/logo.png";
import "./dashboard.css";

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const navItems = [
    { icon: "🏠", label: "Overview", active: true },
    { icon: "🌱", label: "Programs" },
    { icon: "🤝", label: "Partnerships" },
    { icon: "📊", label: "Reports" },
    { icon: "⚙️", label: "Settings" },
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
        <nav className="dashboard-nav">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`dashboard-nav__item${item.active ? " active" : ""}`}
              onClick={(e) => { e.preventDefault(); setMobileNavOpen(false); }}
            >
              {item.icon} {item.label}
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

        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-header__title">
              Welcome, {user.userName}! 🤝
            </h1>
            <p className="dashboard-header__subtitle">
              GruhinEzz NGO Partner Portal — Women Empowerment & Community Impact
            </p>
          </div>
          <div className="dashboard-avatar">
            {user.userName?.[0]?.toUpperCase()}
          </div>
        </header>

        {/* Blank Dashboard Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="bg-white border border-[#e2d3c8] rounded-3xl p-8 sm:p-12 max-w-xl text-center shadow-xs space-y-4">
            <div className="w-16 h-16 bg-[#f5ece6] text-[#48154c] rounded-2xl flex items-center justify-center text-3xl mx-auto">
              🌱
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2d2130] font-serif">
              NGO Partner Account Verified & Active
            </h2>
            <p className="text-sm text-[#7a6070] leading-relaxed">
              Your 3-step NGO setup is complete. This portal will serve as your hub to manage community programs, beneficiary networks, and impact reports.
            </p>
            <div className="pt-4 border-t border-[#e2d3c8] text-xs text-[#48154c] font-medium">
              Registered NGO Partner: <strong className="text-[#ae3a65]">{user.userName}</strong> ({user.email})
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function SellerDashboard() {
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
    if (parsed.role !== "seller") {
      navigate(`/dashboard/${parsed.role}`, { replace: true });
      return;
    }
    setUser(parsed);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("gruhinezz_token");
    localStorage.removeItem("gruhinezz_user");
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const navItems = [
    { icon: "🏠", label: "Overview" },
    { icon: "➕", label: "Add Property" },
    { icon: "📦", label: "My Listings" },
    { icon: "📩", label: "Enquiries" },
    { icon: "📊", label: "Analytics" },
    { icon: "⚙️", label: "Settings" },
  ];

  return (
    <div className="dashboard-page">
      {/* ── Sidebar ── */}
      <div className={`dashboard-sidebar ${mobileNavOpen ? "dashboard-sidebar--open" : ""}`}>
        <div className="dashboard-logo">GruhinEzz</div>
        <nav className="dashboard-nav">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`dashboard-nav__item${idx === 0 ? " active" : ""}`}
              onClick={() => setMobileNavOpen(false)}
            >
              {item.icon} {item.label}
            </a>
          ))}
        </nav>
        <button className="dashboard-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="dashboard-overlay" onClick={() => setMobileNavOpen(false)} />
      )}

      <main className="dashboard-main">
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
              Welcome back, {user.userName}! 👋
            </h1>
            <p className="dashboard-header__subtitle">
              Manage your property listings and respond to buyers.
            </p>
          </div>
          <div className="dashboard-avatar">
            {user.userName?.[0]?.toUpperCase()}
          </div>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-card__icon">🏘️</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Active Listings</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">📩</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">New Enquiries</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">👁️</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Total Views</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">✅</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Deals Closed</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section__title">My Listings</h2>
          <div className="dashboard-empty">
            <span className="dashboard-empty__icon">🏘️</span>
            <p>You haven't listed any properties yet. Click "Add Property" to get started.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  return (
    <div className="dashboard-page">
      <div className="dashboard-sidebar">
        <div className="dashboard-logo">GruhinEzz</div>
        <nav className="dashboard-nav">
          <a href="#" className="dashboard-nav__item active">🏠 Overview</a>
          <a href="#" className="dashboard-nav__item">➕ Add Property</a>
          <a href="#" className="dashboard-nav__item">📦 My Listings</a>
          <a href="#" className="dashboard-nav__item">📩 Enquiries</a>
          <a href="#" className="dashboard-nav__item">📊 Analytics</a>
          <a href="#" className="dashboard-nav__item">⚙️ Settings</a>
        </nav>
        <button className="dashboard-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <main className="dashboard-main">
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

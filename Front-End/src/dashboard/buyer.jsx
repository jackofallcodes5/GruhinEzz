import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("gruhinezz_user");
    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.role !== "buyer") {
      // Wrong role — redirect to their correct dashboard
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
          <a href="#" className="dashboard-nav__item">🔍 Browse Properties</a>
          <a href="#" className="dashboard-nav__item">❤️ Saved</a>
          <a href="#" className="dashboard-nav__item">📋 My Enquiries</a>
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
              Here's what's happening in your property search today.
            </p>
          </div>
          <div className="dashboard-avatar">
            {user.userName?.[0]?.toUpperCase()}
          </div>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-card__icon">🏠</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Saved Properties</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">📋</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Active Enquiries</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">🗓️</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Site Visits Scheduled</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">🔔</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">New Alerts</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section__title">Recommended Properties</h2>
          <div className="dashboard-empty">
            <span className="dashboard-empty__icon">🔍</span>
            <p>No properties to show yet. Start browsing to get personalized recommendations.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

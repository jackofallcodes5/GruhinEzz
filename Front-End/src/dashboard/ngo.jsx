import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function NgoDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
          <a href="#" className="dashboard-nav__item">🌱 Programs</a>
          <a href="#" className="dashboard-nav__item">🤝 Partnerships</a>
          <a href="#" className="dashboard-nav__item">📊 Reports</a>
          <a href="#" className="dashboard-nav__item">📢 Announcements</a>
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
              Manage your NGO programs and track community impact.
            </p>
          </div>
          <div className="dashboard-avatar">
            {user.userName?.[0]?.toUpperCase()}
          </div>
        </header>

        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-card__icon">🌱</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Active Programs</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">👥</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Beneficiaries</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">🤝</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Partnerships</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-card__icon">📊</span>
            <div>
              <p className="stat-card__value">0</p>
              <p className="stat-card__label">Impact Reports</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="dashboard-section__title">Recent Activity</h2>
          <div className="dashboard-empty">
            <span className="dashboard-empty__icon">🌱</span>
            <p>No recent activity yet. Start by setting up your first program.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

import logo from "../assets/logo.png";
import RoleTabs from "../components/RoleTabs";
import "./AuthLayout.css";

/**
 * Shared two-column layout for the Sign Up and Log In screens:
 * left side shows the GruhinEzz logo, right side shows the form.
 * The role tabs sit centered above both columns, matching the design.
 */
export default function AuthLayout({ activeRole, onRoleChange, children }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__tabs">
          <RoleTabs activeRole={activeRole} onChange={onRoleChange} />
        </div>

        <div className="auth-card__body">
          <div className="auth-card__logo">
            <img src={logo} alt="GruhinEzz" />
          </div>

          <div className="auth-card__form">{children}</div>
        </div>
      </div>
    </div>
  );
}

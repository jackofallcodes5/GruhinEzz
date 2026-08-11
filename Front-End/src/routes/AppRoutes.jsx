import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import OtpPage from "../pages/OtpPage";
import BuyerDashboard from "../dashboard/buyer";
import SellerDashboard from "../dashboard/seller";
import NgoDashboard from "../dashboard/ngo";

/**
 * PrivateRoute — redirects to /login if no token is stored.
 */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("gruhinezz_token");
  return token ? children : <Navigate to="/login" replace />;
}

/**
 * Top-level route table.
 *
 * /dashboard        — redirects to the role-specific dashboard based on stored user
 * /dashboard/buyer  — Buyer dashboard (protected)
 * /dashboard/seller — Seller dashboard (protected)
 * /dashboard/ngo    — NGO dashboard (protected)
 */
export default function AppRoutes() {
  function getRoleDashboardPath() {
    const stored = localStorage.getItem("gruhinezz_user");
    if (!stored) return "/login";
    try {
      const { role } = JSON.parse(stored);
      return `/dashboard/${role}`;
    } catch {
      return "/login";
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" replace />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verify-otp" element={<OtpPage />} />

      {/* Generic /dashboard → redirect to role-specific path */}
      <Route
        path="/dashboard"
        element={<Navigate to={getRoleDashboardPath()} replace />}
      />

      {/* Role-specific protected dashboards */}
      <Route
        path="/dashboard/buyer"
        element={
          <PrivateRoute>
            <BuyerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/seller"
        element={
          <PrivateRoute>
            <SellerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/ngo"
        element={
          <PrivateRoute>
            <NgoDashboard />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

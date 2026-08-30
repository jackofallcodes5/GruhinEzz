import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import SignUpPage from "../pages/SignUpPage";
import LoginPage from "../pages/LoginPage";
import OtpPage from "../pages/OtpPage";
import BuyerDashboard from "../dashboard/buyer";
import SellerDashboard from "../dashboard/seller";
import NgoDashboard from "../dashboard/ngo";

import SellerInfoPage from "../sellersetup/SellerInfoPage";
import BusinessSetupPage from "../sellersetup/BusinessSetupPage";
import BankSetupPage from "../sellersetup/BankSetupPage";

import NgoIdentityPage from "../ngosetup/NgoIdentityPage";
import NgoContactPage from "../ngosetup/NgoContactPage";
import NgoLegalPage from "../ngosetup/NgoLegalPage";

import AdminLoginPage from "../pages/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";

import { checkSession } from "../services/authService";

/**
 * PrivateRoute — requires valid authentication token or verified cookie session.
 */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("gruhinezz_token");
  const stored = localStorage.getItem("gruhinezz_user");
  return token || stored ? children : <Navigate to="/login" replace />;
}

function AdminPrivateRoute({ children }) {
  const adminToken = localStorage.getItem("gruhinezz_admin_token");
  return adminToken ? children : <Navigate to="/admin" replace />;
}

function AdminLoginRoute() {
  const adminToken = localStorage.getItem("gruhinezz_admin_token");
  return adminToken ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginPage />;
}

export default function AppRoutes() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [verifiedUser, setVerifiedUser] = useState(null);

  useEffect(() => {
    async function verifyCookieSession() {
      const existingToken = localStorage.getItem("gruhinezz_token");
      const existingUser = localStorage.getItem("gruhinezz_user");

      // If already have valid local storage data, no need to check server
      if (existingToken && existingToken !== "cookie-verified-token" && existingUser) {
        try {
          const u = JSON.parse(existingUser);
          setVerifiedUser(u);
        } catch (e) {}
        setCheckingSession(false);
        return;
      }

      // Otherwise check server-side cookie session
      try {
        const sessionData = await checkSession();
        if (sessionData && sessionData.authenticated && sessionData.isVerified) {
          setVerifiedUser(sessionData.user);
          localStorage.setItem("gruhinezz_user", JSON.stringify(sessionData.user));
          if (!localStorage.getItem("gruhinezz_token")) {
            localStorage.setItem("gruhinezz_token", "cookie-verified-token");
          }
        }
      } catch (err) {
        console.warn("Session check failed:", err.message);
      } finally {
        setCheckingSession(false);
      }
    }

    verifyCookieSession();
  }, []);

  function getRoleDashboardPath() {
    const stored = localStorage.getItem("gruhinezz_user");
    if (!stored && !verifiedUser) return "/login";
    try {
      const user = verifiedUser || JSON.parse(stored);
      if (user.role === "seller") {
        const setupComplete = localStorage.getItem("gruhinezz_seller_setup_complete");
        if (!setupComplete) {
          return "/seller/setup/info";
        }
      }
      if (user.role === "ngo") {
        const setupComplete = localStorage.getItem("gruhinezz_ngo_setup_complete");
        if (!setupComplete) {
          return "/ngo/setup/identity";
        }
      }
      return `/dashboard/${user.role}`;
    } catch {
      return "/login";
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#efe5e5] text-[#48154c] font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#48154c] border-t-transparent rounded-full animate-spin"></div>
          <p>Loading GruhinEzz...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* If cookie session is verified, direct redirect to dashboard without login prompt */}
      <Route
        path="/"
        element={
          verifiedUser || localStorage.getItem("gruhinezz_token") ? (
            <Navigate to={getRoleDashboardPath()} replace />
          ) : (
            <Navigate to="/signup" replace />
          )
        }
      />
      <Route
        path="/signup"
        element={
          verifiedUser || localStorage.getItem("gruhinezz_token") ? (
            <Navigate to={getRoleDashboardPath()} replace />
          ) : (
            <SignUpPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          verifiedUser || localStorage.getItem("gruhinezz_token") ? (
            <Navigate to={getRoleDashboardPath()} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/verify-otp" element={<OtpPage />} />

      {/* Generic /dashboard → redirect to role-specific path */}
      <Route
        path="/dashboard"
        element={<Navigate to={getRoleDashboardPath()} replace />}
      />

      {/* Protected dashboards */}
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

      {/* Seller Setup Routes */}
      <Route
        path="/seller/setup/info"
        element={
          <PrivateRoute>
            <SellerInfoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/seller/setup/business"
        element={
          <PrivateRoute>
            <BusinessSetupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/seller/setup/bank"
        element={
          <PrivateRoute>
            <BankSetupPage />
          </PrivateRoute>
        }
      />

      {/* NGO Setup Routes */}
      <Route
        path="/ngo/setup/identity"
        element={
          <PrivateRoute>
            <NgoIdentityPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ngo/setup/contact"
        element={
          <PrivateRoute>
            <NgoContactPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/ngo/setup/legal"
        element={
          <PrivateRoute>
            <NgoLegalPage />
          </PrivateRoute>
        }
      />

      {/* Admin Routes — Isolated directly at /admin */}
      <Route path="/admin" element={<AdminLoginRoute />} />
      <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminPrivateRoute>
            <AdminDashboardPage />
          </AdminPrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/signup" replace />} />
    </Routes>
  );
}

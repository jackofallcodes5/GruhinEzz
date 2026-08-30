import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import apiClient from "../services/apiClient";
import logoImg from "../assets/logo.png";
import {
  Lock, CheckCircle2, AlertTriangle, Package, ShoppingBag,
  DollarSign, Sparkles, Plus, Settings, Store, RefreshCw
} from "lucide-react";
import "./dashboard.css";

export default function SellerDashboard() {
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
        // update local storage
        localStorage.setItem("gruhinezz_user", JSON.stringify(response.data.user));
      } else {
        setIsVerified(Boolean(parsedUser.isVerified));
      }
    } catch (err) {
      console.warn("Failed to check verification status:", err.message);
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
    if (parsed.role !== "seller") {
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
    { key: "products", icon: "📦", label: "My Products", locked: !isVerified },
    { key: "orders", icon: "📩", label: "Orders", locked: !isVerified },
    { key: "earnings", icon: "💰", label: "Earnings & Payouts", locked: !isVerified },
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
            <p className="text-[10px] text-[#7a6070]">Seller Portal</p>
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
                  alert("🔒 Feature Locked: Your account is currently under Admin Verification. Once verified by the Admin, all seller features will be unlocked!");
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
              Welcome, {user.userName}! 🌸
              {isVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold font-sans">
                  Verified ✅
                </span>
              )}
            </h1>
            <p className="dashboard-header__subtitle">
              GruhinEzz Seller Portal — Household Women Entrepreneurs
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

        {/* Dynamic Banner based on Verification */}
        <div className="px-6 pt-6">
          {!isVerified ? (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-200 rounded-xl text-amber-800 shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-amber-950 font-serif">
                    Account Under Admin Verification
                  </h3>
                  <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                    Your seller setup details have been submitted. The GruhinEzz Admin is reviewing your uploaded identity & store documents. Features (Product Uploads, Order Processing & Cashfree Payouts) are currently <strong>locked</strong> until Admin approves your account.
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
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-emerald-950 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-200 rounded-xl text-emerald-800 shrink-0">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-emerald-950 font-serif">
                    All Seller Features Unlocked! 🎉
                  </h3>
                  <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                    Your seller account has been verified by the Admin. You now have full access to list products, accept buyer orders, and receive automated Cashfree payouts!
                  </p>
                </div>
              </div>
              <div className="shrink-0 px-3.5 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5">
                <Sparkles size={14} /> Full Access Active
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
                <p className="text-xs text-[#7a6070]">Total Products</p>
                <p className="text-2xl font-bold text-[#2d2130] mt-1">
                  {isVerified ? "4 Active" : "0 (Locked)"}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isVerified ? "bg-pink-100 text-pink-700" : "bg-gray-100 text-gray-400"}`}>
                <Package size={22} />
              </div>
            </div>

            <div className="bg-white border border-[#e2d3c8] rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7a6070]">Received Orders</p>
                <p className="text-2xl font-bold text-[#2d2130] mt-1">
                  {isVerified ? "12 Orders" : "0 (Locked)"}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isVerified ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"}`}>
                <ShoppingBag size={22} />
              </div>
            </div>

            <div className="bg-white border border-[#e2d3c8] rounded-2xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7a6070]">Cashfree Earnings</p>
                <p className="text-2xl font-bold text-[#2d2130] mt-1">
                  {isVerified ? "₹14,850" : "₹0.00 (Locked)"}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isVerified ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                <DollarSign size={22} />
              </div>
            </div>
          </div>

          {/* Feature Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Add New Product */}
            <div className={`bg-white border rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all ${
              isVerified ? "border-[#e2d3c8] hover:border-[#ae3a65]" : "border-gray-200 bg-gray-50/70 opacity-90"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2.5 rounded-2xl text-lg ${isVerified ? "bg-[#f5ece6] text-[#48154c]" : "bg-gray-200 text-gray-500"}`}>
                  🛍️
                </span>
                {!isVerified ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 flex items-center gap-1">
                    <Lock size={12} /> Locked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                    Unlocked ✅
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2d2130]">Add New Homemade Product</h3>
              <p className="text-xs text-[#7a6070] mt-1 leading-relaxed">
                Publish your handmade handicrafts, homemade snacks, or artisan textiles directly to the GruhinEzz Marketplace.
              </p>
              <button
                onClick={() => {
                  if (!isVerified) {
                    alert("🔒 Product creation is locked until Admin verifies your seller account.");
                  } else {
                    alert("✨ Add Product Feature Unlocked! Upload product title, image, price, and inventory details.");
                  }
                }}
                className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isVerified
                    ? "bg-[#48154c] hover:bg-[#6b2370] text-white shadow-xs"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {!isVerified ? <Lock size={14} /> : <Plus size={14} />}
                {!isVerified ? "Locked Until Verification" : "Add New Product"}
              </button>
            </div>

            {/* Card 2: Cashfree Payout Settings */}
            <div className={`bg-white border rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all ${
              isVerified ? "border-[#e2d3c8] hover:border-[#ae3a65]" : "border-gray-200 bg-gray-50/70 opacity-90"
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2.5 rounded-2xl text-lg ${isVerified ? "bg-[#f5ece6] text-[#48154c]" : "bg-gray-200 text-gray-500"}`}>
                  💳
                </span>
                {!isVerified ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300 flex items-center gap-1">
                    <Lock size={12} /> Locked
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                    Unlocked ✅
                  </span>
                )}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2d2130]">Cashfree Direct Vendor Payouts</h3>
              <p className="text-xs text-[#7a6070] mt-1 leading-relaxed">
                Automated bank transfers directly to your verified bank account whenever customers purchase your products.
              </p>
              <button
                onClick={() => {
                  if (!isVerified) {
                    alert("🔒 Payout setup is locked until Admin verifies your seller account.");
                  } else {
                    alert("✨ Cashfree Payouts Active! Funds will be directly settled into your bank account.");
                  }
                }}
                className={`mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isVerified
                    ? "bg-[#ae3a65] hover:bg-[#c94578] text-white shadow-xs"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {!isVerified ? <Lock size={14} /> : <DollarSign size={14} />}
                {!isVerified ? "Locked Until Verification" : "View Payout Wallet"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

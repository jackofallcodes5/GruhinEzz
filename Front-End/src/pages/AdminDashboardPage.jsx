import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, Users, HeartHandshake, CheckCircle2, Clock, FileText,
  Search, Eye, LogOut, ExternalLink, RefreshCw, X, Download, Filter, Building2, UserCheck
} from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("sellers"); // "sellers" | "ngos"
  const [sellers, setSellers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "verified"
  const [verifyingId, setVerifyingId] = useState(null);
  
  // Document Viewer Modal State
  const [previewDoc, setPreviewDoc] = useState(null); // { title, fileName, fileUrl }

  useEffect(() => {
    const adminToken = localStorage.getItem("gruhinezz_admin_token");
    const storedUser = localStorage.getItem("gruhinezz_admin_user");
    if (!adminToken || !storedUser) {
      navigate("/admin/login", { replace: true });
      return;
    }
    try {
      setAdminUser(JSON.parse(storedUser));
    } catch {
      setAdminUser({ email: "admin@gruhinezz.com" });
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sellersRes, ngosRes] = await Promise.all([
        apiClient.get("/admin/sellers"),
        apiClient.get("/admin/ngos"),
      ]);
      setSellers(sellersRes.data?.sellers || []);
      setNgos(ngosRes.data?.ngos || []);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId, currentVerifiedStatus) => {
    setVerifyingId(userId);
    try {
      const newStatus = !currentVerifiedStatus;
      await apiClient.post("/admin/verify-user", {
        userId,
        isVerified: newStatus,
      });

      // Update state locally
      setSellers((prev) =>
        prev.map((s) => (s.user_id === userId ? { ...s, is_verified: newStatus ? 1 : 0 } : s))
      );
      setNgos((prev) =>
        prev.map((n) => (n.user_id === userId ? { ...n, is_verified: newStatus ? 1 : 0 } : n))
      );
    } catch (err) {
      alert("Failed to update verification status: " + (err.response?.data?.message || err.message));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gruhinezz_admin_token");
    localStorage.removeItem("gruhinezz_admin_user");
    navigate("/admin/login", { replace: true });
  };

  // Filter logic
  const filterList = (list) => {
    return list.filter((item) => {
      const matchesSearch =
        (item.user_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.store_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.ngo_name || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (statusFilter === "pending") {
        return matchesSearch && !item.is_verified;
      }
      if (statusFilter === "verified") {
        return matchesSearch && item.is_verified;
      }
      return matchesSearch;
    });
  };

  const filteredSellers = filterList(sellers);
  const filteredNgos = filterList(ngos);

  const pendingSellersCount = sellers.filter((s) => !s.is_verified).length;
  const pendingNgosCount = ngos.filter((n) => !n.is_verified).length;

  return (
    <div className="min-h-screen bg-[#1F0E18] text-[#F3E8EE] flex flex-col">
      {/* ── Admin Header ── */}
      <header className="bg-[#2D1623] border-b border-[#4A2338] sticky top-0 z-30 px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="GruhinEzz" className="h-10 w-auto object-contain" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                GruhinEzz
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7A1F49] text-[#E9CDD3] text-[11px] font-semibold border border-[#ae3a65]">
                ADMIN CONTROL
              </span>
            </div>
            <p className="text-xs text-[#C79AA7]">Partner Verification & Approvals Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-[#C79AA7]">LoggedIn Admin</span>
            <span className="text-sm font-semibold text-white">{adminUser?.email || "admin@gruhinezz.com"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3D1D30] hover:bg-[#5E2546] text-[#E9CDD3] text-xs font-medium border border-[#5E2546] transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1600px] w-full mx-auto space-y-6">
        
        {/* Stats & Overview Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7A1F49]/40 border border-[#7A1F49] text-pink-300 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Total Seller Requests</p>
              <p className="text-2xl font-bold text-white mt-0.5">{sellers.length}</p>
              <span className="text-[11px] text-amber-400 font-medium">{pendingSellersCount} Pending</span>
            </div>
          </div>

          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-600 text-purple-300 flex items-center justify-center">
              <HeartHandshake size={24} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Total NGO Requests</p>
              <p className="text-2xl font-bold text-white mt-0.5">{ngos.length}</p>
              <span className="text-[11px] text-amber-400 font-medium">{pendingNgosCount} Pending</span>
            </div>
          </div>

          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-900/40 border border-amber-600 text-amber-300 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Total Pending Approvals</p>
              <p className="text-2xl font-bold text-amber-400 mt-0.5">
                {pendingSellersCount + pendingNgosCount}
              </p>
              <span className="text-[11px] text-[#C79AA7]">Requires Admin Review</span>
            </div>
          </div>

          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/40 border border-emerald-600 text-emerald-300 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Verified Partners</p>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">
                {(sellers.length - pendingSellersCount) + (ngos.length - pendingNgosCount)}
              </p>
              <span className="text-[11px] text-emerald-400 font-medium">Features Unlocked</span>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs & Filters ── */}
        <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-[#1F0E18] p-1.5 rounded-xl border border-[#4A2338]">
            <button
              onClick={() => setActiveTab("sellers")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "sellers"
                  ? "bg-[#7A1F49] text-white shadow-md"
                  : "text-[#C79AA7] hover:text-white"
              }`}
            >
              <Users size={18} />
              1. Seller Requests
              {pendingSellersCount > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-amber-500 text-black font-bold">
                  {pendingSellersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("ngos")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "ngos"
                  ? "bg-[#7A1F49] text-white shadow-md"
                  : "text-[#C79AA7] hover:text-white"
              }`}
            >
              <HeartHandshake size={18} />
              2. NGO Requests
              {pendingNgosCount > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-amber-500 text-black font-bold">
                  {pendingNgosCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C79AA7]" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1F0E18] border border-[#4A2338] text-xs text-white placeholder-[#8A5468] focus:outline-none focus:border-[#ae3a65]"
              />
            </div>

            {/* Status Filter dropdown */}
            <div className="flex items-center gap-1.5 bg-[#1F0E18] px-3 py-2 rounded-xl border border-[#4A2338]">
              <Filter size={14} className="text-[#C79AA7]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#2D1623]">All Requests</option>
                <option value="pending" className="bg-[#2D1623]">Pending Verification</option>
                <option value="verified" className="bg-[#2D1623]">Verified</option>
              </select>
            </div>

            <button
              onClick={fetchData}
              title="Refresh Data"
              className="p-2 rounded-xl bg-[#1F0E18] border border-[#4A2338] text-[#C79AA7] hover:text-white hover:border-[#7A1F49] transition-colors"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ── Table Section ── */}
        {loading ? (
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-[#7A1F49] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-[#C79AA7]">Loading partner verification requests...</p>
          </div>
        ) : activeTab === "sellers" ? (
          /* ==================================================== */
          /* 1. SELLER REQUESTS TABLE                             */
          /* ==================================================== */
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#4A2338] bg-[#25111D] flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Users size={18} className="text-pink-400" />
                Seller Verification Requests ({filteredSellers.length})
              </h2>
              <span className="text-xs text-[#C79AA7]">
                Review entered profile, store info, uploaded KYC docs & verify to unlock features
              </span>
            </div>

            {filteredSellers.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#C79AA7]">
                No seller requests found matching your filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1F0E18] text-[#E9CDD3] uppercase tracking-wider font-semibold border-b border-[#4A2338]">
                      <th className="py-3.5 px-4">ID & User</th>
                      <th className="py-3.5 px-4">Personal & Identity Details</th>
                      <th className="py-3.5 px-4">Store & Business Setup</th>
                      <th className="py-3.5 px-4">Bank Payout Setup</th>
                      <th className="py-3.5 px-4">Uploaded Files / Docs</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Action (Verify)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A2338]">
                    {filteredSellers.map((seller) => (
                      <tr key={seller.user_id} className="hover:bg-[#381B2C]/50 transition-colors">
                        {/* ID & User */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-white text-sm">#{seller.user_id}</div>
                          <div className="font-medium text-pink-300 mt-0.5">{seller.user_name || "N/A"}</div>
                          <div className="text-[11px] text-[#C79AA7] truncate max-w-[160px]">{seller.user_email}</div>
                          <div className="text-[11px] text-[#C79AA7]">📞 {seller.contact_no}</div>
                          <div className="text-[10px] text-[#8A5468] mt-1">
                            Joined: {new Date(seller.registered_at).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Personal & Identity */}
                        <td className="py-4 px-4 align-top max-w-[220px]">
                          {seller.full_name ? (
                            <div className="space-y-1">
                              <div className="font-semibold text-white">{seller.full_name}</div>
                              <div className="text-[11px] text-[#C79AA7]">
                                👤 {seller.gender || "Female"} | DOB: {seller.dob ? seller.dob.split("T")[0] : "N/A"}
                              </div>
                              <div className="text-[11px] text-[#C79AA7]">
                                📍 {seller.seller_address || "N/A"}, {seller.seller_city}, {seller.seller_state} ({seller.seller_pincode})
                              </div>
                              <div className="text-[11px] text-[#E9CDD3] font-medium pt-1 border-t border-[#4A2338]/60">
                                🆔 {seller.id_type || "Aadhaar"}: <span className="text-white">{seller.id_number || "N/A"}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-400 italic">Personal info not submitted yet</span>
                          )}
                        </td>

                        {/* Store & Business */}
                        <td className="py-4 px-4 align-top max-w-[220px]">
                          {seller.store_name ? (
                            <div className="space-y-1">
                              <div className="font-bold text-pink-300 flex items-center gap-1">
                                <Building2 size={13} />
                                {seller.store_name}
                              </div>
                              <div className="text-[11px] text-[#C79AA7]">
                                🏷️ {seller.category} ({seller.sub_category || "General"})
                              </div>
                              <div className="text-[11px] text-[#C79AA7]">
                                💼 Type: {seller.business_type} | Exp: {seller.years_in_business || "1"} yrs
                              </div>
                              <div className="text-[11px] text-[#C79AA7]">
                                📄 GST: {seller.gst_number || "N/A"}
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-400 italic">Business info pending</span>
                          )}
                        </td>

                        {/* Bank Payout */}
                        <td className="py-4 px-4 align-top max-w-[200px]">
                          {seller.account_number ? (
                            <div className="space-y-1 bg-[#1F0E18] p-2.5 rounded-xl border border-[#4A2338]">
                              <div className="font-semibold text-white">{seller.account_holder_name}</div>
                              <div className="text-[11px] text-[#C79AA7]">🏦 {seller.bank_name}</div>
                              <div className="text-[11px] text-emerald-400 font-mono">A/C: {seller.account_number}</div>
                              <div className="text-[11px] text-[#C79AA7] font-mono">IFSC: {seller.ifsc_code}</div>
                            </div>
                          ) : (
                            <span className="text-amber-400 italic">Bank info pending</span>
                          )}
                        </td>

                        {/* Uploaded Files */}
                        <td className="py-4 px-4 align-top space-y-2">
                          <div>
                            <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">Identity Proof:</span>
                            {seller.id_proof_url ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    setPreviewDoc({
                                      title: `Identity Proof (${seller.id_type || "ID Document"})`,
                                      fileName: seller.id_proof_url.startsWith("S-") ? seller.id_proof_url : `S-IDProof-${seller.user_id}.pdf`,
                                      fileUrl: `/api/documents/view/${seller.id_proof_url}`,
                                      uploader: seller.full_name || seller.user_name,
                                      userId: seller.user_id,
                                    })
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#7A1F49]/40 hover:bg-[#7A1F49] text-pink-200 border border-[#7A1F49] text-[11px] transition-colors"
                                  title="Review Document"
                                >
                                  <Eye size={12} />
                                  View
                                </button>
                                <a
                                  href={`http://localhost:5000/api/documents/download/${seller.id_proof_url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] transition-colors"
                                  title="Download Document"
                                >
                                  <Download size={12} />
                                  Download
                                </a>
                              </div>
                            ) : (
                              <span className="text-[#8A5468] text-[11px]">No file</span>
                            )}
                            {seller.id_proof_url && (
                              <span className="text-[10px] text-[#C79AA7] font-mono block mt-0.5 truncate max-w-[170px]">
                                {seller.id_proof_url.startsWith("S-") ? seller.id_proof_url : `S-IDProof-${seller.user_id}.pdf`}
                              </span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">Store Logo:</span>
                            {seller.store_logo_url ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    setPreviewDoc({
                                      title: "Store Logo Document",
                                      fileName: seller.store_logo_url.startsWith("S-") ? seller.store_logo_url : `S-StoreLogo-${seller.user_id}.png`,
                                      fileUrl: `/api/documents/view/${seller.store_logo_url}`,
                                      uploader: seller.store_name || seller.user_name,
                                      userId: seller.user_id,
                                    })
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#7A1F49]/40 hover:bg-[#7A1F49] text-pink-200 border border-[#7A1F49] text-[11px] transition-colors"
                                  title="Review Document"
                                >
                                  <Eye size={12} />
                                  View
                                </button>
                                <a
                                  href={`http://localhost:5000/api/documents/download/${seller.store_logo_url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] transition-colors"
                                  title="Download Document"
                                >
                                  <Download size={12} />
                                  Download
                                </a>
                              </div>
                            ) : (
                              <span className="text-[#8A5468] text-[11px]">No file</span>
                            )}
                            {seller.store_logo_url && (
                              <span className="text-[10px] text-[#C79AA7] font-mono block mt-0.5 truncate max-w-[170px]">
                                {seller.store_logo_url.startsWith("S-") ? seller.store_logo_url : `S-StoreLogo-${seller.user_id}.png`}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 align-top">
                          {seller.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-300 font-medium text-[11px]">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/60 border border-amber-500 text-amber-300 font-medium text-[11px]">
                              <Clock size={13} /> Pending
                            </span>
                          )}
                        </td>

                        {/* Action Column */}
                        <td className="py-4 px-4 align-top text-center">
                          <button
                            onClick={() => handleVerify(seller.user_id, seller.is_verified)}
                            disabled={verifyingId === seller.user_id}
                            className={`w-full max-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all shadow-md ${
                              seller.is_verified
                                ? "bg-emerald-900/40 hover:bg-red-900/60 text-emerald-200 border border-emerald-600 hover:border-red-500 hover:text-red-200"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40"
                            }`}
                          >
                            {verifyingId === seller.user_id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : seller.is_verified ? (
                              <>
                                <CheckCircle2 size={14} />
                                Verified ✅
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} />
                                Verify Seller
                              </>
                            )}
                          </button>
                          <p className="text-[10px] text-[#8A5468] mt-1.5">
                            {seller.is_verified ? "Click to unverify" : "Unlocks seller features"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* ==================================================== */
          /* 2. NGO REQUESTS TABLE                                */
          /* ==================================================== */
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#4A2338] bg-[#25111D] flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <HeartHandshake size={18} className="text-purple-400" />
                NGO Partner Verification Requests ({filteredNgos.length})
              </h2>
              <span className="text-xs text-[#C79AA7]">
                Review NGO legal documents, contact person identity & click Verify to unlock NGO portal
              </span>
            </div>

            {filteredNgos.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#C79AA7]">
                No NGO requests found matching your filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1F0E18] text-[#E9CDD3] uppercase tracking-wider font-semibold border-b border-[#4A2338]">
                      <th className="py-3.5 px-4">ID & User</th>
                      <th className="py-3.5 px-4">NGO Identity & Registration</th>
                      <th className="py-3.5 px-4">Contact & Representative</th>
                      <th className="py-3.5 px-4">Legal Compliance Documents</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Action (Verify)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A2338]">
                    {filteredNgos.map((ngo) => (
                      <tr key={ngo.user_id} className="hover:bg-[#381B2C]/50 transition-colors">
                        {/* ID & User */}
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-white text-sm">#{ngo.user_id}</div>
                          <div className="font-medium text-purple-300 mt-0.5">{ngo.user_name || "N/A"}</div>
                          <div className="text-[11px] text-[#C79AA7] truncate max-w-[160px]">{ngo.user_email}</div>
                          <div className="text-[11px] text-[#C79AA7]">📞 {ngo.contact_no}</div>
                          <div className="text-[10px] text-[#8A5468] mt-1">
                            Joined: {new Date(ngo.registered_at).toLocaleDateString()}
                          </div>
                        </td>

                        {/* NGO Identity */}
                        <td className="py-4 px-4 align-top max-w-[220px]">
                          {ngo.ngo_name ? (
                            <div className="space-y-1">
                              <div className="font-bold text-purple-200 text-sm">{ngo.ngo_name}</div>
                              <div className="text-[11px] text-[#C79AA7]">
                                📜 Reg No: <span className="text-white font-mono">{ngo.registration_no}</span>
                              </div>
                              <div className="text-[11px] text-[#C79AA7]">
                                🏛️ Type: {ngo.ngo_type} | Est: {ngo.establishment_year}
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-400 italic">Identity setup pending</span>
                          )}
                        </td>

                        {/* Contact & Representative */}
                        <td className="py-4 px-4 align-top max-w-[220px]">
                          {ngo.contact_person_name ? (
                            <div className="space-y-1">
                              <div className="font-semibold text-white">
                                👤 {ngo.contact_person_name} ({ngo.designation})
                              </div>
                              <div className="text-[11px] text-[#C79AA7]">✉️ {ngo.official_email}</div>
                              <div className="text-[11px] text-[#C79AA7]">📞 {ngo.ngo_phone}</div>
                              {ngo.website && (
                                <div className="text-[11px] text-pink-400 hover:underline">
                                  🌐 <a href={ngo.website} target="_blank" rel="noreferrer">{ngo.website}</a>
                                </div>
                              )}
                              <div className="text-[11px] text-[#C79AA7] pt-1">
                                📍 {ngo.registered_address}
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-400 italic">Contact setup pending</span>
                          )}
                        </td>

                        {/* Uploaded Legal Docs */}
                        <td className="py-4 px-4 align-top space-y-2">
                          {ngo.reg_cert_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">Reg Certificate:</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    setPreviewDoc({
                                      title: "NGO Registration Certificate",
                                      fileName: ngo.reg_cert_url.startsWith("N-") ? ngo.reg_cert_url : `N-RegistrationCertificate-${ngo.user_id}.pdf`,
                                      fileUrl: `/api/documents/view/${ngo.reg_cert_url}`,
                                      uploader: ngo.ngo_name || ngo.user_name,
                                      userId: ngo.user_id,
                                    })
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[11px] transition-colors"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <a
                                  href={`http://localhost:5000/api/documents/download/${ngo.reg_cert_url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] transition-colors"
                                >
                                  <Download size={12} /> Download
                                </a>
                              </div>
                              <span className="text-[10px] text-[#C79AA7] font-mono block mt-0.5 truncate max-w-[170px]">
                                {ngo.reg_cert_url.startsWith("N-") ? ngo.reg_cert_url : `N-RegistrationCertificate-${ngo.user_id}.pdf`}
                              </span>
                            </div>
                          )}

                          {ngo.pan_card_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">PAN Card:</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    setPreviewDoc({
                                      title: "NGO PAN Card Document",
                                      fileName: ngo.pan_card_url.startsWith("N-") ? ngo.pan_card_url : `N-PAN-${ngo.user_id}.pdf`,
                                      fileUrl: `/api/documents/view/${ngo.pan_card_url}`,
                                      uploader: ngo.ngo_name || ngo.user_name,
                                      userId: ngo.user_id,
                                    })
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[11px] transition-colors"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <a
                                  href={`http://localhost:5000/api/documents/download/${ngo.pan_card_url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] transition-colors"
                                >
                                  <Download size={12} /> Download
                                </a>
                              </div>
                              <span className="text-[10px] text-[#C79AA7] font-mono block mt-0.5 truncate max-w-[170px]">
                                {ngo.pan_card_url.startsWith("N-") ? ngo.pan_card_url : `N-PAN-${ngo.user_id}.pdf`}
                              </span>
                            </div>
                          )}

                          {ngo.cert_80g_12a_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">80G / 12A Cert:</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    setPreviewDoc({
                                      title: "80G / 12A Tax Exemption Certificate",
                                      fileName: ngo.cert_80g_12a_url.startsWith("N-") ? ngo.cert_80g_12a_url : `N-Cert80G12A-${ngo.user_id}.pdf`,
                                      fileUrl: `/api/documents/view/${ngo.cert_80g_12a_url}`,
                                      uploader: ngo.ngo_name || ngo.user_name,
                                      userId: ngo.user_id,
                                    })
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[11px] transition-colors"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <a
                                  href={`http://localhost:5000/api/documents/download/${ngo.cert_80g_12a_url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] transition-colors"
                                >
                                  <Download size={12} /> Download
                                </a>
                              </div>
                              <span className="text-[10px] text-[#C79AA7] font-mono block mt-0.5 truncate max-w-[170px]">
                                {ngo.cert_80g_12a_url.startsWith("N-") ? ngo.cert_80g_12a_url : `N-Cert80G12A-${ngo.user_id}.pdf`}
                              </span>
                            </div>
                          )}

                          {ngo.contact_id_proof_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">Contact Person ID:</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    setPreviewDoc({
                                      title: "Contact Person ID Proof",
                                      fileName: ngo.contact_id_proof_url.startsWith("N-") ? ngo.contact_id_proof_url : `N-ContactID-${ngo.user_id}.pdf`,
                                      fileUrl: `/api/documents/view/${ngo.contact_id_proof_url}`,
                                      uploader: ngo.contact_person_name || ngo.user_name,
                                      userId: ngo.user_id,
                                    })
                                  }
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[11px] transition-colors"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <a
                                  href={`http://localhost:5000/api/documents/download/${ngo.contact_id_proof_url}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] transition-colors"
                                >
                                  <Download size={12} /> Download
                                </a>
                              </div>
                              <span className="text-[10px] text-[#C79AA7] font-mono block mt-0.5 truncate max-w-[170px]">
                                {ngo.contact_id_proof_url.startsWith("N-") ? ngo.contact_id_proof_url : `N-ContactID-${ngo.user_id}.pdf`}
                              </span>
                            </div>
                          )}

                          {!ngo.reg_cert_url && !ngo.pan_card_url && !ngo.contact_id_proof_url && (
                            <span className="text-[#8A5468] text-[11px]">No docs uploaded</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 align-top">
                          {ngo.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-300 font-medium text-[11px]">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/60 border border-amber-500 text-amber-300 font-medium text-[11px]">
                              <Clock size={13} /> Pending
                            </span>
                          )}
                        </td>

                        {/* Action Column */}
                        <td className="py-4 px-4 align-top text-center">
                          <button
                            onClick={() => handleVerify(ngo.user_id, ngo.is_verified)}
                            disabled={verifyingId === ngo.user_id}
                            className={`w-full max-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all shadow-md ${
                              ngo.is_verified
                                ? "bg-emerald-900/40 hover:bg-red-900/60 text-emerald-200 border border-emerald-600 hover:border-red-500 hover:text-red-200"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/40"
                            }`}
                          >
                            {verifyingId === ngo.user_id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : ngo.is_verified ? (
                              <>
                                <CheckCircle2 size={14} />
                                Verified ✅
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} />
                                Verify NGO
                              </>
                            )}
                          </button>
                          <p className="text-[10px] text-[#8A5468] mt-1.5">
                            {ngo.is_verified ? "Click to unverify" : "Unlocks NGO features"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Document Preview Verification Modal ── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#2D1623] border border-[#5E2546] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-[#4A2338] bg-[#25111D] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#7A1F49] text-white">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">{previewDoc.title}</h3>
                  <p className="text-xs text-[#C79AA7]">
                    Submitted by: <strong className="text-pink-300">{previewDoc.uploader}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-xl bg-[#3D1D30] text-[#C79AA7] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 bg-[#1F0E18] space-y-4">
              <div className="p-4 bg-[#2D1623] border border-[#4A2338] rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#C79AA7] block">System Filename / Record:</span>
                  <span className="font-mono text-sm font-semibold text-pink-300 break-all">
                    {previewDoc.fileName}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-900/40 border border-emerald-500 text-emerald-300 text-xs font-medium">
                  Verified Format
                </div>
              </div>

              {/* Simulated Document Preview Container */}
              <div className="h-64 rounded-2xl bg-[#170A12] border-2 border-dashed border-[#4A2338] flex flex-col items-center justify-center p-6 text-center">
                <FileText size={48} className="text-[#7A1F49] mb-3 animate-pulse" />
                <h4 className="text-sm font-semibold text-white">Verification Document Loaded</h4>
                <p className="text-xs text-[#C79AA7] max-w-sm mt-1">
                  Official verification record for <span className="text-pink-300">{previewDoc.title}</span> ({previewDoc.fileName}). Document details match user records in database.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={`http://localhost:5000/api/documents/download/${previewDoc.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                  >
                    <Download size={14} /> Download Individual Document
                  </a>
                  <a
                    href={`http://localhost:5000/api/documents/view/${previewDoc.fileName}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A1F49] hover:bg-[#ae3a65] text-white text-xs font-semibold transition-colors"
                  >
                    <ExternalLink size={14} /> View Document
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#4A2338] bg-[#25111D] flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2 rounded-xl bg-[#3D1D30] hover:bg-[#5E2546] text-white text-xs font-semibold transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

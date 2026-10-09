import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, Users, HeartHandshake, CheckCircle2, Clock, FileText,
  Search, Eye, LogOut, ExternalLink, RefreshCw, X, Download, Filter, Building2, UserCheck,
  ShoppingBag, Award, User
} from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("sellers"); // "sellers" | "ngos" | "products" | "programs" | "users"
  
  const [sellers, setSellers] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [products, setProducts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [overviewStats, setOverviewStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "verified"
  const [verifyingId, setVerifyingId] = useState(null);
  const [downloadingDoc, setDownloadingDoc] = useState(false);
  
  // Document Viewer Modal State
  const [previewDoc, setPreviewDoc] = useState(null); // { title, fileName, fileUrl, uploader, userId }

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
      const [sellersRes, ngosRes, productsRes, programsRes, usersRes, statsRes] = await Promise.all([
        apiClient.get("/admin/sellers"),
        apiClient.get("/admin/ngos"),
        apiClient.get("/admin/products"),
        apiClient.get("/admin/programs"),
        apiClient.get("/admin/users"),
        apiClient.get("/admin/overview"),
      ]);
      setSellers(sellersRes.data?.sellers || []);
      setNgos(ngosRes.data?.ngos || []);
      setProducts(productsRes.data?.products || []);
      setPrograms(programsRes.data?.programs || []);
      setSystemUsers(usersRes.data?.users || []);
      setOverviewStats(statsRes.data?.stats || null);
    } catch (err) {
      console.error("Error fetching admin data from DB:", err);
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

      // Update state locally in all relevant lists
      setSellers((prev) =>
        prev.map((s) => (s.user_id === userId ? { ...s, is_verified: newStatus ? 1 : 0 } : s))
      );
      setNgos((prev) =>
        prev.map((n) => (n.user_id === userId ? { ...n, is_verified: newStatus ? 1 : 0 } : n))
      );
      setSystemUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_verified: newStatus } : u))
      );
      fetchData(); // Refresh overall stats
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

  // Helper to convert database path or public ID to full Cloudinary HTTPS URL
  const getCloudinaryUrl = (rawUrlOrPath) => {
    if (!rawUrlOrPath) return "";
    const str = String(rawUrlOrPath).trim();
    if (str.startsWith("http://") || str.startsWith("https://")) {
      return str;
    }
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dgn3efbvf";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${str}`;
  };

  const openDocPreview = (title, rawUrl, uploader, userId) => {
    if (!rawUrl) return;
    const fullUrl = getCloudinaryUrl(rawUrl);
    setPreviewDoc({
      title,
      fileName: rawUrl,
      fileUrl: fullUrl,
      uploader: uploader || "User",
      userId: userId || "N/A",
    });
  };

  // Direct Cloudinary Document Download Handler
  const handleDownloadDoc = async (rawUrl, fileName) => {
    const fileUrl = getCloudinaryUrl(rawUrl);
    if (!fileUrl) return;
    setDownloadingDoc(true);
    try {
      // Force attachment header using Cloudinary url transformation if applicable
      let downloadUrl = fileUrl;
      if (fileUrl.includes("res.cloudinary.com") && fileUrl.includes("/upload/")) {
        downloadUrl = fileUrl.replace("/upload/", "/upload/fl_attachment/");
      }

      // Fetch blob and trigger browser download
      const response = await fetch(downloadUrl, { mode: 'cors' });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "cloud_document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Direct blob download fallback to new tab:", err);
      window.open(fileUrl, "_blank");
    } finally {
      setDownloadingDoc(false);
    }
  };

  // Filter logic
  const filterList = (list) => {
    return list.filter((item) => {
      const matchesSearch =
        (item.user_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.user_email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.seller_full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.store_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.ngo_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(searchTerm.toLowerCase());

      if (statusFilter === "pending") {
        return matchesSearch && !item.is_verified;
      }
      if (statusFilter === "verified") {
        return matchesSearch && Boolean(item.is_verified);
      }
      return matchesSearch;
    });
  };

  const filteredSellers = filterList(sellers);
  const filteredNgos = filterList(ngos);
  const filteredProducts = filterList(products);
  const filteredPrograms = filterList(programs);
  const filteredUsers = filterList(systemUsers);

  const pendingSellersCount = overviewStats?.pendingSellers ?? sellers.filter((s) => !s.is_verified).length;
  const pendingNgosCount = overviewStats?.pendingNgos ?? ngos.filter((n) => !n.is_verified).length;

  const isImageFile = (url = "") => {
    const ext = url.split('.').pop().toLowerCase();
    return ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext) || url.includes("/image/upload/");
  };

  return (
    <div className="min-h-screen bg-[#1F0E18] text-[#F3E8EE] flex flex-col font-sans">
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
            <p className="text-xs text-[#C79AA7]">Partner Verification & Live DB Management</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#7A1F49]/40 border border-[#7A1F49] text-pink-300 flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Sellers (DB)</p>
              <p className="text-xl font-bold text-white mt-0.5">{overviewStats?.totalSellers ?? sellers.length}</p>
              <span className="text-[10px] text-amber-400 font-medium">{pendingSellersCount} Pending</span>
            </div>
          </div>

          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-600 text-purple-300 flex items-center justify-center shrink-0">
              <HeartHandshake size={20} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">NGOs (DB)</p>
              <p className="text-xl font-bold text-white mt-0.5">{overviewStats?.totalNgos ?? ngos.length}</p>
              <span className="text-[10px] text-amber-400 font-medium">{pendingNgosCount} Pending</span>
            </div>
          </div>

          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-600 text-amber-300 flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Pending Approvals</p>
              <p className="text-xl font-bold text-amber-400 mt-0.5">
                {pendingSellersCount + pendingNgosCount}
              </p>
              <span className="text-[10px] text-[#C79AA7]">Action Required</span>
            </div>
          </div>

          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-900/40 border border-cyan-600 text-cyan-300 flex items-center justify-center shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Total Products</p>
              <p className="text-xl font-bold text-cyan-300 mt-0.5">
                {overviewStats?.totalProducts ?? products.length}
              </p>
              <span className="text-[10px] text-cyan-400 font-medium">Cloudinary Hosted</span>
            </div>
          </div>

          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/40 border border-emerald-600 text-emerald-300 flex items-center justify-center shrink-0">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-[#C79AA7]">Registered Users</p>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">
                {overviewStats?.totalUsers ?? systemUsers.length}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">PostgreSQL DB</span>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs & Filters ── */}
        <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 bg-[#1F0E18] p-1.5 rounded-xl border border-[#4A2338]">
            <button
              onClick={() => setActiveTab("sellers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "sellers"
                  ? "bg-[#7A1F49] text-white shadow-md"
                  : "text-[#C79AA7] hover:text-white"
              }`}
            >
              <Users size={16} />
              1. Sellers ({sellers.length})
              {pendingSellersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-black font-bold">
                  {pendingSellersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("ngos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "ngos"
                  ? "bg-[#7A1F49] text-white shadow-md"
                  : "text-[#C79AA7] hover:text-white"
              }`}
            >
              <HeartHandshake size={16} />
              2. NGOs ({ngos.length})
              {pendingNgosCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500 text-black font-bold">
                  {pendingNgosCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-[#7A1F49] text-white shadow-md"
                  : "text-[#C79AA7] hover:text-white"
              }`}
            >
              <ShoppingBag size={16} />
              3. Products ({products.length})
            </button>

            <button
              onClick={() => setActiveTab("programs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "programs"
                  ? "bg-[#7A1F49] text-white shadow-md"
                  : "text-[#C79AA7] hover:text-white"
              }`}
            >
              <Award size={16} />
              4. NGO Programs ({programs.length})
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-[#7A1F49] text-white shadow-md"
                  : "text-[#C79AA7] hover:text-white"
              }`}
            >
              <User size={16} />
              5. System Users ({systemUsers.length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C79AA7]" />
              <input
                type="text"
                placeholder="Search DB records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1F0E18] border border-[#4A2338] text-xs text-white placeholder-[#8A5468] focus:outline-none focus:border-[#ae3a65]"
              />
            </div>

            {/* Status Filter dropdown */}
            {(activeTab === "sellers" || activeTab === "ngos" || activeTab === "users") && (
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
            )}

            <button
              onClick={fetchData}
              title="Refetch Live Data from DB"
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
            <p className="text-sm text-[#C79AA7]">Fetching latest records from PostgreSQL Database & Cloudinary...</p>
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
                DB Columns: `seller_profiles.id_proof_url`, `business_setups.store_logo_url`
              </span>
            </div>

            {filteredSellers.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#C79AA7]">
                No seller requests found matching your search.
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
                      <th className="py-3.5 px-4">Cloudinary Documents</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
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
                                👤 {seller.gender || "Female"} | DOB: {seller.dob ? String(seller.dob).split("T")[0] : "N/A"}
                              </div>
                              <div className="text-[11px] text-[#C79AA7]">
                                📍 {seller.seller_address || "N/A"}, {seller.seller_city}, {seller.seller_state} ({seller.seller_pincode})
                              </div>
                              <div className="text-[11px] text-[#E9CDD3] font-medium pt-1 border-t border-[#4A2338]/60">
                                🆔 {seller.id_type || "Aadhaar"}: <span className="text-white">{seller.id_number || "N/A"}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-amber-400 italic">Personal info pending</span>
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
                        <td className="py-4 px-4 align-top space-y-3 min-w-[200px]">
                          <div>
                            <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">
                              Identity Proof (`id_proof_url`):
                            </span>
                            {seller.id_proof_url ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    openDocPreview(
                                      `Seller Identity Proof (${seller.id_type || "ID Document"})`,
                                      seller.id_proof_url,
                                      seller.full_name || seller.user_name,
                                      seller.user_id
                                    )
                                  }
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#7A1F49]/40 hover:bg-[#7A1F49] text-pink-200 border border-[#7A1F49] text-[11px] font-medium transition-colors"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <button
                                  onClick={() => handleDownloadDoc(seller.id_proof_url, `Seller_ID_${seller.user_id}`)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] font-medium transition-colors"
                                >
                                  <Download size={12} /> Download
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#8A5468] text-[11px]">No file</span>
                            )}
                          </div>

                          <div>
                            <span className="text-[10px] text-[#C79AA7] block mb-1 font-semibold">
                              Store Logo (`store_logo_url`):
                            </span>
                            {seller.store_logo_url ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    openDocPreview(
                                      "Store Logo Document",
                                      seller.store_logo_url,
                                      seller.store_name || seller.user_name,
                                      seller.user_id
                                    )
                                  }
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#7A1F49]/40 hover:bg-[#7A1F49] text-pink-200 border border-[#7A1F49] text-[11px] font-medium transition-colors"
                                >
                                  <Eye size={12} /> View
                                </button>
                                <button
                                  onClick={() => handleDownloadDoc(seller.store_logo_url, `Store_Logo_${seller.user_id}`)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px] font-medium transition-colors"
                                >
                                  <Download size={12} /> Download
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#8A5468] text-[11px]">No file</span>
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
                                <CheckCircle2 size={14} /> Verified ✅
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} /> Verify Seller
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === "ngos" ? (
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
                DB Columns: `ngo_documents.reg_cert_url`, `pan_card_url`, `cert_80g_12a_url`, `ngo_contacts.contact_id_proof_url`
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
                      <th className="py-3.5 px-4">Cloudinary Legal Documents</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
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
                            </div>
                          ) : (
                            <span className="text-amber-400 italic">Contact setup pending</span>
                          )}
                        </td>

                        {/* Uploaded Legal Docs */}
                        <td className="py-4 px-4 align-top space-y-2 min-w-[220px]">
                          {ngo.reg_cert_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-0.5 font-semibold">
                                Reg Cert (`reg_cert_url`):
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    openDocPreview(
                                      "NGO Registration Certificate",
                                      ngo.reg_cert_url,
                                      ngo.ngo_name || ngo.user_name,
                                      ngo.user_id
                                    )
                                  }
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[10px]"
                                >
                                  <Eye size={11} /> View
                                </button>
                                <button
                                  onClick={() => handleDownloadDoc(ngo.reg_cert_url, `NGO_RegCert_${ngo.user_id}`)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px]"
                                >
                                  <Download size={11} /> Download
                                </button>
                              </div>
                            </div>
                          )}

                          {ngo.pan_card_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-0.5 font-semibold">
                                PAN Card (`pan_card_url`):
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    openDocPreview(
                                      "NGO PAN Card Document",
                                      ngo.pan_card_url,
                                      ngo.ngo_name || ngo.user_name,
                                      ngo.user_id
                                    )
                                  }
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[10px]"
                                >
                                  <Eye size={11} /> View
                                </button>
                                <button
                                  onClick={() => handleDownloadDoc(ngo.pan_card_url, `NGO_PAN_${ngo.user_id}`)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px]"
                                >
                                  <Download size={11} /> Download
                                </button>
                              </div>
                            </div>
                          )}

                          {ngo.cert_80g_12a_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-0.5 font-semibold">
                                80G/12A (`cert_80g_12a_url`):
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    openDocPreview(
                                      "80G / 12A Tax Exemption Certificate",
                                      ngo.cert_80g_12a_url,
                                      ngo.ngo_name || ngo.user_name,
                                      ngo.user_id
                                    )
                                  }
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[10px]"
                                >
                                  <Eye size={11} /> View
                                </button>
                                <button
                                  onClick={() => handleDownloadDoc(ngo.cert_80g_12a_url, `NGO_80G_${ngo.user_id}`)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px]"
                                >
                                  <Download size={11} /> Download
                                </button>
                              </div>
                            </div>
                          )}

                          {ngo.contact_id_proof_url && (
                            <div>
                              <span className="text-[10px] text-[#C79AA7] block mb-0.5 font-semibold">
                                Contact ID (`contact_id_proof_url`):
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() =>
                                    openDocPreview(
                                      "Contact Person ID Proof",
                                      ngo.contact_id_proof_url,
                                      ngo.contact_person_name || ngo.user_name,
                                      ngo.user_id
                                    )
                                  }
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900/40 hover:bg-purple-800 text-purple-200 border border-purple-600 text-[10px]"
                                >
                                  <Eye size={11} /> View
                                </button>
                                <button
                                  onClick={() => handleDownloadDoc(ngo.contact_id_proof_url, `NGO_ContactID_${ngo.user_id}`)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px]"
                                >
                                  <Download size={11} /> Download
                                </button>
                              </div>
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
                                <CheckCircle2 size={14} /> Verified ✅
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} /> Verify NGO
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === "products" ? (
          /* ==================================================== */
          /* 3. PRODUCTS CATALOG TABLE                            */
          /* ==================================================== */
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#4A2338] bg-[#25111D] flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-cyan-400" />
                Platform Product Catalog ({filteredProducts.length})
              </h2>
              <span className="text-xs text-[#C79AA7]">
                DB Column: `products.image_url`
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#C79AA7]">
                No products found in database matching your filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1F0E18] text-[#E9CDD3] uppercase tracking-wider font-semibold border-b border-[#4A2338]">
                      <th className="py-3.5 px-4">ID & Image</th>
                      <th className="py-3.5 px-4">Title & Category</th>
                      <th className="py-3.5 px-4">Seller & Artisan</th>
                      <th className="py-3.5 px-4">Price & Discount</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Cloudinary Media</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A2338]">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#381B2C]/50 transition-colors">
                        <td className="py-4 px-4 align-top flex items-center gap-3">
                          <img
                            src={getCloudinaryUrl(prod.image_url) || "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200"}
                            alt={prod.title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#5E2546]"
                          />
                          <div>
                            <div className="font-bold text-white">#{prod.id}</div>
                            <span className="text-[10px] text-[#8A5468]">
                              {new Date(prod.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top max-w-[220px]">
                          <div className="font-semibold text-white text-sm">{prod.title}</div>
                          <div className="text-[11px] text-pink-300 mt-0.5">Category: {prod.category || "General"}</div>
                          <p className="text-[11px] text-[#C79AA7] line-clamp-2 mt-1">{prod.description}</p>
                        </td>

                        <td className="py-4 px-4 align-top max-w-[200px]">
                          <div className="font-semibold text-white">{prod.store_name || prod.seller_name || prod.seller_user_name}</div>
                          <div className="text-[11px] text-[#C79AA7]">Artisan: {prod.artisan_name || "Self"}</div>
                          <div className="text-[11px] text-[#C79AA7]">Seller ID: #{prod.seller_id} ({prod.seller_email})</div>
                        </td>

                        <td className="py-4 px-4 align-top font-mono">
                          <div className="font-bold text-emerald-400 text-sm">₹{prod.price}</div>
                          {prod.original_price && (
                            <div className="text-[11px] text-[#8A5468] line-through">₹{prod.original_price}</div>
                          )}
                          {prod.discount_pct > 0 && (
                            <span className="text-[10px] text-amber-400 font-bold">{prod.discount_pct}% OFF</span>
                          )}
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            prod.stock > 0 ? "bg-emerald-900/40 text-emerald-300 border border-emerald-600" : "bg-red-900/40 text-red-300 border border-red-600"
                          }`}>
                            {prod.stock > 0 ? `${prod.stock} in stock` : "Out of stock"}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-top">
                          {prod.image_url ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() =>
                                  openDocPreview(
                                    `Product Image - ${prod.title}`,
                                    prod.image_url,
                                    prod.seller_name || prod.seller_user_name,
                                    prod.seller_id
                                  )
                                }
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#7A1F49]/40 hover:bg-[#7A1F49] text-pink-200 border border-[#7A1F49] text-[11px]"
                              >
                                <Eye size={12} /> View Image
                              </button>
                              <button
                                onClick={() => handleDownloadDoc(prod.image_url, `Product_${prod.id}_${prod.title.replace(/[^a-zA-Z0-9]/g, '_')}`)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 border border-emerald-600 text-[11px]"
                              >
                                <Download size={12} /> Download
                              </button>
                            </div>
                          ) : (
                            <span className="text-[#8A5468]">No image</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === "programs" ? (
          /* ==================================================== */
          /* 4. NGO EMPOWERMENT PROGRAMS TABLE                    */
          /* ==================================================== */
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#4A2338] bg-[#25111D] flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Award size={18} className="text-purple-400" />
                NGO Empowerment & Training Programs ({filteredPrograms.length})
              </h2>
              <span className="text-xs text-[#C79AA7]">
                DB Column: `empowerment_programs.cover_image_url`
              </span>
            </div>

            {filteredPrograms.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#C79AA7]">
                No NGO programs registered in database yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1F0E18] text-[#E9CDD3] uppercase tracking-wider font-semibold border-b border-[#4A2338]">
                      <th className="py-3.5 px-4">Program ID & Title</th>
                      <th className="py-3.5 px-4">Hosting NGO</th>
                      <th className="py-3.5 px-4">Category & Mode</th>
                      <th className="py-3.5 px-4">Timeline & Capacity</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A2338]">
                    {filteredPrograms.map((prog) => (
                      <tr key={prog.id} className="hover:bg-[#381B2C]/50 transition-colors">
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-white text-sm">#{prog.id} - {prog.title}</div>
                          <p className="text-[11px] text-[#C79AA7] line-clamp-2 mt-1">{prog.summary || prog.description}</p>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-semibold text-purple-300">{prog.ngo_name || prog.ngo_user_name}</div>
                          <div className="text-[11px] text-[#C79AA7]">{prog.ngo_email}</div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-medium text-pink-300">{prog.category || "Skill Development"}</div>
                          <div className="text-[11px] text-[#C79AA7]">Mode: {prog.delivery_mode || "Online"}</div>
                        </td>

                        <td className="py-4 px-4 align-top font-mono text-[11px]">
                          <div>Starts: {prog.start_at ? new Date(prog.start_at).toLocaleDateString() : "TBD"}</div>
                          <div className="text-emerald-400 mt-0.5">Capacity: {prog.capacity || "Unlimited"} seats</div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span className="px-2.5 py-1 rounded-full bg-purple-900/60 border border-purple-500 text-purple-300 text-[11px] font-semibold">
                            {prog.status || "Published"}
                          </span>
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
          /* 5. SYSTEM USERS TABLE                                */
          /* ==================================================== */
          <div className="bg-[#2D1623] border border-[#4A2338] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#4A2338] bg-[#25111D] flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <User size={18} className="text-emerald-400" />
                All Platform Registered Accounts ({filteredUsers.length})
              </h2>
              <span className="text-xs text-[#C79AA7]">
                Live user directory directly from PostgreSQL DB `users` table
              </span>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#C79AA7]">
                No users found in database matching search query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1F0E18] text-[#E9CDD3] uppercase tracking-wider font-semibold border-b border-[#4A2338]">
                      <th className="py-3.5 px-4">User ID & Name</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Contact Info</th>
                      <th className="py-3.5 px-4">Associated Entity</th>
                      <th className="py-3.5 px-4">Verification Status</th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4A2338]">
                    {filteredUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-[#381B2C]/50 transition-colors">
                        <td className="py-4 px-4 align-top">
                          <div className="font-bold text-white text-sm">#{usr.id}</div>
                          <div className="font-semibold text-pink-300 mt-0.5">{usr.user_name}</div>
                          <div className="text-[10px] text-[#8A5468] mt-1">
                            Registered: {new Date(usr.created_at).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                            usr.role === "admin"
                              ? "bg-red-900/60 border border-red-500 text-red-200"
                              : usr.role === "ngo"
                              ? "bg-purple-900/60 border border-purple-500 text-purple-200"
                              : usr.role === "seller"
                              ? "bg-pink-900/60 border border-pink-500 text-pink-200"
                              : "bg-blue-900/60 border border-blue-500 text-blue-200"
                          }`}>
                            {usr.role}
                          </span>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="font-medium text-white">{usr.email}</div>
                          <div className="text-[11px] text-[#C79AA7]">📞 {usr.contact_no}</div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          <div className="text-white font-medium">
                            {usr.store_name || usr.ngo_name || usr.seller_full_name || "N/A"}
                          </div>
                        </td>

                        <td className="py-4 px-4 align-top">
                          {usr.is_verified ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500 text-emerald-300 font-medium text-[11px]">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-900/60 border border-amber-500 text-amber-300 font-medium text-[11px]">
                              <Clock size={13} /> Pending
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4 align-top text-center">
                          {usr.role !== "admin" ? (
                            <button
                              onClick={() => handleVerify(usr.id, usr.is_verified)}
                              disabled={verifyingId === usr.id}
                              className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                                usr.is_verified
                                  ? "bg-emerald-900/40 hover:bg-red-900/60 text-emerald-200 border border-emerald-600 hover:border-red-500"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
                              }`}
                            >
                              {verifyingId === usr.id ? (
                                <RefreshCw size={12} className="animate-spin" />
                              ) : usr.is_verified ? (
                                "Toggle Unverify"
                              ) : (
                                "Verify User"
                              )}
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#8A5468]">System Admin</span>
                          )}
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

      {/* ── Document Preview & Download Verification Modal ── */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#2D1623] border border-[#5E2546] rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#4A2338] bg-[#25111D] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#7A1F49] text-white">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">{previewDoc.title}</h3>
                  <p className="text-xs text-[#C79AA7]">
                    Submitted by: <strong className="text-pink-300">{previewDoc.uploader}</strong> (ID: #{previewDoc.userId})
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

            <div className="p-6 bg-[#1F0E18] space-y-4 overflow-y-auto flex-1">
              <div className="p-4 bg-[#2D1623] border border-[#4A2338] rounded-2xl flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="text-xs text-[#C79AA7] block">Cloudinary URL Fetched from DB:</span>
                  <span className="font-mono text-xs font-semibold text-pink-300 break-all">
                    {previewDoc.fileUrl}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-lg bg-emerald-900/40 border border-emerald-500 text-emerald-300 text-xs font-medium shrink-0">
                  Cloudinary Verified
                </div>
              </div>

              {/* Document Preview Area */}
              <div className="min-h-[300px] rounded-2xl bg-[#170A12] border-2 border-dashed border-[#4A2338] flex flex-col items-center justify-center p-4 text-center overflow-hidden">
                {isImageFile(previewDoc.fileUrl) ? (
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    className="max-h-[350px] w-auto object-contain rounded-xl shadow-lg border border-[#4A2338]"
                  />
                ) : (
                  <iframe
                    src={previewDoc.fileUrl}
                    title={previewDoc.title}
                    className="w-full h-[350px] rounded-xl border border-[#4A2338]"
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleDownloadDoc(previewDoc.fileUrl, previewDoc.title)}
                  disabled={downloadingDoc}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/40"
                >
                  <Download size={16} className={downloadingDoc ? "animate-bounce" : ""} />
                  {downloadingDoc ? "Downloading Document..." : "Download File to Machine"}
                </button>
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7A1F49] hover:bg-[#ae3a65] text-white text-xs font-bold transition-all shadow-lg"
                >
                  <ExternalLink size={16} />
                  Open Direct Cloudinary Link
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-[#4A2338] bg-[#25111D] flex justify-end shrink-0">
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

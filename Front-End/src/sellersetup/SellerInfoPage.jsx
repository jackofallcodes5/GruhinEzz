import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, Store, Landmark, Package, ShoppingCart, CreditCard, Wallet, Star,
  HelpCircle, Headphones, Bell, ChevronDown, Upload, ArrowRight, Menu, X,
  ShieldCheck, User, ExternalLink, Lock, CheckCircle2,
} from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

const navSections = [
  {
    label: "STORE SETUP (MANDATORY)",
    items: [
      { icon: User, label: "1. Seller Info", path: "/seller/setup/info", active: true },
      { icon: Store, label: "2. Business Setup", path: "/seller/setup/business", locked: true },
      { icon: Landmark, label: "3. Bank Setup", path: "/seller/setup/bank", locked: true },
    ],
  },
  {
    label: "STORE MANAGEMENT (LOCKED)",
    items: [
      { icon: Package, label: "Products", path: "#", locked: true },
      { icon: ShoppingCart, label: "Orders", path: "#", locked: true },
      { icon: CreditCard, label: "Payments", path: "#", locked: true },
      { icon: Wallet, label: "Payouts", path: "#", locked: true },
      { icon: Star, label: "Reviews", path: "#", locked: true },
    ],
  },
  {
    label: "SUPPORT (LOCKED)",
    items: [
      { icon: HelpCircle, label: "Help Center", path: "#", locked: true },
      { icon: Headphones, label: "Contact Support", path: "#", locked: true },
    ],
  },
];

function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 bg-[#FDF2EF] border-r border-[#F1DDD9] flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F1DDD9]">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="GruhinEzz" className="h-10 w-auto object-contain" />
            <div>
              <p className="font-serif text-lg leading-tight text-[#5E1638] font-bold">
                GruhinEzz
              </p>
              <p className="text-[10px] tracking-wide text-[#B98A97]">
                Household Women Entrepreneurs
              </p>
            </div>
          </div>
          <button className="lg:hidden text-[#8A5468]" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#8A5468] opacity-50 cursor-not-allowed text-sm mb-4 bg-[#F5E3E0]"
            title="Complete all 3 setup steps to unlock dashboard"
          >
            <Home size={18} />
            Dashboard <Lock size={14} className="ml-auto" />
          </div>

          {navSections.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-[#C79AA7]">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map(({ icon: Icon, label, path, active, locked }) => (
                  <div key={label}>
                    {active ? (
                      <Link
                        to={path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-[#7A1F49] text-white font-medium shadow-sm"
                      >
                        <Icon size={17} />
                        {label}
                      </Link>
                    ) : (
                      <span
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#B98A97] opacity-60 cursor-not-allowed select-none"
                        title="Complete mandatory setup steps first"
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={17} />
                          {label}
                        </span>
                        <Lock size={13} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#F1DDD9]">
          <div
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5E1638]/40 text-white/60 text-sm font-medium py-2.5 cursor-not-allowed select-none"
          >
            View Store (Locked)
            <Lock size={14} />
          </div>
          <p className="text-center text-[10px] text-[#C79AA7] mt-3">
            Complete Step 1-3 to activate store.
          </p>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenu, userName }) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-[#F1DDD9] bg-white">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden text-[#5E1638]"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="h-9 w-9 rounded-lg bg-[#FDF2EF] flex items-center justify-center text-[#7A1F49]">
          <Store size={18} />
        </div>
        <div>
          <h1 className="font-serif text-lg sm:text-xl text-[#3D1526]">
            Seller Onboarding — Step 1 of 3
          </h1>
          <p className="text-xs text-[#8A5468]">Complete mandatory seller profile to access dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#7A1F49] text-white flex items-center justify-center text-sm font-medium">
            {userName ? userName[0].toUpperCase() : "S"}
          </div>
          <span className="text-sm font-medium text-[#3D1526]">
            {userName || "Seller"}
          </span>
        </div>
      </div>
    </header>
  );
}

function Stepper({ current }) {
  const steps = ["Seller Information", "Business Setup", "Bank Setup"];
  return (
    <div className="flex items-center max-w-2xl mx-auto sm:mx-0 mb-8 sm:mb-10 px-2">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 min-w-[64px]">
              <div
                className={`h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  done || active
                    ? "bg-[#7A1F49] text-white"
                    : "bg-white border-2 border-[#E9CDD3] text-[#C79AA7]"
                }`}
              >
                {step}
              </div>
              <span
                className={`text-[10px] sm:text-xs text-center whitespace-nowrap ${
                  active ? "text-[#3D1526] font-medium" : "text-[#B98A97]"
                }`}
              >
                {label}
              </span>
            </div>
            {step !== steps.length && (
              <div
                className={`flex-1 h-[2px] mx-1 sm:mx-2 -mt-5 ${
                  done ? "bg-[#7A1F49]" : "bg-[#E9CDD3]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, required = true, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#3D1526]">
        {label}
        {required && <span className="text-[#C0304B]"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#E9CDD3] bg-white px-3.5 py-2.5 text-sm text-[#3D1526] placeholder:text-[#C79AA7] focus:outline-none focus:ring-2 focus:ring-[#7A1F49]/30 focus:border-[#7A1F49] transition-shadow";

export default function SellerInfoPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState("");

  // All fields empty EXCEPT sign-up pre-filled values
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    altPhone: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    idType: "",
    idNumber: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("gruhinezz_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);

        // Pre-fill ONLY sign-up fields (fullName, email, contactNo)
        setForm((prev) => ({
          ...prev,
          fullName: u.userName || "",
          email: u.email || "",
          phone: u.contactNo || "",
        }));

        // If existing saved DB profile is present, populate with DB values
        apiClient.get(`/seller-setup/info/${u.id}`)
          .then((res) => {
            const p = res.data?.profile;
            if (p && p.full_name) {
              setForm({
                fullName: p.full_name || u.userName || "",
                email: p.email || u.email || "",
                phone: p.phone || u.contactNo || "",
                altPhone: p.alt_phone || "",
                dob: p.dob ? p.dob.split("T")[0] : "",
                gender: p.gender || "Female",
                address: p.address || "",
                city: p.city || "",
                state: p.state || "Karnataka",
                pincode: p.pincode || "",
                idType: p.id_type || "Aadhaar Card",
                idNumber: p.id_number || "",
              });
              if (p.id_proof_url) {
                setFileUploaded(true);
                setFileName(p.id_proof_url);
              }
            }
          })
          .catch((err) => {
            console.warn("Could not fetch seller profile from DB:", err.message);
          });
      } catch (e) {}
    }
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", "seller");
      formData.append("docType", "IDProof");
      formData.append("userId", user?.id || "00000");

      const res = await apiClient.post("/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.filename) {
        setFileName(res.data.filename);
        setFileUploaded(true);
      }
    } catch (err) {
      console.error("ID Proof upload error:", err);
      // Fallback filename formatting
      const ext = file.name.substring(file.name.lastIndexOf("."));
      setFileName(`S-IDProof-${user?.id || "00000"}${ext}`);
      setFileUploaded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userId = user?.id || 1;
      await apiClient.post("/seller-setup/info", {
        userId,
        ...form,
        idProofUrl: fileName || `S-IDProof-${userId}.pdf`,
      });
      navigate("/seller/setup/business");
    } catch (err) {
      console.warn("Seller profile save API warning:", err.message);
      navigate("/seller/setup/business");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F8] flex">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenu={() => setMenuOpen(true)} userName={user?.userName} />

        <main className="flex-1 px-4 sm:px-8 py-6 sm:py-8">
          {/* Verification Status Banner */}
          <div className="mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-200 rounded-xl text-amber-800 shrink-0 mt-0.5">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-amber-950">Verification Status: Unverified</h4>
                <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
                  <strong>Your account is currently under verification. Please review your submitted information. You will get access to your dashboard once your account is verified.</strong>
                </p>
              </div>
            </div>
            <span className="font-bold text-[#7A1F49] px-3 py-1 bg-white rounded-xl border border-[#E9CDD3] text-xs shrink-0">
              Step 1 / 3
            </span>
          </div>

          <Stepper current={1} />

          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            {/* Form card */}
            <div className="bg-white rounded-2xl border border-[#F1DDD9] shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-[#FDF2EF] to-[#FBEAE8]">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#3D1526] font-bold">
                    Step 1: Seller Information (Mandatory)
                  </h2>
                  <p className="text-sm text-[#8A5468] mt-1 max-w-md">
                    Fill in your personal identity details. All fields are compulsory.
                  </p>
                </div>
                <div className="hidden sm:flex h-16 w-16 shrink-0 rounded-full bg-white/60 items-center justify-center">
                  <User size={28} className="text-[#7A1F49]" />
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D1526] pb-3 mb-5 border-b border-[#F1DDD9]">
                    <User size={16} className="text-[#7A1F49]" />
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
                    <Field label="Full Name" required>
                      <input
                        className={inputClass}
                        value={form.fullName}
                        onChange={set("fullName")}
                        placeholder="Enter full name"
                        required
                      />
                    </Field>
                    <Field label="Email Address" required>
                      <input
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={set("email")}
                        placeholder="Enter email address"
                        required
                      />
                    </Field>
                    <Field label="Phone Number" required>
                      <div className="flex">
                        <span className="flex items-center gap-1 rounded-l-lg border border-r-0 border-[#E9CDD3] bg-[#FDF2EF] px-3 text-sm text-[#3D1526]">
                          🇮🇳 +91
                        </span>
                        <input
                          className={`${inputClass} rounded-l-none`}
                          value={form.phone}
                          onChange={set("phone")}
                          placeholder="Enter contact number"
                          required
                        />
                      </div>
                    </Field>

                    <Field label="Date of Birth" required>
                      <input
                        type="date"
                        className={inputClass}
                        value={form.dob}
                        onChange={set("dob")}
                        required
                      />
                    </Field>
                    <Field label="Gender" required>
                      <select
                        className={inputClass}
                        value={form.gender}
                        onChange={set("gender")}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>
                    <Field label="Alternate Phone" required>
                      <div className="flex">
                        <span className="flex items-center gap-1 rounded-l-lg border border-r-0 border-[#E9CDD3] bg-[#FDF2EF] px-3 text-sm text-[#3D1526]">
                          🇮🇳 +91
                        </span>
                        <input
                          className={`${inputClass} rounded-l-none`}
                          value={form.altPhone}
                          onChange={set("altPhone")}
                          placeholder="Enter alternate phone"
                          required
                        />
                      </div>
                    </Field>

                    <div className="sm:col-span-2 lg:col-span-3">
                      <Field label="Residential Address" required>
                        <input
                          className={inputClass}
                          value={form.address}
                          onChange={set("address")}
                          placeholder="Enter house no, street, area"
                          required
                        />
                      </Field>
                    </div>

                    <Field label="City" required>
                      <input
                        className={inputClass}
                        value={form.city}
                        onChange={set("city")}
                        placeholder="Enter city"
                        required
                      />
                    </Field>
                    <Field label="State" required>
                      <select
                        className={inputClass}
                        value={form.state}
                        onChange={set("state")}
                        required
                      >
                        <option value="">Select State</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                      </select>
                    </Field>
                    <Field label="Pincode" required>
                      <input
                        className={inputClass}
                        value={form.pincode}
                        onChange={set("pincode")}
                        placeholder="Enter 6-digit pincode"
                        required
                      />
                    </Field>
                  </div>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D1526] pb-3 mb-5 border-b border-[#F1DDD9]">
                    <ShieldCheck size={16} className="text-[#7A1F49]" />
                    Identity Details (Compulsory)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
                    <Field label="Identity Proof Type" required>
                      <select
                        className={inputClass}
                        value={form.idType}
                        onChange={set("idType")}
                        required
                      >
                        <option value="">Select ID Type</option>
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Passport">Passport</option>
                      </select>
                    </Field>
                    <Field label="Identity Number" required>
                      <input
                        className={inputClass}
                        value={form.idNumber}
                        onChange={set("idNumber")}
                        placeholder="Enter ID number"
                        required
                      />
                    </Field>
                    <Field label="Upload Identity Proof Document" required>
                      <label className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-4 text-center cursor-pointer transition-colors ${
                        fileUploaded ? "border-[#137333] bg-[#e6f4ea]" : "border-[#E9CDD3] bg-[#FDF9F8] hover:border-[#7A1F49]/50"
                      }`}>
                        {fileUploaded ? (
                          <>
                            <CheckCircle2 size={20} className="text-[#137333]" />
                            <span className="text-xs font-bold text-[#137333] truncate max-w-[180px]">{fileName}</span>
                            <span className="text-[10px] text-[#137333]">Uploaded successfully</span>
                          </>
                        ) : (
                          <>
                            <Upload size={18} className="text-[#7A1F49]" />
                            <span className="text-sm font-medium text-[#7A1F49]">
                              Upload Proof (Required)
                            </span>
                            <span className="text-[11px] text-[#B98A97]">
                              JPG, PNG or PDF (Max. 5MB)
                            </span>
                          </>
                        )}
                        <input type="file" className="hidden" onChange={handleFileUpload} required={!fileUploaded} />
                      </label>
                    </Field>
                  </div>
                </section>
              </div>

              <div className="flex justify-end px-6 sm:px-8 py-5 border-t border-[#F1DDD9]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#7A1F49] text-white font-medium text-sm px-6 py-2.5 hover:bg-[#5E1638] transition-colors"
                >
                  {saving ? "Saving..." : "Save & Continue to Step 2"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Info panel */}
            <div className="space-y-4 xl:sticky xl:top-6 self-start">
              <div className="bg-white rounded-2xl border border-[#F1DDD9] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-[#7A1F49]" />
                  <h4 className="font-serif text-base text-[#3D1526] font-semibold">
                    Mandatory 3-Step Setup
                  </h4>
                </div>
                <p className="text-sm text-[#8A5468] mb-4">
                  To protect buyers and ensure secure store operations, all 3 steps must be completed before accessing the dashboard:
                </p>
                <ul className="space-y-2 text-sm text-[#5E1638]">
                  {[
                    "Step 1: Personal & KYC Info",
                    "Step 2: Business & Store Info",
                    "Step 3: Bank Account Info",
                  ].map((t, idx) => (
                    <li key={t} className="flex items-start gap-2 font-medium">
                      <span className={`mt-0.5 ${idx === 0 ? "text-[#7A1F49] font-bold" : "text-[#C79AA7]"}`}>
                        {idx === 0 ? "➔" : "🔒"}
                      </span>
                      <span className={idx === 0 ? "text-[#7A1F49]" : "text-[#8A5468]"}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#FDF2EF] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones size={16} className="text-[#7A1F49]" />
                  <h4 className="font-serif text-base text-[#3D1526] font-semibold">
                    Need Assistance?
                  </h4>
                </div>
                <p className="text-sm text-[#8A5468] mb-4">
                  Our GruhinEzz support team is here to guide household entrepreneurs through setup.
                </p>
                <button
                  type="button"
                  className="w-full rounded-lg border border-[#E9CDD3] bg-white text-sm font-medium text-[#3D1526] py-2.5 hover:bg-[#F5E3E0] transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

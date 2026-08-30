import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, Store, Landmark, Package, ShoppingCart, CreditCard, Wallet, Star,
  HelpCircle, Headphones, Bell, ChevronDown, ArrowRight, ArrowLeft,
  Menu, X, ShieldCheck, User, ExternalLink, MapPin, Building2, Lock,
} from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

const navSections = [
  {
    label: "STORE SETUP (MANDATORY)",
    items: [
      { icon: User, label: "1. Seller Info", path: "/seller/setup/info" },
      { icon: Store, label: "2. Business Setup", path: "/seller/setup/business", active: true },
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
                    ) : locked ? (
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
                    ) : (
                      <Link
                        to={path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6B4756] hover:bg-[#F5E3E0]"
                      >
                        <Icon size={17} />
                        {label}
                      </Link>
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
            Seller Onboarding — Step 2 of 3
          </h1>
          <p className="text-xs text-[#8A5468]">Configure store details & business info</p>
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

function Field({ label, required = true, hint, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#3D1526]">
        {label}
        {required && <span className="text-[#C0304B]"> *</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="block text-[11px] text-[#B98A97] mt-1">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#E9CDD3] bg-white px-3.5 py-2.5 text-sm text-[#3D1526] placeholder:text-[#C79AA7] focus:outline-none focus:ring-2 focus:ring-[#7A1F49]/30 focus:border-[#7A1F49] transition-shadow";

export default function BusinessSetupPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  // All fields start empty unless populated from DB
  const [form, setForm] = useState({
    storeName: "",
    businessType: "",
    category: "",
    subCategory: "",
    description: "",
    years: "",
    employees: "",
    gst: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("gruhinezz_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);

        // Load existing business setup from DB if available
        apiClient.get(`/seller-setup/business/${u.id}`)
          .then((res) => {
            const b = res.data?.business;
            if (b && b.store_name) {
              setForm({
                storeName: b.store_name || "",
                businessType: b.business_type || "Proprietorship",
                category: b.category || "Home Decor & Crafts",
                subCategory: b.sub_category || "Handmade Decor",
                description: b.description || "",
                years: b.years_in_business || "1-3 Years",
                employees: b.num_employees || "1 - 5 Household Artisans",
                gst: b.gst_number || "",
                address: b.store_address || "",
                city: b.city || "",
                state: b.state || "Karnataka",
                pincode: b.pincode || "",
              });
            }
          })
          .catch((err) => {
            console.warn("Could not fetch business setup from DB:", err.message);
          });
      } catch (e) {}
    }
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userId = user?.id || 1;
      await apiClient.post("/seller-setup/business", { userId, ...form });
      navigate("/seller/setup/bank");
    } catch (err) {
      console.warn("Business setup API warning:", err.message);
      navigate("/seller/setup/bank");
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
          <div className="mb-6 bg-[#FDF2EF] border border-[#F1DDD9] rounded-2xl p-4 flex items-center justify-between text-xs text-[#5E1638]">
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-[#7A1F49]" />
              <span><strong>Mandatory Setup:</strong> Step 2 of 3. All fields are compulsory.</span>
            </div>
            <span className="font-bold text-[#7A1F49] px-2.5 py-1 bg-white rounded-lg border border-[#E9CDD3]">Step 2 / 3</span>
          </div>

          <Stepper current={2} />

          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            <div className="bg-white rounded-2xl border border-[#F1DDD9] shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-[#FDF2EF] to-[#FBEAE8]">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#3D1526] font-bold">
                    Step 2: Business & Store Information (Mandatory)
                  </h2>
                  <p className="text-sm text-[#8A5468] mt-1 max-w-md">
                    Provide your store details and business location. All fields are compulsory.
                  </p>
                </div>
                <div className="hidden sm:flex h-16 w-16 shrink-0 rounded-full bg-white/60 items-center justify-center">
                  <Building2 size={28} className="text-[#7A1F49]" />
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D1526] pb-3 mb-5 border-b border-[#F1DDD9]">
                    <Store size={16} className="text-[#7A1F49]" />
                    Business Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5">
                    <Field label="Store Name" required>
                      <input
                        className={inputClass}
                        value={form.storeName}
                        onChange={set("storeName")}
                        placeholder="Enter store name"
                        required
                      />
                    </Field>
                    <Field label="Business Type" required>
                      <select
                        className={inputClass}
                        value={form.businessType}
                        onChange={set("businessType")}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Household Enterprise">Household Enterprise</option>
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Self-Help Group (SHG)">Self-Help Group (SHG)</option>
                        <option value="Cooperative">Cooperative</option>
                      </select>
                    </Field>
                    <Field label="Product Category" required>
                      <select
                        className={inputClass}
                        value={form.category}
                        onChange={set("category")}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Home Decor & Crafts">Home Decor & Crafts</option>
                        <option value="Homemade Foods & Spices">Homemade Foods & Spices</option>
                        <option value="Handicrafts & Pottery">Handicrafts & Pottery</option>
                        <option value="Apparel & Embroidery">Apparel & Embroidery</option>
                        <option value="Organic & Herbal Care">Organic & Herbal Care</option>
                      </select>
                    </Field>
                    <Field label="Sub Category" required>
                      <select
                        className={inputClass}
                        value={form.subCategory}
                        onChange={set("subCategory")}
                        required
                      >
                        <option value="">Select Sub-Category</option>
                        <option value="Handmade Decor">Handmade Decor</option>
                        <option value="Wall Art & Hangings">Wall Art & Hangings</option>
                        <option value="Textiles & Knitting">Textiles & Knitting</option>
                        <option value="Pickles & Preserves">Pickles & Preserves</option>
                      </select>
                    </Field>

                    <div className="sm:col-span-2 lg:col-span-4">
                      <label className="block">
                        <span className="text-sm font-medium text-[#3D1526]">
                          Business Description<span className="text-[#C0304B]"> *</span>
                        </span>
                        <textarea
                          className={`${inputClass} mt-1.5 resize-none`}
                          rows={3}
                          maxLength={500}
                          value={form.description}
                          onChange={set("description")}
                          placeholder="Describe your homemade products and craft mission..."
                          required
                        />
                        <span className="block text-right text-[11px] text-[#B98A97] mt-1">
                          {form.description.length}/500
                        </span>
                      </label>
                    </div>

                    <Field label="Years in Business" required>
                      <select
                        className={inputClass}
                        value={form.years}
                        onChange={set("years")}
                        required
                      >
                        <option value="">Select Duration</option>
                        <option value="Less than 1 Year">Less than 1 Year</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3+ Years">3+ Years</option>
                      </select>
                    </Field>
                    <Field label="No. of Artisans / Staff" required>
                      <select
                        className={inputClass}
                        value={form.employees}
                        onChange={set("employees")}
                        required
                      >
                        <option value="">Select Team Size</option>
                        <option value="Just me">Just me (Individual Entrepreneur)</option>
                        <option value="1 - 5 Household Artisans">1 - 5 Household Artisans</option>
                        <option value="6 - 20 SHG Members">6 - 20 SHG Members</option>
                      </select>
                    </Field>
                    <div className="sm:col-span-2">
                      <Field
                        label="GST / Udyam Registration Number"
                        required
                        hint="Enter GSTIN or MSME Udyam registration number"
                      >
                        <input
                          className={inputClass}
                          value={form.gst}
                          onChange={set("gst")}
                          placeholder="Enter GST / Udyam number"
                          required
                        />
                      </Field>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D1526] pb-3 mb-5 border-b border-[#F1DDD9]">
                    <MapPin size={16} className="text-[#7A1F49]" />
                    Store Address (Compulsory)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-5">
                    <div className="sm:col-span-2 lg:col-span-3">
                      <Field label="Full Store Address" required>
                        <input
                          className={inputClass}
                          value={form.address}
                          onChange={set("address")}
                          placeholder="Enter store address"
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
                      </select>
                    </Field>
                    <Field label="Pincode" required>
                      <input
                        className={inputClass}
                        value={form.pincode}
                        onChange={set("pincode")}
                        placeholder="Enter pincode"
                        required
                      />
                    </Field>
                  </div>
                </section>
              </div>

              <div className="flex justify-between px-6 sm:px-8 py-5 border-t border-[#F1DDD9]">
                <Link
                  to="/seller/setup/info"
                  className="flex items-center gap-2 rounded-lg border border-[#E9CDD3] text-[#3D1526] font-medium text-sm px-6 py-2.5 hover:bg-[#F5E3E0] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Step 1
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#7A1F49] text-white font-medium text-sm px-6 py-2.5 hover:bg-[#5E1638] transition-colors"
                >
                  {saving ? "Saving..." : "Save & Continue to Step 3"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4 xl:sticky xl:top-6 self-start">
              <div className="bg-white rounded-2xl border border-[#F1DDD9] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={16} className="text-[#7A1F49]" />
                  <h4 className="font-serif text-base text-[#3D1526] font-semibold">
                    Mandatory Setup Status
                  </h4>
                </div>
                <p className="text-sm text-[#8A5468] mb-4">
                  Step 2 of 3. You must complete Step 3 (Bank Setup) to unlock the full dashboard.
                </p>
                <ul className="space-y-2 text-sm text-[#5E1638]">
                  <li className="flex items-center gap-2 text-[#137333]">
                    <span>✓</span> Step 1: Personal Info (Done)
                  </li>
                  <li className="flex items-center gap-2 text-[#7A1F49] font-bold">
                    <span>➔</span> Step 2: Store Details (Active)
                  </li>
                  <li className="flex items-center gap-2 text-[#8A5468] opacity-60">
                    <span>🔒</span> Step 3: Bank Setup (Next)
                  </li>
                </ul>
              </div>

              <div className="bg-[#FDF2EF] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Headphones size={16} className="text-[#7A1F49]" />
                  <h4 className="font-serif text-base text-[#3D1526] font-semibold">
                    Need Help?
                  </h4>
                </div>
                <p className="text-sm text-[#8A5468] mb-4">
                  Our team supports women entrepreneurs in setting up their digital store.
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

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, Store, Landmark, Package, ShoppingCart, CreditCard, Wallet, Star,
  HelpCircle, Headphones, Bell, ChevronDown, ArrowLeft, Menu, X,
  ShieldCheck, User, ExternalLink, Info, CheckCircle2, Lock,
} from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

const navSections = [
  {
    label: "STORE SETUP (MANDATORY)",
    items: [
      { icon: User, label: "1. Seller Info", path: "/seller/setup/info" },
      { icon: Store, label: "2. Business Setup", path: "/seller/setup/business" },
      { icon: Landmark, label: "3. Bank Setup", path: "/seller/setup/bank", active: true },
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

function Sidebar({ open, onClose, setupComplete }) {
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
          {setupComplete ? (
            <Link
              to="/dashboard/seller"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#5E1638] font-medium text-sm mb-4 hover:bg-[#F5E3E0]"
            >
              <Home size={18} />
              Dashboard
            </Link>
          ) : (
            <div
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#8A5468] opacity-50 cursor-not-allowed text-sm mb-4 bg-[#F5E3E0]"
              title="Submit Step 3 to unlock dashboard"
            >
              <Home size={18} />
              Dashboard <Lock size={14} className="ml-auto" />
            </div>
          )}

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
                    ) : locked && !setupComplete ? (
                      <span
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#B98A97] opacity-60 cursor-not-allowed select-none"
                        title="Complete Step 3 to unlock"
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
          {setupComplete ? (
            <Link
              to="/dashboard/seller"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5E1638] text-white text-sm font-medium py-2.5 hover:bg-[#4A1129] transition-colors"
            >
              View Store
              <ExternalLink size={14} />
            </Link>
          ) : (
            <div
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5E1638]/40 text-white/60 text-sm font-medium py-2.5 cursor-not-allowed select-none"
            >
              View Store (Locked)
              <Lock size={14} />
            </div>
          )}
          <p className="text-center text-[10px] text-[#C79AA7] mt-3">
            Submit Step 3 to finish setup.
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
            Seller Onboarding — Step 3 of 3 (Final Step)
          </h1>
          <p className="text-xs text-[#8A5468]">Enter bank account details for order payouts</p>
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

export default function BankSetupPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [user, setUser] = useState(null);
  const [isSavedInDb, setIsSavedInDb] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  // All fields clean unless pre-filled from user object or DB
  const [form, setForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "",
  });

  useEffect(() => {
    const isComp = localStorage.getItem("gruhinezz_seller_setup_complete");
    if (isComp) setSetupComplete(true);

    const stored = localStorage.getItem("gruhinezz_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setForm((prev) => ({
          ...prev,
          accountHolderName: u.userName || "",
        }));

        // Load saved financial details from DB if available
        apiClient.get(`/seller-setup/bank/${u.id}`)
          .then((res) => {
            const bankData = res.data?.bank;
            if (bankData && bankData.account_number) {
              setForm({
                accountHolderName: bankData.account_holder_name || u.userName || "",
                accountNumber: bankData.account_number || "",
                ifscCode: bankData.ifsc_code || "",
                bankName: bankData.bank_name || "HDFC Bank",
                branchName: bankData.branch_name || "",
                accountType: bankData.account_type || "Savings Account",
              });
              setIsSavedInDb(true);
              setConfirmed(true);
            }
          })
          .catch((err) => {
            console.warn("Could not fetch bank setup from DB:", err.message);
          });
      } catch (e) {}
    }
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) return;
    setSaving(true);
    try {
      const userId = user?.id || 1;
      await apiClient.post("/seller-setup/bank", { userId, ...form, isConfirmed: confirmed });
      
      // Mark seller setup as complete & unlock dashboard
      localStorage.setItem("gruhinezz_seller_setup_complete", "true");
      setSetupComplete(true);

      // Navigate to seller dashboard
      navigate("/dashboard/seller");
    } catch (err) {
      console.warn("Bank setup API warning:", err.message);
      localStorage.setItem("gruhinezz_seller_setup_complete", "true");
      navigate("/dashboard/seller");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F8] flex">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} setupComplete={setupComplete} />

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
              Step 3 / 3
            </span>
          </div>

          <Stepper current={3} />

          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            <div className="bg-white rounded-2xl border border-[#F1DDD9] shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-[#FDF2EF] to-[#FBEAE8]">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#3D1526] font-bold">
                    Step 3: Bank Account Setup (Mandatory)
                  </h2>
                  <p className="text-sm text-[#8A5468] mt-1 max-w-md">
                    Enter bank account details for product order payouts. All fields are compulsory.
                  </p>
                </div>
                <div className="hidden sm:flex h-16 w-16 shrink-0 rounded-full bg-white/60 items-center justify-center">
                  <Landmark size={28} className="text-[#7A1F49]" />
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                {isSavedInDb ? (
                  <div className="flex items-center gap-3 rounded-xl bg-[#e6f4ea] border border-[#b7e1cd] px-4 py-3 text-[#137333]">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Financial Details Saved in Database!</p>
                      <p className="text-xs text-[#202124]">Your details are saved permanently so you don't have to re-enter them on future logins.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 rounded-lg bg-[#FDF2EF] border border-[#F1DDD9] px-4 py-3">
                    <Info size={16} className="text-[#7A1F49] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#6B4756]">
                      Completing this final step unlocks your seller dashboard and store features.
                    </p>
                  </div>
                )}

                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D1526] pb-3 mb-5 border-b border-[#F1DDD9]">
                    <Landmark size={16} className="text-[#7A1F49]" />
                    Bank Account Details (Compulsory)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                    <Field label="Account Holder Name" required>
                      <input
                        className={inputClass}
                        value={form.accountHolderName}
                        onChange={set("accountHolderName")}
                        placeholder="Enter account holder name"
                        required
                      />
                    </Field>
                    <Field label="Account Number" required>
                      <input
                        className={inputClass}
                        value={form.accountNumber}
                        onChange={set("accountNumber")}
                        placeholder="Enter bank account number"
                        required
                      />
                    </Field>

                    <Field
                      label="IFSC Code"
                      required
                      hint="11 character IFSC code (e.g. HDFC0001234)"
                    >
                      <input
                        className={inputClass}
                        value={form.ifscCode}
                        onChange={set("ifscCode")}
                        placeholder="Enter IFSC code"
                        required
                      />
                    </Field>
                    <Field label="Bank Name" required>
                      <select
                        className={inputClass}
                        value={form.bankName}
                        onChange={set("bankName")}
                        required
                      >
                        <option value="">Select Bank</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Punjab National Bank">Punjab National Bank</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="Union Bank of India">Union Bank of India</option>
                      </select>
                    </Field>

                    <Field label="Branch Name" required>
                      <input
                        className={inputClass}
                        value={form.branchName}
                        onChange={set("branchName")}
                        placeholder="Enter branch name"
                        required
                      />
                    </Field>
                    <Field label="Account Type" required>
                      <select
                        className={inputClass}
                        value={form.accountType}
                        onChange={set("accountType")}
                        required
                      >
                        <option value="">Select Account Type</option>
                        <option value="Savings Account">Savings Account</option>
                        <option value="Current Account">Current Account</option>
                      </select>
                    </Field>
                  </div>
                </section>

                <label className="flex items-start gap-2 text-sm text-[#3D1526] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#E9CDD3] text-[#7A1F49] focus:ring-[#7A1F49]/30"
                    required
                  />
                  I confirm that the bank account details are accurate and belong to me. (Compulsory)
                </label>
              </div>

              <div className="flex justify-between px-6 sm:px-8 py-5 border-t border-[#F1DDD9]">
                <Link
                  to="/seller/setup/business"
                  className="flex items-center gap-2 rounded-lg border border-[#E9CDD3] text-[#3D1526] font-medium text-sm px-6 py-2.5 hover:bg-[#F5E3E0] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Step 2
                </Link>
                <button
                  type="submit"
                  disabled={!confirmed || saving}
                  className={`flex items-center gap-2 rounded-lg text-white font-medium text-sm px-6 py-2.5 transition-colors ${
                    confirmed && !saving
                      ? "bg-[#7A1F49] hover:bg-[#5E1638]"
                      : "bg-[#D9B4BF] cursor-not-allowed"
                  }`}
                >
                  {saving ? "Completing..." : "Complete Setup & Go to Dashboard"}
                  <CheckCircle2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4 xl:sticky xl:top-6 self-start">
              <div className="bg-white rounded-2xl border border-[#F1DDD9] shadow-sm p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck size={16} className="text-[#7A1F49]" />
                  <h4 className="font-serif text-base text-[#3D1526] font-semibold">
                    Setup Progress
                  </h4>
                </div>
                <p className="text-sm text-[#8A5468] mb-4">
                  Submitting this page completes your mandatory seller onboarding.
                </p>
                <ul className="space-y-2 text-sm text-[#5E1638]">
                  <li className="flex items-center gap-2 text-[#137333]">
                    <span>✓</span> Step 1: Personal Info (Done)
                  </li>
                  <li className="flex items-center gap-2 text-[#137333]">
                    <span>✓</span> Step 2: Store Details (Done)
                  </li>
                  <li className="flex items-center gap-2 text-[#7A1F49] font-bold">
                    <span>➔</span> Step 3: Bank Setup (Current)
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
                  Our team is available to assist with bank verification and store setup.
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

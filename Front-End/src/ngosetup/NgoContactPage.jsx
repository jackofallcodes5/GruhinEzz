import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, Building2, Users, FileText, Settings, HelpCircle, Headphones,
  Bell, ChevronDown, Upload, ArrowRight, ArrowLeft, Menu, X, ShieldCheck, Lock, CheckCircle2,
} from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

const navSections = [
  {
    label: "NGO SETUP (MANDATORY)",
    items: [
      { icon: Building2, label: "1. Basic Identity", path: "/ngo/setup/identity" },
      { icon: Users, label: "2. Contact & Verification", path: "/ngo/setup/contact", active: true },
      { icon: FileText, label: "3. Legal Docs", path: "/ngo/setup/legal", locked: true },
    ],
  },
  {
    label: "NGO PORTAL (LOCKED)",
    items: [
      { icon: Users, label: "Programs", path: "#", locked: true },
      { icon: FileText, label: "Beneficiaries", path: "#", locked: true },
      { icon: ShieldCheck, label: "Impact Reports", path: "#", locked: true },
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
                NGO Partner Portal
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
          <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5E1638]/40 text-white/60 text-sm font-medium py-2.5 cursor-not-allowed select-none">
            NGO Portal (Locked) <Lock size={14} />
          </div>
          <p className="text-center text-[10px] text-[#C79AA7] mt-3">
            Complete Step 1-3 to activate NGO portal.
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
          <Users size={18} />
        </div>
        <div>
          <h1 className="font-serif text-lg sm:text-xl text-[#3D1526]">
            NGO Registration — Step 2 of 3
          </h1>
          <p className="text-xs text-[#8A5468]">Contact & Representative Verification</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#7A1F49] text-white flex items-center justify-center text-sm font-medium">
            {userName ? userName[0].toUpperCase() : "N"}
          </div>
          <span className="text-sm font-medium text-[#3D1526]">
            {userName || "NGO Partner"}
          </span>
        </div>
      </div>
    </header>
  );
}

function Stepper({ current }) {
  const steps = ["Basic Identity", "Contact & Verification", "Legal Docs"];
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

export default function NgoContactPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [idUploaded, setIdUploaded] = useState(false);
  const [idFileName, setIdFileName] = useState("");

  const [form, setForm] = useState({
    officialEmail: "",
    phone: "",
    website: "",
    registeredAddress: "",
    operationalAddress: "",
    contactPersonName: "",
    designation: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("gruhinezz_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);
        setForm((prev) => ({
          ...prev,
          officialEmail: u.email || "",
          phone: u.contactNo || "",
          contactPersonName: u.userName || "",
        }));

        apiClient.get(`/ngo-setup/contact/${u.id}`)
          .then((res) => {
            const c = res.data?.contact;
            if (c && c.official_email) {
              setForm({
                officialEmail: c.official_email || u.email || "",
                phone: c.phone || u.contactNo || "",
                website: c.website || "",
                registeredAddress: c.registered_address || "",
                operationalAddress: c.operational_address || "",
                contactPersonName: c.contact_person_name || u.userName || "",
                designation: c.designation || "",
              });
              if (c.contact_id_proof_url) {
                setIdUploaded(true);
                setIdFileName("Contact_Person_ID.pdf");
              }
            }
          })
          .catch((err) => {
            console.warn("Could not fetch NGO contact from DB:", err.message);
          });
      } catch (e) {}
    }
  }, []);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleIdUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", "ngo");
      formData.append("docType", "ContactID");
      formData.append("userId", user?.id || "00000");

      const res = await apiClient.post("/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.filename) {
        setIdFileName(res.data.filename);
        setIdUploaded(true);
      }
    } catch (err) {
      console.error("NGO Contact ID upload error:", err);
      const ext = file.name.substring(file.name.lastIndexOf("."));
      setIdFileName(`N-ContactID-${user?.id || "00000"}${ext}`);
      setIdUploaded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userId = user?.id || 1;
      await apiClient.post("/ngo-setup/contact", {
        userId,
        ...form,
        contactIdProofUrl: idFileName || `N-ContactID-${userId}.pdf`,
      });
      navigate("/ngo/setup/legal");
    } catch (err) {
      console.warn("NGO contact save warning:", err.message);
      navigate("/ngo/setup/legal");
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
              Step 2 / 3
            </span>
          </div>

          <Stepper current={2} />

          <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
            <div className="bg-white rounded-2xl border border-[#F1DDD9] shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-gradient-to-r from-[#FDF2EF] to-[#FBEAE8]">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl text-[#3D1526] font-bold">
                    Step 2: Contact & Verification (Mandatory)
                  </h2>
                  <p className="text-sm text-[#8A5468] mt-1 max-w-md">
                    Enter office address and representative contact details.
                  </p>
                </div>
                <div className="hidden sm:flex h-16 w-16 shrink-0 rounded-full bg-white/60 items-center justify-center">
                  <Users size={28} className="text-[#7A1F49]" />
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D1526] pb-3 mb-5 border-b border-[#F1DDD9]">
                    <Users size={16} className="text-[#7A1F49]" />
                    Organization Contact Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                    <Field label="Official Email" required>
                      <input
                        type="email"
                        className={inputClass}
                        value={form.officialEmail}
                        onChange={set("officialEmail")}
                        placeholder="Enter official email"
                        required
                      />
                    </Field>

                    <Field label="Official Phone Number" required>
                      <input
                        type="tel"
                        className={inputClass}
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="Enter contact phone"
                        required
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Website / Social Media Links" required={false} hint="e.g. https://www.yourngo.org">
                        <input
                          className={inputClass}
                          value={form.website}
                          onChange={set("website")}
                          placeholder="https://www.yourngo.org (optional)"
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <Field label="Registered Office Address" required>
                        <input
                          className={inputClass}
                          value={form.registeredAddress}
                          onChange={set("registeredAddress")}
                          placeholder="Enter full registered address"
                          required
                        />
                      </Field>
                    </div>

                    <div className="sm:col-span-2">
                      <Field label="Operational Address (If Different)" required={false}>
                        <input
                          className={inputClass}
                          value={form.operationalAddress}
                          onChange={set("operationalAddress")}
                          placeholder="Enter operational branch address (optional)"
                        />
                      </Field>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[#3D1526] pb-3 mb-5 border-b border-[#F1DDD9]">
                    <ShieldCheck size={16} className="text-[#7A1F49]" />
                    Representative Verification
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
                    <Field label="Contact Person Name" required>
                      <input
                        className={inputClass}
                        value={form.contactPersonName}
                        onChange={set("contactPersonName")}
                        placeholder="Enter representative full name"
                        required
                      />
                    </Field>

                    <Field label="Designation" required>
                      <input
                        className={inputClass}
                        value={form.designation}
                        onChange={set("designation")}
                        placeholder="e.g. Director, President, Secretary"
                        required
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Government ID Proof of Contact Person (Aadhaar / PAN)" required>
                        <label className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-4 text-center cursor-pointer transition-colors ${
                          idUploaded ? "border-[#137333] bg-[#e6f4ea]" : "border-[#E9CDD3] bg-[#FDF9F8] hover:border-[#7A1F49]/50"
                        }`}>
                          {idUploaded ? (
                            <>
                              <CheckCircle2 size={20} className="text-[#137333]" />
                              <span className="text-xs font-bold text-[#137333] truncate max-w-[200px]">{idFileName}</span>
                              <span className="text-[10px] text-[#137333]">Uploaded successfully</span>
                            </>
                          ) : (
                            <>
                              <Upload size={18} className="text-[#7A1F49]" />
                              <span className="text-sm font-medium text-[#7A1F49]">
                                Upload Government ID Proof (Required)
                              </span>
                              <span className="text-[11px] text-[#B98A97]">
                                Aadhaar, PAN, Voter ID or Passport (PDF / Image)
                              </span>
                            </>
                          )}
                          <input type="file" className="hidden" onChange={handleIdUpload} required={!idUploaded} />
                        </label>
                      </Field>
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex justify-between px-6 sm:px-8 py-5 border-t border-[#F1DDD9]">
                <Link
                  to="/ngo/setup/identity"
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
                    Setup Progress
                  </h4>
                </div>
                <p className="text-sm text-[#8A5468] mb-4">
                  Step 2 of 3. You must complete Step 3 (Legal Docs) to activate your portal.
                </p>
                <ul className="space-y-2 text-sm text-[#5E1638]">
                  <li className="flex items-center gap-2 text-[#137333]">
                    <span>✓</span> Step 1: Basic Identity (Done)
                  </li>
                  <li className="flex items-center gap-2 text-[#7A1F49] font-bold">
                    <span>➔</span> Step 2: Contact & Verification (Active)
                  </li>
                  <li className="flex items-center gap-2 text-[#8A5468] opacity-60">
                    <span>🔒</span> Step 3: Legal Compliance Docs (Next)
                  </li>
                </ul>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

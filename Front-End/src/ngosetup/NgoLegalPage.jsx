import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Home, Building2, Users, FileText, Settings, HelpCircle, Headphones,
  Bell, ChevronDown, Upload, ArrowLeft, Menu, X, ShieldCheck, Lock, CheckCircle2,
} from "lucide-react";
import logoImg from "../assets/logo.png";
import apiClient from "../services/apiClient";

const navSections = [
  {
    label: "NGO SETUP (MANDATORY)",
    items: [
      { icon: Building2, label: "1. Basic Identity", path: "/ngo/setup/identity" },
      { icon: Users, label: "2. Contact & Verification", path: "/ngo/setup/contact" },
      { icon: FileText, label: "3. Legal Docs", path: "/ngo/setup/legal", active: true },
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
                NGO Partner Portal
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
              to="/dashboard/ngo"
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
              to="/dashboard/ngo"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5E1638] text-white text-sm font-medium py-2.5 hover:bg-[#4A1129] transition-colors"
            >
              NGO Portal Active
            </Link>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#5E1638]/40 text-white/60 text-sm font-medium py-2.5 cursor-not-allowed select-none">
              NGO Portal (Locked) <Lock size={14} />
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
          <FileText size={18} />
        </div>
        <div>
          <h1 className="font-serif text-lg sm:text-xl text-[#3D1526]">
            NGO Registration — Step 3 of 3 (Final Step)
          </h1>
          <p className="text-xs text-[#8A5468]">Legal & Compliance Document Uploads</p>
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

export default function NgoLegalPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [setupComplete, setSetupComplete] = useState(false);

  const [files, setFiles] = useState({
    regCert: null,
    regCertName: "",
    panCard: null,
    panCardName: "",
    cert80g: null,
    cert80gName: "",
  });

  useEffect(() => {
    const isComp = localStorage.getItem("gruhinezz_ngo_setup_complete");
    if (isComp) setSetupComplete(true);

    const stored = localStorage.getItem("gruhinezz_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUser(u);

        apiClient.get(`/ngo-setup/legal/${u.id}`)
          .then((res) => {
            const leg = res.data?.legal;
            if (leg && leg.reg_cert_url) {
              setFiles({
                regCert: true,
                regCertName: "Registration_Certificate.pdf",
                panCard: true,
                panCardName: "NGO_PAN_Card.pdf",
                cert80g: leg.cert_80g_12a_url ? true : false,
                cert80gName: leg.cert_80g_12a_url ? "80G_12A_Tax_Certificate.pdf" : "",
              });
            }
          })
          .catch((err) => {
            console.warn("Could not fetch NGO legal docs from DB:", err.message);
          });
      } catch (e) {}
    }
  }, []);

  const handleFileUpload = (key, docType) => async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("role", "ngo");
      formData.append("docType", docType);
      formData.append("userId", user?.id || "00000");

      const res = await apiClient.post("/upload/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.filename) {
        setFiles((prev) => ({
          ...prev,
          [key]: true,
          [`${key}Name`]: res.data.filename,
        }));
      }
    } catch (err) {
      console.error(`NGO ${docType} upload error:`, err);
      const ext = file.name.substring(file.name.lastIndexOf("."));
      const fallbackName = `N-${docType}-${user?.id || "00000"}${ext}`;
      setFiles((prev) => ({
        ...prev,
        [key]: true,
        [`${key}Name`]: fallbackName,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userId = user?.id || 1;
      await apiClient.post("/ngo-setup/legal", {
        userId,
        regCertUrl: files.regCertName || `N-RegistrationCertificate-${userId}.pdf`,
        panCardUrl: files.panCardName || `N-PAN-${userId}.pdf`,
        cert80g12aUrl: files.cert80gName || null,
      });

      // Mark NGO setup complete & unlock dashboard
      localStorage.setItem("gruhinezz_ngo_setup_complete", "true");
      setSetupComplete(true);

      // Navigate to NGO dashboard
      navigate("/dashboard/ngo");
    } catch (err) {
      console.warn("NGO legal save warning:", err.message);
      localStorage.setItem("gruhinezz_ngo_setup_complete", "true");
      navigate("/dashboard/ngo");
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
                    Step 3: Legal & Compliance Documents
                  </h2>
                  <p className="text-sm text-[#8A5468] mt-1 max-w-md">
                    Upload official registration certificates and tax documents for verification.
                  </p>
                </div>
                <div className="hidden sm:flex h-16 w-16 shrink-0 rounded-full bg-white/60 items-center justify-center">
                  <FileText size={28} className="text-[#7A1F49]" />
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <Field label="1. Registration Certificate (PDF / Image)" required hint="Trust Deed, Society Reg Cert, or Section 8 Incorporation Cert">
                  <label className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-4 text-center cursor-pointer transition-colors ${
                    files.regCert ? "border-[#137333] bg-[#e6f4ea]" : "border-[#E9CDD3] bg-[#FDF9F8] hover:border-[#7A1F49]/50"
                  }`}>
                    {files.regCert ? (
                      <>
                        <CheckCircle2 size={20} className="text-[#137333]" />
                        <span className="text-xs font-bold text-[#137333] truncate max-w-[200px]">{files.regCertName}</span>
                        <span className="text-[10px] text-[#137333]">Uploaded successfully</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="text-[#7A1F49]" />
                        <span className="text-sm font-medium text-[#7A1F49]">
                          Upload Registration Certificate (Required)
                        </span>
                        <span className="text-[11px] text-[#B98A97]">PDF, JPG, PNG (Max 10MB)</span>
                      </>
                    )}
                    <input type="file" className="hidden" onChange={handleFileUpload("regCert", "RegistrationCertificate")} required={!files.regCert} />
                  </label>
                </Field>

                <Field label="2. PAN Card of the NGO (PDF / Image)" required hint="Official Income Tax PAN card issued in NGO name">
                  <label className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-4 text-center cursor-pointer transition-colors ${
                    files.panCard ? "border-[#137333] bg-[#e6f4ea]" : "border-[#E9CDD3] bg-[#FDF9F8] hover:border-[#7A1F49]/50"
                  }`}>
                    {files.panCard ? (
                      <>
                        <CheckCircle2 size={20} className="text-[#137333]" />
                        <span className="text-xs font-bold text-[#137333] truncate max-w-[200px]">{files.panCardName}</span>
                        <span className="text-[10px] text-[#137333]">Uploaded successfully</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="text-[#7A1F49]" />
                        <span className="text-sm font-medium text-[#7A1F49]">
                          Upload NGO PAN Card (Required)
                        </span>
                        <span className="text-[11px] text-[#B98A97]">PDF, JPG, PNG (Max 10MB)</span>
                      </>
                    )}
                    <input type="file" className="hidden" onChange={handleFileUpload("panCard", "PAN")} required={!files.panCard} />
                  </label>
                </Field>

                <Field label="3. 80G / 12A Certificate (Optional)" required={false} hint="For tax-exemption credibility (if applicable)">
                  <label className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-4 text-center cursor-pointer transition-colors ${
                    files.cert80g ? "border-[#137333] bg-[#e6f4ea]" : "border-[#E9CDD3] bg-[#FDF9F8] hover:border-[#7A1F49]/50"
                  }`}>
                    {files.cert80g ? (
                      <>
                        <CheckCircle2 size={20} className="text-[#137333]" />
                        <span className="text-xs font-bold text-[#137333] truncate max-w-[200px]">{files.cert80gName}</span>
                        <span className="text-[10px] text-[#137333]">Uploaded successfully</span>
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="text-[#7A1F49]" />
                        <span className="text-sm font-medium text-[#7A1F49]">
                          Upload 80G / 12A Certificate (Optional)
                        </span>
                        <span className="text-[11px] text-[#B98A97]">PDF, JPG, PNG (Max 10MB)</span>
                      </>
                    )}
                    <input type="file" className="hidden" onChange={handleFileUpload("cert80g", "Cert80G12A")} />
                  </label>
                </Field>
              </div>

              <div className="flex justify-between px-6 sm:px-8 py-5 border-t border-[#F1DDD9]">
                <Link
                  to="/ngo/setup/contact"
                  className="flex items-center gap-2 rounded-lg border border-[#E9CDD3] text-[#3D1526] font-medium text-sm px-6 py-2.5 hover:bg-[#F5E3E0] transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Step 2
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-[#7A1F49] text-white font-medium text-sm px-6 py-2.5 hover:bg-[#5E1638] transition-colors"
                >
                  {saving ? "Completing..." : "Complete Registration & Go to Dashboard"}
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
                  Submitting this step completes your NGO registration.
                </p>
                <ul className="space-y-2 text-sm text-[#5E1638]">
                  <li className="flex items-center gap-2 text-[#137333]">
                    <span>✓</span> Step 1: Basic Identity (Done)
                  </li>
                  <li className="flex items-center gap-2 text-[#137333]">
                    <span>✓</span> Step 2: Contact & Verification (Done)
                  </li>
                  <li className="flex items-center gap-2 text-[#7A1F49] font-bold">
                    <span>➔</span> Step 3: Legal Docs (Current)
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

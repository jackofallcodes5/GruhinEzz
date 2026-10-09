import { useState } from "react";

export default function NgoSettingsView() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold font-serif text-[#48154c]">NGO Settings</h2>
      <p className="mt-2 text-[#7a6070] text-sm">Update your basic NGO details.</p>

      <form onSubmit={handleSave} className="mt-6 bg-white p-6 rounded-2xl border border-[#e2d3c8] shadow-xs space-y-4 max-w-xl">
        <div>
          <label className="block text-xs font-bold text-[#7a6070] mb-1">Organization Contact Phone</label>
          <input className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm" placeholder="+91" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#7a6070] mb-1">Public Address</label>
          <textarea className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm h-20" placeholder="Main office address" />
        </div>
        <button type="submit" className="px-5 py-2 bg-[#48154c] text-white text-sm font-bold rounded-xl transition-colors hover:bg-[#6b2370]">
          {saved ? "Saved!" : "Update Details"}
        </button>
      </form>
    </div>
  );
}

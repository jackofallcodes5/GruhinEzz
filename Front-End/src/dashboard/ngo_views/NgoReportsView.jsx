export default function NgoReportsView() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold font-serif text-[#48154c]">Impact Reports</h2>
      <p className="mt-2 text-[#7a6070] text-sm">Basic analysis and attendance records of all your past events.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e2d3c8] shadow-xs">
          <p className="text-xs text-[#7a6070] font-bold uppercase">Total Events Hosted</p>
          <p className="text-3xl font-bold text-[#48154c] mt-2">0</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#e2d3c8] shadow-xs">
          <p className="text-xs text-[#7a6070] font-bold uppercase">Total Seller Attendees</p>
          <p className="text-3xl font-bold text-pink-700 mt-2">0</p>
        </div>
      </div>
      
      <div className="mt-6 bg-white p-6 rounded-2xl border border-[#e2d3c8] shadow-xs text-center">
        <p className="text-sm text-[#7a6070]">Detailed charts will appear here after you host your first event.</p>
      </div>
    </div>
  );
}

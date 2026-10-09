export default function NgoPartnershipsView() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold font-serif text-[#48154c]">Partnerships & Collaborations</h2>
      <p className="mt-2 text-[#7a6070] text-sm">Here you will see all the events and initiatives you have organized with other NGOs.</p>
      
      <div className="mt-6 bg-white p-6 rounded-2xl border border-[#e2d3c8] shadow-xs text-center">
        <span className="text-4xl">🤝</span>
        <h3 className="mt-4 font-bold text-[#2d2130]">No Active Partnerships</h3>
        <p className="text-sm text-[#7a6070] mt-1">Connect with other NGOs to co-host events.</p>
        <button className="mt-4 px-5 py-2 bg-[#48154c] text-white text-sm font-bold rounded-xl">Explore Partner NGOs</button>
      </div>
    </div>
  );
}

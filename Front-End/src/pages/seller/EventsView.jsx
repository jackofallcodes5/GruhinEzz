import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import { Calendar, Clock } from "lucide-react";

export default function EventsView() {
  const [discoverable, setDiscoverable] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [discoRes, regRes] = await Promise.all([
        apiClient.get("/empowerment/seller/discover"),
        apiClient.get("/empowerment/seller/registrations")
      ]);
      setDiscoverable(discoRes.data.programs || []);
      setMyRegistrations(regRes.data.registrations || []);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      await apiClient.post(`/empowerment/seller/${eventId}/register`, {
        application_answers: { why_join: "Eager to learn and grow my business." }
      });
      alert("Successfully registered for the event!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register.");
    }
  };

  if (loading) return <div className="p-6">Loading events...</div>;

  return (
    <div className="space-y-8">
      {/* My Registrations Section */}
      <div>
        <h2 className="text-xl font-bold font-serif text-[#48154c]">My Event Registrations</h2>
        <div className="mt-4 space-y-4">
          {myRegistrations.length === 0 ? (
            <p className="text-[#7a6070] text-sm">You haven't registered for any events yet.</p>
          ) : (
            myRegistrations.map(reg => (
              <div key={reg.id} className="bg-white p-5 rounded-2xl border border-[#e2d3c8] shadow-xs flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#2d2130]">{reg.title}</h3>
                  <p className="text-xs text-[#7a6070]">Organized by: {reg.ngo_name}</p>
                  <p className="text-sm mt-1">Status: <span className="font-bold text-purple-700">{reg.status}</span></p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Discover Events Section */}
      <div>
        <h2 className="text-xl font-bold font-serif text-[#48154c]">Discover NGO Events</h2>
        <p className="text-sm text-[#7a6070] mt-1 mb-4">Find skill-building events, financial literacy workshops, and more.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discoverable.length === 0 ? (
            <p className="text-[#7a6070] text-sm">No new events available right now.</p>
          ) : (
            discoverable.map(ev => {
              // Check if already registered
              const isRegistered = myRegistrations.some(r => r.program_id === ev.id);
              
              return (
                <div key={ev.id} className="bg-white p-5 rounded-2xl border border-[#e2d3c8] shadow-xs flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[#2d2130]">{ev.title}</h3>
                    <p className="text-xs text-[#7a6070] font-semibold">{ev.category} • by {ev.ngo_name}</p>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-[#7a6070]">
                      {ev.start_at && <p className="flex items-center gap-1"><Calendar size={12} /> Starts: <span className="font-semibold">{new Date(ev.start_at).toLocaleDateString()}</span></p>}
                      {ev.registration_deadline && <p className="flex items-center gap-1"><Clock size={12} /> Deadline: <span className="font-semibold text-amber-700">{new Date(ev.registration_deadline).toLocaleDateString()}</span></p>}
                    </div>
                    <p className="text-sm mt-2 mb-4 line-clamp-3">{ev.summary}</p>
                  </div>
                  <button 
                    onClick={() => handleRegister(ev.id)}
                    disabled={isRegistered}
                    className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${
                      isRegistered 
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                        : "bg-[#48154c] text-white hover:bg-[#6b2370]"
                    }`}
                  >
                    {isRegistered ? "Already Registered" : "Register Now"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

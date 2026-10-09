import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";

export default function NgoProgramsView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    category: "Skill Training", 
    summary: "",
    description: "",
    delivery_mode: "Online",
    capacity: "",
    approval_mode: "Automatic",
    start_at: "",
    registration_deadline: ""
  });
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [registrations, setRegistrations] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await apiClient.get("/empowerment/ngo/mine");
      if (res.data?.success) {
        setEvents(res.data.programs || []);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/empowerment/ngo", formData);
      setCreating(false);
      setFormData({ 
        title: "", 
        category: "Skill Training", 
        summary: "",
        description: "",
        delivery_mode: "Online",
        capacity: "",
        approval_mode: "Automatic",
        start_at: "",
        registration_deadline: ""
      });
      fetchEvents();
    } catch (err) {
      alert("Failed to create event");
    }
  };

  const handlePublish = async (id) => {
    try {
      await apiClient.post(`/empowerment/ngo/${id}/publish`);
      fetchEvents();
    } catch (err) {
      alert("Failed to publish event");
    }
  };

  const loadRegistrations = async (eventId) => {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
      return;
    }
    try {
      const res = await apiClient.get(`/empowerment/ngo/${eventId}/registrations`);
      setRegistrations(res.data.registrations || []);
      setExpandedEventId(eventId);
    } catch (err) {
      console.error("Failed to load registrations", err);
    }
  };

  if (loading) return <div className="p-6">Loading events...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-serif text-[#48154c]">My Events</h2>
        <button 
          onClick={() => setCreating(!creating)}
          className="px-4 py-2 bg-[#48154c] text-white text-xs font-bold rounded-xl shadow-xs"
        >
          {creating ? "Cancel" : "Launch New Event"}
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl border border-[#e2d3c8] shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#7a6070] mb-1">Event Title</label>
            <input 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm" 
              placeholder="E.g., Pickle Making Workshop" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#7a6070] mb-1">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm"
            >
              <option>Skill Training</option>
              <option>Digital Literacy</option>
              <option>Financial Literacy</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#7a6070] mb-1">Summary</label>
            <textarea 
              required
              value={formData.summary} 
              onChange={e => setFormData({...formData, summary: e.target.value})}
              className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm h-24" 
              placeholder="Brief description of the event..." 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#7a6070] mb-1">Detailed Description</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm h-24" 
                placeholder="Full details, learning objectives..." 
              />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7a6070] mb-1">Delivery Mode</label>
                  <select 
                    value={formData.delivery_mode}
                    onChange={e => setFormData({...formData, delivery_mode: e.target.value})}
                    className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm"
                  >
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7a6070] mb-1">Capacity</label>
                  <input 
                    type="number"
                    value={formData.capacity} 
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm" 
                    placeholder="Max participants" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7a6070] mb-1">Start Date</label>
                  <input 
                    type="date"
                    value={formData.start_at} 
                    onChange={e => setFormData({...formData, start_at: e.target.value})}
                    className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7a6070] mb-1">Reg. Deadline</label>
                  <input 
                    type="date"
                    value={formData.registration_deadline} 
                    onChange={e => setFormData({...formData, registration_deadline: e.target.value})}
                    className="w-full px-3 py-2 bg-[#f9f5f2] border border-[#e2d3c8] rounded-xl text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="px-5 py-2 bg-[#48154c] hover:bg-[#6b2370] text-white font-bold rounded-xl text-sm transition-colors">Save Event</button>
        </form>
      )}

      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-[#7a6070] text-sm">No events found. Launch your first event!</p>
        ) : (
          events.map(ev => (
            <div key={ev.id} className="bg-white p-5 rounded-2xl border border-[#e2d3c8] shadow-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-[#2d2130]">{ev.title}</h3>
                  <p className="text-xs text-[#7a6070]">{ev.category} • Status: <span className="font-semibold text-purple-700">{ev.status}</span></p>
                  <p className="text-sm mt-2">{ev.summary}</p>
                </div>
                <div className="flex gap-2">
                  {ev.status === "Draft" && (
                    <button onClick={() => handlePublish(ev.id)} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
                      Publish Event
                    </button>
                  )}
                  <button onClick={() => loadRegistrations(ev.id)} className="px-4 py-2 bg-gray-100 text-[#48154c] text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-200">
                    {expandedEventId === ev.id ? "Hide Registrations" : "View Attendees"}
                  </button>
                </div>
              </div>

              {expandedEventId === ev.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-[#2d2130] mb-3">Registered Sellers</h4>
                  {registrations.length === 0 ? (
                    <p className="text-xs text-gray-500">No sellers have registered yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {registrations.map(reg => (
                        <div key={reg.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
                          <div>
                            <p className="font-bold text-[#48154c]">{reg.seller_name}</p>
                            <p className="text-xs text-gray-500">{reg.seller_email}</p>
                          </div>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">{reg.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

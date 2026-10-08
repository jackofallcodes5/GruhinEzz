import { useState } from "react";
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  Lock,
  CheckCircle2,
  Save,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [profileData, setProfileData] = useState({
    storeName: "Sunita's Traditional Rasoi",
    ownerName: "Sunita Sharma",
    category: "Homemade Foods",
    email: "sunita.sharma@example.com",
    phone: "+91 98765 43210",
    address: "B-14, Vaishali Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302021",
    bio: "Learned this sun-dried raw mango pickle recipe from my grandmother. Every batch is naturally cured in cold-pressed mustard oil with authentic Rajasthani whole spices.",
  });

  const [bankData, setBankData] = useState({
    bankName: "State Bank of India (SBI)",
    accountHolder: "Sunita Sharma",
    accountNumber: "38920198425821",
    ifsc: "SBIN0004123",
    upiId: "sunita.rasoi@okaxis",
    autoPayout: true,
  });

  const [shippingData, setShippingData] = useState({
    shippingFee: "40",
    freeThreshold: "499",
    dispatchTime: "24-48 Hours",
    returnPolicy: "7-Day Replacement Guarantee",
    codAllowed: true,
  });

  const [notifications, setNotifications] = useState({
    orderWhatsapp: true,
    orderSms: true,
    emailInvoice: true,
    promotions: false,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    showToast("Settings and store configurations updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between shadow-md">
          <span>✓ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e2d3c8]">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#48154c] flex items-center gap-2">
            <Settings size={24} className="text-[#ae3a65]" />
            Seller Portal Settings
          </h2>
          <p className="text-xs text-[#7a6070] mt-0.5">
            Manage your store information, payout bank details, and shipping rules
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#48154c] text-white rounded-xl text-xs font-bold hover:bg-[#38103c] transition-colors flex items-center gap-2 shadow-xs"
        >
          <Save size={15} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { key: "profile", label: "Store Profile", icon: Store },
          { key: "bank", label: "Bank & Payouts", icon: CreditCard },
          { key: "shipping", label: "Shipping Rules", icon: Truck },
          { key: "notifications", label: "Alerts & Security", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-[#48154c] text-white shadow-xs"
                  : "bg-white text-[#5a4855] border border-[#e2d3c8] hover:bg-[#f5ece6]"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Store Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d3c8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f5ece6]">
            <Store size={20} className="text-[#48154c]" />
            <h3 className="font-bold text-base text-[#48154c]">
              Artisan & Store Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#48154c] mb-1">Store / Rasoi Name</label>
              <input
                type="text"
                value={profileData.storeName}
                onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Artisan Name</label>
              <input
                type="text"
                value={profileData.ownerName}
                onChange={(e) => setProfileData({ ...profileData, ownerName: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Primary Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Phone / WhatsApp</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-[#48154c] mb-1">Kitchen / Workshop Address</label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#48154c] mb-1">City</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#48154c] mb-1">State</label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#48154c] mb-1">Pincode</label>
              <input
                type="text"
                value={profileData.pincode}
                onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-[#48154c] mb-1">Artisan Story / About Your Craft</label>
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white rounded-xl text-xs font-bold hover:opacity-95"
            >
              Save Profile Details
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Bank & Payouts */}
      {activeTab === "bank" && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d3c8] shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#f5ece6]">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-[#48154c]" />
              <h3 className="font-bold text-base text-[#48154c]">
                Direct Bank & Cashfree Settlement Details
              </h3>
            </div>
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
              <ShieldCheck size={14} /> Verified KYC
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#48154c] mb-1">Bank Name</label>
              <input
                type="text"
                value={bankData.bankName}
                onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Account Holder Name</label>
              <input
                type="text"
                value={bankData.accountHolder}
                onChange={(e) => setBankData({ ...bankData, accountHolder: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Bank Account Number</label>
              <input
                type="text"
                value={bankData.accountNumber}
                onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">IFSC Code</label>
              <input
                type="text"
                value={bankData.ifsc}
                onChange={(e) => setBankData({ ...bankData, ifsc: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-[#48154c]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-[#48154c] mb-1">UPI ID for Instant Transfers</label>
            <input
              type="text"
              value={bankData.upiId}
              onChange={(e) => setBankData({ ...bankData, upiId: e.target.value })}
              className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-[#48154c]"
            />
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <p className="font-bold">Next-Day Automated Settlements (T+1)</p>
              <p className="text-[11px] text-emerald-800">
                Customer payments automatically transfer to this account every business day.
              </p>
            </div>
            <input
              type="checkbox"
              checked={bankData.autoPayout}
              onChange={(e) => setBankData({ ...bankData, autoPayout: e.target.checked })}
              className="w-4 h-4 accent-[#48154c]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white rounded-xl text-xs font-bold hover:opacity-95"
            >
              Update Bank Details
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Shipping Rules */}
      {activeTab === "shipping" && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d3c8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f5ece6]">
            <Truck size={20} className="text-[#48154c]" />
            <h3 className="font-bold text-base text-[#48154c]">
              Shipping & Delivery Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#48154c] mb-1">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                value={shippingData.shippingFee}
                onChange={(e) => setShippingData({ ...shippingData, shippingFee: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Free Delivery Order Threshold (₹)</label>
              <input
                type="number"
                value={shippingData.freeThreshold}
                onChange={(e) => setShippingData({ ...shippingData, freeThreshold: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Estimated Dispatch Time</label>
              <input
                type="text"
                value={shippingData.dispatchTime}
                onChange={(e) => setShippingData({ ...shippingData, dispatchTime: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#48154c] mb-1">Return / Replacement Policy</label>
              <input
                type="text"
                value={shippingData.returnPolicy}
                onChange={(e) => setShippingData({ ...shippingData, returnPolicy: e.target.value })}
                className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-[#48154c]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white rounded-xl text-xs font-bold hover:opacity-95"
            >
              Update Shipping Rules
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Alerts & Security */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2d3c8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#f5ece6]">
            <Bell size={20} className="text-[#48154c]" />
            <h3 className="font-bold text-base text-[#48154c]">
              Notification Channels & Security
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-[#f5ece6] rounded-2xl cursor-pointer">
              <div>
                <span className="font-bold text-[#48154c] block">WhatsApp Instant Order Alerts</span>
                <span className="text-[#7a6070] text-[11px]">Receive an instant WhatsApp message when a buyer places an order</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderWhatsapp}
                onChange={(e) => setNotifications({ ...notifications, orderWhatsapp: e.target.checked })}
                className="w-4 h-4 accent-[#48154c]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#f5ece6] rounded-2xl cursor-pointer">
              <div>
                <span className="font-bold text-[#48154c] block">SMS Dispatch Alerts</span>
                <span className="text-[#7a6070] text-[11px]">Get SMS notification whenever a package is picked up or delivered</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.orderSms}
                onChange={(e) => setNotifications({ ...notifications, orderSms: e.target.checked })}
                className="w-4 h-4 accent-[#48154c]"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#f5ece6] rounded-2xl cursor-pointer">
              <div>
                <span className="font-bold text-[#48154c] block">Email Invoices & Financial Reports</span>
                <span className="text-[#7a6070] text-[11px]">Receive monthly revenue statements and settlement PDFs via email</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.emailInvoice}
                onChange={(e) => setNotifications({ ...notifications, emailInvoice: e.target.checked })}
                className="w-4 h-4 accent-[#48154c]"
              />
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white rounded-xl text-xs font-bold hover:opacity-95"
            >
              Save Alert Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

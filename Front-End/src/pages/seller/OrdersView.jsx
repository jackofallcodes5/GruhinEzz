import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  User,
  MapPin,
  Phone,
  Calendar,
  X,
  Printer,
  ChevronRight,
  Loader2,
} from "lucide-react";

export default function OrdersView() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch orders from the backend on mount
  useEffect(() => {
    apiClient.get("/seller/orders")
      .then(({ data }) => {
        // Normalise DB rows into the shape the UI expects
        const normalised = data.orders.map((o) => ({
          id: o.cf_order_id,
          date: new Date(o.created_at).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          }),
          customer: {
            name: o.customer_name,
            phone: o.customer_phone,
            email: o.customer_email,
            address: o.shipping_address,
            city: o.shipping_city,
            state: o.shipping_state,
            pincode: o.shipping_pincode,
          },
          product: {
            id: o.id,
            name: o.product_title,
            image: o.product_image_url,
            variant: o.product_variant,
            quantity: o.quantity,
            unitPrice: parseFloat(o.unit_price),
            totalAmount: parseFloat(o.order_amount),
          },
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          orderStatus: o.fulfillment_status,
          trackingNumber: o.tracking_number,
        }));
        setOrders(normalised);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        showToast("Failed to load orders from server.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === "All" || o.orderStatus === activeTab;
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Update order fulfillment status (local + backend)
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await apiClient.patch("/seller/orders/status", {
        cfOrderId: orderId,
        fulfillmentStatus: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      showToast(`Order ${orderId} marked as ${newStatus}!`);
    } catch (err) {
      console.error("Failed to update order status:", err);
      showToast("Failed to update order status.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-[#7a6070]">
          <Loader2 size={28} className="animate-spin mr-2" />
          <span className="text-sm font-medium">Loading orders...</span>
        </div>
      )}
      {!loading && (<>
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
            <ShoppingBag size={24} className="text-[#ae3a65]" />
            Customer Orders & Fulfillment
          </h2>
          <p className="text-xs text-[#7a6070] mt-0.5">
            Track buyer purchases, update shipping tracking, and generate packing slips
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#48154c] bg-[#f5ece6] px-3.5 py-2 rounded-xl border border-[#e2d3c8]">
          <span>Cashfree Automated Tracking Active</span>
          <CheckCircle2 size={15} className="text-emerald-600" />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Total Orders
          </p>
          <p className="text-2xl font-bold text-[#48154c] mt-1">{orders.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            In Processing
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {orders.filter((o) => o.orderStatus === "Processing").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Dispatched / Shipped
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {orders.filter((o) => o.orderStatus === "Shipped").length}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs">
          <p className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Fulfilled & Delivered
          </p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {orders.filter((o) => o.orderStatus === "Delivered").length}
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#e2d3c8] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
          {["All", "Processing", "Shipped", "Delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#48154c] text-white"
                  : "bg-[#f5ece6] text-[#2d2130] hover:bg-[#e2d3c8]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-3 text-[#7a6070]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, buyer or craft..."
            className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-[#48154c]"
          />
        </div>
      </div>

      {/* Orders List Cards */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-[#e2d3c8] p-5 sm:p-6 shadow-xs hover:border-[#ae3a65] transition-colors"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#f5ece6]">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-[#48154c]">
                    {ord.id}
                  </span>
                  <span className="text-xs text-[#7a6070] flex items-center gap-1">
                    <Calendar size={13} /> {ord.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {ord.paymentStatus} • {ord.paymentMethod}
                  </span>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      ord.orderStatus === "Delivered"
                        ? "bg-emerald-600 text-white"
                        : ord.orderStatus === "Shipped"
                        ? "bg-blue-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Body Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Product Detail */}
                <div className="md:col-span-6 flex items-start gap-3.5">
                  <img
                    src={ord.product.image}
                    alt={ord.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-[#f5ece6] border border-[#e2d3c8] shrink-0"
                  />
                  <div>
                    <Link
                      to={`/product/${ord.product.id}`}
                      className="font-bold text-sm sm:text-base text-[#2d2130] hover:text-[#48154c] transition-colors line-clamp-1"
                    >
                      {ord.product.name}
                    </Link>
                    <p className="text-xs text-[#7a6070] mt-0.5">
                      {ord.product.variant}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-xs text-[#7a6070]">
                        Qty: <strong>{ord.product.quantity}</strong>
                      </span>
                      <span className="text-xs text-[#7a6070]">•</span>
                      <span className="text-sm font-extrabold text-[#48154c]">
                        Total: ₹{ord.product.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer & Delivery Details */}
                <div className="md:col-span-4 bg-[#f5ece6]/60 p-3.5 rounded-2xl border border-[#e2d3c8] text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#48154c]">
                    <User size={13} /> {ord.customer.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-[#5a4855]">
                    <Phone size={13} /> {ord.customer.phone}
                  </div>
                  <div className="flex items-start gap-1.5 text-[#5a4855] pt-0.5">
                    <MapPin size={13} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {ord.customer.address}, {ord.customer.city}, {ord.customer.state} - {ord.customer.pincode}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex flex-col gap-2">
                  {ord.orderStatus === "Processing" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "Shipped")}
                      className="w-full py-2 bg-[#48154c] text-white rounded-xl text-xs font-bold hover:bg-[#38103c] transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <Truck size={14} />
                      <span>Ship Order</span>
                    </button>
                  )}

                  {ord.orderStatus === "Shipped" && (
                    <button
                      onClick={() => handleUpdateStatus(ord.id, "Delivered")}
                      className="w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedInvoiceOrder(ord)}
                    className="w-full py-2 border border-[#e2d3c8] bg-white text-[#48154c] rounded-xl text-xs font-semibold hover:bg-[#f5ece6] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText size={14} />
                    <span>Packing Slip</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-[#e2d3c8] text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#f5ece6] text-[#48154c] flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
            <h3 className="font-bold text-base text-[#48154c] mb-1">
              No orders found
            </h3>
            <p className="text-xs text-[#7a6070]">
              There are no orders matching this filter right now.
            </p>
          </div>
        )}
      </div>

      {/* ── Packing Slip / Invoice Modal ── */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e2d3c8] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-5 right-5 text-[#7a6070] hover:text-[#48154c]"
            >
              <X size={20} />
            </button>

            {/* Printable Packing Slip */}
            <div className="border-b-2 border-[#48154c] pb-4 mb-4 flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-xl text-[#48154c]">
                  GruhinEzz Dispatch Slip
                </h3>
                <p className="text-[11px] text-[#7a6070]">
                  Women Entrepreneurs Direct Marketplace
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-mono font-bold text-[#48154c]">
                  {selectedInvoiceOrder.id}
                </p>
                <p className="text-[#7a6070]">{selectedInvoiceOrder.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div className="bg-[#f5ece6]/60 p-3 rounded-xl border border-[#e2d3c8]">
                <p className="font-bold text-[#48154c] uppercase mb-1 text-[10px]">
                  Ship To (Buyer)
                </p>
                <p className="font-semibold text-[#2d2130]">
                  {selectedInvoiceOrder.customer.name}
                </p>
                <p className="text-[#5a4855]">
                  {selectedInvoiceOrder.customer.address}
                </p>
                <p className="text-[#5a4855]">
                  {selectedInvoiceOrder.customer.city},{" "}
                  {selectedInvoiceOrder.customer.state} -{" "}
                  {selectedInvoiceOrder.customer.pincode}
                </p>
                <p className="text-[#5a4855] font-mono mt-1">
                  📞 {selectedInvoiceOrder.customer.phone}
                </p>
              </div>

              <div className="bg-[#f5ece6]/60 p-3 rounded-xl border border-[#e2d3c8]">
                <p className="font-bold text-[#48154c] uppercase mb-1 text-[10px]">
                  Dispatched By (Artisan)
                </p>
                <p className="font-semibold text-[#2d2130]">
                  Sunita's Traditional Rasoi
                </p>
                <p className="text-[#5a4855]">Jaipur, Rajasthan, India</p>
                <p className="text-emerald-800 font-semibold mt-1">
                  ✓ Verified Woman Entrepreneur
                </p>
                <p className="text-[#7a6070] font-mono text-[10px] mt-1">
                  AWB: {selectedInvoiceOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs mb-6">
              <thead className="bg-[#f5ece6] text-[#48154c] font-bold border-b border-[#e2d3c8]">
                <tr>
                  <th className="py-2 px-3">Craft Item</th>
                  <th className="py-2 px-3 text-center">Qty</th>
                  <th className="py-2 px-3 text-right">Price</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5ece6]">
                <tr>
                  <td className="py-3 px-3 font-semibold text-[#2d2130]">
                    {selectedInvoiceOrder.product.name}
                    <span className="block font-normal text-[10px] text-[#7a6070]">
                      {selectedInvoiceOrder.product.variant}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold">
                    {selectedInvoiceOrder.product.quantity}
                  </td>
                  <td className="py-3 px-3 text-right">
                    ₹{selectedInvoiceOrder.product.unitPrice}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#48154c]">
                    ₹{selectedInvoiceOrder.product.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-center text-xs p-3 bg-emerald-50 rounded-xl border border-emerald-200 mb-6">
              <span className="font-bold text-emerald-900">
                Payment Status: {selectedInvoiceOrder.paymentStatus} via {selectedInvoiceOrder.paymentMethod}
              </span>
              <span className="text-base font-extrabold text-[#48154c]">
                ₹{selectedInvoiceOrder.product.totalAmount}
              </span>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 border border-[#e2d3c8] text-xs font-semibold rounded-xl text-[#7a6070]"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#48154c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Printer size={14} /> Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}
      </>)}
    </div>
  );
}

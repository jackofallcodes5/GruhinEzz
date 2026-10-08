import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  Download,
  X,
  Zap,
} from "lucide-react";

export default function EarningsView() {
  const [availableBalance, setAvailableBalance] = useState(14850);
  const totalRevenue = 28450;
  const [withdrawnAmount, setWithdrawnAmount] = useState(9400);

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [withdrawInput, setWithdrawInput] = useState("5000");
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [transactions, setTransactions] = useState([
    {
      id: "TXN-CF-90812",
      date: "08 Oct 2026, 12:45 PM",
      desc: "Order CF-ORD-98421 (Organic Mango Pickle x2)",
      type: "CREDIT",
      amount: 498,
      status: "Settled",
    },
    {
      id: "TXN-CF-90760",
      date: "07 Oct 2026, 05:00 PM",
      desc: "Order CF-ORD-98390 (Silk Chanderi Dupatta)",
      type: "CREDIT",
      amount: 899,
      status: "Settled",
    },
    {
      id: "TXN-WD-90411",
      date: "04 Oct 2026, 10:30 AM",
      desc: "Bank Transfer to SBI (A/C ••5821)",
      type: "PAYOUT",
      amount: 5000,
      status: "Settled",
    },
    {
      id: "TXN-CF-90219",
      date: "03 Oct 2026, 03:15 PM",
      desc: "Order CF-ORD-98011 (Terracotta Tea Set)",
      type: "CREDIT",
      amount: 650,
      status: "Settled",
    },
    {
      id: "TXN-WD-89940",
      date: "28 Sep 2026, 11:00 AM",
      desc: "Bank Transfer to SBI (A/C ••5821)",
      type: "PAYOUT",
      amount: 4400,
      status: "Settled",
    },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWithdrawal = (e) => {
    e.preventDefault();
    const amount = Number(withdrawInput);
    if (!amount || amount <= 0) return;
    if (amount > availableBalance) {
      alert("Withdrawal amount cannot exceed available balance.");
      return;
    }

    setProcessingWithdrawal(true);
    setTimeout(() => {
      setAvailableBalance((prev) => prev - amount);
      setWithdrawnAmount((prev) => prev + amount);

      const newTxn = {
        id: `TXN-WD-${Date.now().toString().slice(-5)}`,
        date: "Just now",
        desc: "Instant Cashfree Payout to SBI (A/C ••5821)",
        type: "PAYOUT",
        amount: amount,
        status: "Settled",
      };

      setTransactions((prev) => [newTxn, ...prev]);
      setProcessingWithdrawal(false);
      setPayoutModalOpen(false);
      showToast(`Transferred ₹${amount} directly to your verified bank account!`);
    }, 1200);
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
            <DollarSign size={24} className="text-[#ae3a65]" />
            Earnings & Cashfree Payouts
          </h2>
          <p className="text-xs text-[#7a6070] mt-0.5">
            Real-time balance, automated bank transfers, and transaction ledger
          </p>
        </div>

        <button
          onClick={() => setPayoutModalOpen(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white rounded-xl text-xs font-bold hover:opacity-95 transition-opacity flex items-center gap-2 shadow-sm"
        >
          <Zap size={15} />
          <span>Withdraw to Bank</span>
        </button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-[#48154c] to-[#6b2370] text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
            Available for Payout
          </span>
          <p className="text-3xl font-extrabold mt-1">₹{availableBalance.toLocaleString()}</p>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-300">
            <CheckCircle2 size={13} /> Ready for instant transfer
          </div>
        </div>

        {/* Total Lifetime Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-[#e2d3c8] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Total Craft Revenue
          </span>
          <p className="text-3xl font-extrabold text-[#2d2130] mt-1">
            ₹{totalRevenue.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-700 font-semibold">
            <TrendingUp size={14} /> 100% Direct artisan profit
          </div>
        </div>

        {/* Total Transferred */}
        <div className="bg-white rounded-3xl p-5 border border-[#e2d3c8] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Withdrawn to Bank
          </span>
          <p className="text-3xl font-extrabold text-[#ae3a65] mt-1">
            ₹{withdrawnAmount.toLocaleString()}
          </p>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#7a6070]">
            <Clock size={13} /> Settled into SBI Bank A/C
          </div>
        </div>

        {/* Platform Fee */}
        <div className="bg-white rounded-3xl p-5 border border-[#e2d3c8] shadow-2xs">
          <span className="text-[11px] font-semibold text-[#7a6070] uppercase tracking-wider">
            Platform Commission
          </span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-1">0% (FREE)</p>
          <div className="mt-3 flex items-center gap-1 text-xs text-[#7a6070]">
            <Sparkles size={13} className="text-[#ae3a65]" /> Women empowerment policy
          </div>
        </div>
      </div>

      {/* Linked Bank Account Card & Cashfree Status */}
      <div className="bg-white rounded-3xl p-6 border border-[#e2d3c8] shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#f5ece6]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#f5ece6] rounded-2xl text-[#48154c]">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#48154c]">
                Verified Bank Account (Cashfree PG Connected)
              </h3>
              <p className="text-xs text-[#7a6070]">
                All buyer payments are routed directly to this account
              </p>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 size={13} /> Active Cashfree Vendor
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-5 text-xs">
          <div>
            <p className="text-[#7a6070]">Bank Name</p>
            <p className="font-bold text-sm text-[#2d2130] mt-0.5">State Bank of India (SBI)</p>
          </div>

          <div>
            <p className="text-[#7a6070]">Account Holder</p>
            <p className="font-bold text-sm text-[#2d2130] mt-0.5">Sunita Sharma</p>
          </div>

          <div>
            <p className="text-[#7a6070]">Account Number</p>
            <p className="font-mono font-bold text-sm text-[#2d2130] mt-0.5">•••• •••• •••• 5821</p>
          </div>

          <div>
            <p className="text-[#7a6070]">IFSC Code</p>
            <p className="font-mono font-bold text-sm text-[#2d2130] mt-0.5">SBIN0004123</p>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-[#e2d3c8] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#f5ece6] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-[#48154c]">
              Payout & Order Settlements History
            </h3>
            <p className="text-xs text-[#7a6070]">
              Audited logs of customer credits and vendor bank transfers
            </p>
          </div>
          <button
            onClick={() => showToast("Exported transactions CSV successfully.")}
            className="flex items-center gap-1 text-xs text-[#48154c] font-semibold border border-[#e2d3c8] px-3 py-1.5 rounded-xl hover:bg-[#f5ece6]"
          >
            <Download size={13} /> Export Ledger
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2d2130]">
            <thead className="bg-[#f5ece6] text-[#48154c] uppercase font-bold text-[10px] tracking-wider border-b border-[#e2d3c8]">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5ece6]">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#fcf9f7] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#48154c]">
                    {txn.id}
                  </td>
                  <td className="py-3.5 px-4 text-[#7a6070]">{txn.date}</td>
                  <td className="py-3.5 px-4 font-medium">{txn.desc}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        txn.type === "CREDIT"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-purple-100 text-[#48154c]"
                      }`}
                    >
                      {txn.type === "CREDIT" ? (
                        <>
                          <ArrowDownLeft size={11} /> Customer Sale
                        </>
                      ) : (
                        <>
                          <ArrowUpRight size={11} /> Bank Payout
                        </>
                      )}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-extrabold text-sm ${
                      txn.type === "CREDIT" ? "text-emerald-700" : "text-[#48154c]"
                    }`}
                  >
                    {txn.type === "CREDIT" ? `+₹${txn.amount}` : `-₹${txn.amount}`}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {txn.status} ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Withdraw Modal ── */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2d3c8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f5ece6] mb-4">
              <h3 className="font-bold text-lg text-[#48154c]">
                Instant Bank Payout
              </h3>
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="text-[#7a6070] hover:text-[#48154c]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-4 text-xs">
              <div className="p-3 bg-[#f5ece6] rounded-2xl flex justify-between items-center">
                <span className="text-[#7a6070]">Available Balance:</span>
                <span className="font-extrabold text-base text-[#48154c]">
                  ₹{availableBalance.toLocaleString()}
                </span>
              </div>

              <div>
                <label className="block font-bold text-[#48154c] mb-1">
                  Transfer Amount (₹) *
                </label>
                <input
                  type="number"
                  min="100"
                  max={availableBalance}
                  required
                  value={withdrawInput}
                  onChange={(e) => setWithdrawInput(e.target.value)}
                  className="w-full bg-[#f5ece6] border border-[#e2d3c8] rounded-xl px-3 py-2.5 text-base font-bold text-[#2d2130] focus:outline-[#48154c]"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[#2d2130]">
                <p className="font-bold text-[11px] text-emerald-900 mb-0.5">
                  Destination: State Bank of India (••5821)
                </p>
                <p className="text-[10px] text-emerald-800">
                  Transfer is processed instantly with zero deduction fee.
                </p>
              </div>

              <button
                type="submit"
                disabled={processingWithdrawal || availableBalance <= 0}
                className="w-full py-3.5 bg-gradient-to-r from-[#48154c] to-[#ae3a65] text-white font-bold rounded-2xl shadow-md hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                {processingWithdrawal ? (
                  <span>Processing Transfer...</span>
                ) : (
                  <>
                    <span>Confirm Bank Transfer (₹{withdrawInput})</span>
                    <Zap size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

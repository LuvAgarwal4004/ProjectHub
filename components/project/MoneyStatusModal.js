"use client";

import { useState } from "react";
import { X, DollarSign, Wallet, CheckCircle2, CreditCard, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function MoneyStatusModal({
  project,
  moneyStatus = null,
  onClose,
  onSaved,
}) {
  const [currency, setCurrency] = useState(moneyStatus?.currency || "$");
  const [prizeMoney, setPrizeMoney] = useState(moneyStatus?.prizeMoney ?? 0);
  const [receivedAmount, setReceivedAmount] = useState(
    moneyStatus?.receivedAmount ?? 0
  );
  const [payoutStatus, setPayoutStatus] = useState(
    moneyStatus?.payoutStatus || "pending"
  );
  const [payoutMethod, setPayoutMethod] = useState(
    moneyStatus?.payoutMethod || ""
  );
  const [notes, setNotes] = useState(moneyStatus?.notes || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${project._id}/other-info`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moneyStatus: {
            currency,
            prizeMoney: Number(prizeMoney || 0),
            receivedAmount: Number(receivedAmount || 0),
            payoutStatus,
            payoutMethod: payoutMethod.trim(),
            notes: notes.trim(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update financial status");
      }

      toast.success("Money status updated successfully");
      onSaved(data.moneyStatus);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                Update Money Status
              </h2>
              <p className="text-xs text-slate-500">
                Manage prize money, received funds, and disbursement status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="CAD$">CAD$</option>
                <option value="AUD$">AUD$</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                <DollarSign size={13} className="text-amber-500" />
                Prize / Grant Money
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="5000"
                value={prizeMoney}
                onChange={(e) => setPrizeMoney(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                <CheckCircle2 size={13} className="text-emerald-500" />
                Amount Received
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="2500"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Payout Status
              </label>
              <select
                value={payoutStatus}
                onChange={(e) => setPayoutStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              >
                <option value="pending">⏳ Pending</option>
                <option value="processing">⚙️ Processing</option>
                <option value="received">✅ Received (Full)</option>
                <option value="disbursed">💸 Disbursed to Team</option>
                <option value="not_applicable">🚫 Not Applicable</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <CreditCard size={14} className="text-slate-400" />
              Payout Method / Account Reference
            </label>
            <input
              type="text"
              placeholder="e.g. Bank Wire / UPI / PayPal / Stripe"
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <FileText size={14} className="text-slate-400" />
              Financial Remarks & Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 10% TDS deducted, remaining split 50/50 among team members..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Financial Status"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

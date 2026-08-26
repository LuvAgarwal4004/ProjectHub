"use client";

import { useState } from "react";
import { X, Megaphone, DollarSign, UserCheck, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function AdModal({ project, ad = null, onClose, onSaved }) {
  const isEditing = Boolean(ad);

  const [name, setName] = useState(ad?.name || "");
  const [type, setType] = useState(ad?.type || "Event Sponsor");
  const [amount, setAmount] = useState(ad?.amount ?? 0);
  const [status, setStatus] = useState(ad?.status || "confirmed");
  const [contact, setContact] = useState(ad?.contact || "");
  const [notes, setNotes] = useState(ad?.notes || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Partner / Sponsor name is required");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/projects/${project._id}/ads/${ad._id}`
        : `/api/projects/${project._id}/ads`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type: type.trim(),
          amount: Number(amount || 0),
          status,
          contact: contact.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save sponsor/ad campaign");
      }

      toast.success(
        isEditing
          ? "Sponsor/Ad deal updated"
          : "Sponsor/Ad deal added successfully"
      );
      onSaved(data.moneyStatus || data.ad);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Megaphone size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {isEditing ? "Edit Sponsor / Ad Deal" : "Add Sponsor / Ad Campaign"}
              </h2>
              <p className="text-xs text-slate-500">
                Track sponsorships, advertiser partnerships & monetized promotions
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
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Megaphone size={14} className="text-purple-600" />
              Sponsor / Ad Partner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Cloud / RedBull / Vercel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Sponsorship / Ad Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              >
                <option value="Title Sponsor">Title Sponsor</option>
                <option value="Event Sponsor">Event Sponsor</option>
                <option value="Banner Ad">Banner Ad</option>
                <option value="Platform Ad">Platform Ad</option>
                <option value="In-Kind Prize / Credits">In-Kind Prize / Credits</option>
                <option value="Custom Partnership">Custom Partnership</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-700">
                <DollarSign size={13} className="text-purple-600" />
                Deal Value / Amount
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Deal Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              >
                <option value="confirmed">✅ Confirmed</option>
                <option value="in_discussion">💬 In Discussion</option>
                <option value="pending">⏳ Pending Agreement</option>
                <option value="completed">🎉 Completed / Fulfilled</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <UserCheck size={14} className="text-slate-400" />
                Contact Person / POC
              </label>
              <input
                type="text"
                placeholder="e.g. sponsorship@aws.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <FileText size={14} className="text-slate-400" />
              Deliverables & Campaign Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Logo on PPT presentation, 1 banner placement, $500 AWS credits..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
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
              disabled={loading || !name.trim()}
              className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Sponsor / Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

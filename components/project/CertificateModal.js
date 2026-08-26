"use client";

import { useState } from "react";
import { X, Award, FileCheck, Building, Calendar, Link2, KeyRound, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function CertificateModal({
  project,
  certificate = null,
  onClose,
  onSaved,
}) {
  const isEditing = Boolean(certificate);

  const [title, setTitle] = useState(certificate?.title || "");
  const [recipient, setRecipient] = useState(certificate?.recipient || "");
  const [issuer, setIssuer] = useState(certificate?.issuer || "");
  const [issueDate, setIssueDate] = useState(certificate?.issueDate || "");
  const [url, setUrl] = useState(certificate?.url || "");
  const [credentialId, setCredentialId] = useState(certificate?.credentialId || "");
  const [notes, setNotes] = useState(certificate?.notes || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Certificate title is required");
      return;
    }

    setLoading(true);

    try {
      const targetUrl = isEditing
        ? `/api/projects/${project._id}/certificates/${certificate._id}`
        : `/api/projects/${project._id}/certificates`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(targetUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          recipient: recipient.trim(),
          issuer: issuer.trim(),
          issueDate: issueDate.trim(),
          url: url.trim(),
          credentialId: credentialId.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save certificate");
      }

      toast.success(
        isEditing
          ? "Certificate updated successfully"
          : "Certificate added to store"
      );
      onSaved(data.certificates || data.certificate);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FileCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {isEditing ? "Edit Certificate" : "Add Certificate to Store"}
              </h2>
              <p className="text-xs text-slate-500">
                Store verification links, credentials & achievement awards
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
              <Award size={14} className="text-emerald-600" />
              Certificate Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1st Place Winner - Grand Hackathon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Recipient / Team Name
              </label>
              <input
                type="text"
                placeholder="e.g. Project Team Alpha"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Building size={14} className="text-slate-400" />
                Issuing Organization / Event
              </label>
              <input
                type="text"
                placeholder="e.g. DevHouse 2026 / IEEE"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Calendar size={14} className="text-slate-400" />
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <KeyRound size={14} className="text-slate-400" />
                Credential / Certificate ID
              </label>
              <input
                type="text"
                placeholder="e.g. CERT-2026-98210"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Link2 size={14} className="text-emerald-600" />
              Certificate URL / Verification Link
            </label>
            <input
              type="text"
              placeholder="https://verify.example.com/cert/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <FileText size={14} className="text-slate-400" />
              Notes / Description
            </label>
            <textarea
              rows={2}
              placeholder="Optional notes regarding the certificate..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
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
              disabled={loading || !title.trim()}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Save Certificate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

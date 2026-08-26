"use client";

import { useState } from "react";
import { X, Award, User, Building, Mail, Globe, Star, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function JudgeModal({ project, judge = null, onClose, onSaved }) {
  const isEditing = Boolean(judge);

  const [name, setName] = useState(judge?.name || "");
  const [designation, setDesignation] = useState(judge?.designation || "");
  const [organization, setOrganization] = useState(judge?.organization || "");
  const [email, setEmail] = useState(judge?.email || "");
  const [linkedIn, setLinkedIn] = useState(judge?.linkedIn || "");
  const [score, setScore] = useState(judge?.score || "");
  const [notes, setNotes] = useState(judge?.notes || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Judge name is required");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/projects/${project._id}/judges/${judge._id}`
        : `/api/projects/${project._id}/judges`;
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          designation: designation.trim(),
          organization: organization.trim(),
          email: email.trim(),
          linkedIn: linkedIn.trim(),
          score: score.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save judge");
      }

      toast.success(isEditing ? "Judge updated successfully" : "Judge added successfully");
      onSaved(data.judges || data.judge);
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Award size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">
                {isEditing ? "Edit Judge / Evaluator" : "Add Judge / Evaluator"}
              </h2>
              <p className="text-xs text-slate-500">
                Track competition judges, mentors & feedback
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
              <User size={14} className="text-blue-600" />
              Judge Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Designation / Role
              </label>
              <input
                type="text"
                placeholder="e.g. VP of Product"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Building size={14} className="text-slate-400" />
                Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Google / MIT"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Mail size={14} className="text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="judge@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Globe size={14} className="text-slate-400" />
                LinkedIn / Profile
              </label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/..."
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Star size={14} className="text-amber-500" />
              Score / Evaluation Result
            </label>
            <input
              type="text"
              placeholder="e.g. 9.6 / 10 or 'Top 3 Finalist'"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
              <FileText size={14} className="text-slate-400" />
              Feedback / Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Feedback given by the judge during pitch or review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Judge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

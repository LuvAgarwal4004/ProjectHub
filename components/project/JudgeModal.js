"use client";

import { useState } from "react";
import { X, Award, User, Building, Mail, Globe, Star, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-body">
      <div className="w-full max-w-lg overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 font-heading">
              <Award size={20} />
            </div>
            <div>
              <h2 className="font-heading font-extrabold uppercase text-[var(--color-ink)] text-base">
                {isEditing ? "Edit Judge / Evaluator" : "Add Judge / Evaluator"}
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Track competition judges, mentors & feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              <User size={14} className="text-[var(--color-accent-deep)]" />
              Judge Name <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Designation / Role
              </label>
              <input
                type="text"
                placeholder="e.g. VP of Product"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent-deep)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <Building size={14} className="text-[var(--color-ink-soft)]" />
                Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Google / MIT"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent-deep)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <Mail size={14} className="text-[var(--color-ink-soft)]" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="judge@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent-deep)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <Globe size={14} className="text-[var(--color-ink-soft)]" />
                LinkedIn / Profile
              </label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/..."
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent-deep)]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              <Star size={14} className="text-[var(--color-warning)]" />
              Score / Evaluation Result
            </label>
            <input
              type="text"
              placeholder="e.g. 9.6 / 10 or 'Top 3 Finalist'"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              <FileText size={14} className="text-[var(--color-ink-soft)]" />
              Feedback / Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Feedback given by the judge during pitch or review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none transition focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading || !name.trim()}
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Judge"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

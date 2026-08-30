"use client";

import { useState } from "react";
import { X, Megaphone, DollarSign, UserCheck, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-body">
      <div className="w-full max-w-lg overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              <Megaphone size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[var(--color-ink)]">
                {isEditing ? "Edit Sponsor / Ad Deal" : "Add Sponsor / Ad Campaign"}
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Track sponsorships, advertiser partnerships & monetized promotions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto p-6 space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              <Megaphone size={14} className="text-[var(--color-accent-deep)]" />
              Sponsor / Ad Partner Name <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AWS Cloud / RedBull / Vercel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Sponsorship / Ad Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
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
              <label className="mb-1.5 flex items-center gap-1 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <DollarSign size={13} className="text-[var(--color-accent-deep)]" />
                Deal Value / Amount
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Deal Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              >
                <option value="confirmed">Confirmed</option>
                <option value="in_discussion">In Discussion</option>
                <option value="pending">Pending Agreement</option>
                <option value="completed">Completed / Fulfilled</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <UserCheck size={14} className="text-[var(--color-ink-soft)]" />
                Contact Person / POC
              </label>
              <input
                type="text"
                placeholder="e.g. sponsorship@aws.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              <FileText size={14} className="text-[var(--color-ink-soft)]" />
              Deliverables & Campaign Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Logo on PPT presentation, 1 banner placement, $500 AWS credits..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={loading || !name.trim()}
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Sponsor / Ad"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

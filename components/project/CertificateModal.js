"use client";

import { useState } from "react";
import { X, Award, FileCheck, Building, Calendar, Link2, KeyRound, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

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
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-body">
      <div className="w-full max-w-lg overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              <FileCheck size={20} />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-[var(--color-ink)]">
                {isEditing ? "Edit Certificate" : "Add Certificate to Store"}
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Store verification links, credentials & achievement awards
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
              <Award size={14} className="text-[var(--color-accent-deep)]" />
              Certificate Title <span className="text-[var(--color-danger)]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 1st Place Winner - Grand Hackathon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Recipient / Team Name
              </label>
              <input
                type="text"
                placeholder="e.g. Project Team Alpha"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <Building size={14} className="text-[var(--color-ink-soft)]" />
                Issuing Organization / Event
              </label>
              <input
                type="text"
                placeholder="e.g. DevHouse 2026 / IEEE"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <Calendar size={14} className="text-[var(--color-ink-soft)]" />
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                <KeyRound size={14} className="text-[var(--color-ink-soft)]" />
                Credential / Certificate ID
              </label>
              <input
                type="text"
                placeholder="e.g. CERT-2026-98210"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              <Link2 size={14} className="text-[var(--color-accent-deep)]" />
              Certificate URL / Verification Link
            </label>
            <input
              type="text"
              placeholder="https://verify.example.com/cert/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              <FileText size={14} className="text-[var(--color-ink-soft)]" />
              Notes / Description
            </label>
            <textarea
              rows={2}
              placeholder="Optional notes regarding the certificate..."
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
              disabled={loading || !title.trim()}
            >
              {loading ? "Saving..." : isEditing ? "Save Changes" : "Save Certificate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

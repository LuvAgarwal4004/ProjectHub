"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function MarkErrorModal({
  project,
  file,
  onClose,
  onUpdated,
}) {
  const [description, setDescription] = useState(
    file.errorDescription || ""
  );

  const [startLine, setStartLine] = useState(
    file.errorStartLine ? String(file.errorStartLine) : ""
  );

  const [endLine, setEndLine] = useState(
    file.errorEndLine ? String(file.errorEndLine) : ""
  );

  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!description.trim()) {
      return;
    }

    if (
      startLine &&
      endLine &&
      Number(endLine) < Number(startLine)
    ) {
      alert("End line cannot be before start line.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/projects/${project._id}/files/${file._id}/error`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description,
            startLine: startLine ? Number(startLine) : null,
            endLine: endLine ? Number(endLine) : null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not mark error");
      }

      onUpdated(data.file);
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-body">
      <div className="w-full max-w-lg rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[var(--color-danger)]" />
              <h2 className="font-heading font-bold text-base text-[var(--color-ink)]">
                Mark Code Section as Error
              </h2>
            </div>

            <p className="mt-1 text-xs text-[var(--color-ink-muted)] font-mono">
              {file.path || file.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              Error description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Explain what is wrong with this section..."
              className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-danger)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Start line
              </label>
              <input
                type="number"
                min="1"
                value={startLine}
                onChange={(e) => setStartLine(e.target.value)}
                placeholder="e.g. 10"
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-danger)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                End line
              </label>
              <input
                type="number"
                min="1"
                value={endLine}
                onChange={(e) => setEndLine(e.target.value)}
                placeholder="e.g. 15"
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-danger)]"
              />
            </div>
          </div>

          <p className="text-xs text-[var(--color-ink-muted)]">
            Leave both line fields empty if the error applies to the entire file.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              type="submit"
              disabled={loading || !description.trim()}
            >
              {loading ? "Marking..." : "Mark Section as Error"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LinkModal({
  project,
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
  e.preventDefault();
  setLoading(true);

  const res = await fetch(`/api/projects/${project._id}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, url, description }),
  });

  const data = await res.json();
  setLoading(false);

  if (!res.ok) {
    alert(data.error || "Could not add link");
    return;
  }

  onCreated(data.link);
  onClose();   // <-- add this line
}

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-body">
      <div className="w-full max-w-lg rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl sm:p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-heading font-extrabold uppercase text-[var(--color-ink)]">
              Add Link
            </h2>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Save an important project URL.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="GitHub Repository"
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              URL
            </label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/..."
              type="url"
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What is this link for?"
              className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading || !title.trim() || !url.trim()}
          >
            {loading ? "Adding..." : "Add Link"}
          </Button>
        </form>
      </div>
    </div>
  );
}
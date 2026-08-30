"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { ShieldCheck } from "lucide-react";

export default function CreateProjectForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [event, setEvent] = useState("");
  const [institution, setInstitution] = useState("");
  const [prizeMoney, setPrizeMoney] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          deployedUrl,
          event,
          institution,
          prizeMoney,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create project");
        return;
      }

      toast.success("Project created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-6 py-12 text-[var(--color-ink)] font-body">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="text-xs font-heading font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-6">
          <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--color-accent-deep)]">
            New workspace
          </p>

          <h1 className="mt-1 text-3xl font-heading font-bold tracking-tight text-[var(--color-ink)]">
            Create a project
          </h1>

          <p className="mt-2 text-xs font-body text-[var(--color-ink-muted)]">
            Start a new workspace for your project and bring everything together in one place.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div>
            <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              Project name *
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              maxLength={100}
              placeholder="e.g. Your Project Name"
              className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition placeholder:text-[var(--color-ink-soft)]"
            />
            <p className="mt-1.5 text-[11px] font-body text-[var(--color-ink-soft)]">
              Give your project a clear and recognizable name.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="What is this project about?"
              className="w-full resize-none rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition placeholder:text-[var(--color-ink-soft)]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                Deployed URL <span className="font-normal text-[var(--color-ink-soft)]">(optional)</span>
              </label>

              <input
                type="url"
                value={deployedUrl}
                onChange={(e) => setDeployedUrl(e.target.value)}
                placeholder="https://your-project.vercel.app"
                className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition placeholder:text-[var(--color-ink-soft)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                Event <span className="font-normal text-[var(--color-ink-soft)]">(optional)</span>
              </label>

              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="e.g. Smart India Hackathon"
                className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition placeholder:text-[var(--color-ink-soft)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                Institution <span className="font-normal text-[var(--color-ink-soft)]">(optional)</span>
              </label>

              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. HITK"
                className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition placeholder:text-[var(--color-ink-soft)]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                Prize Money <span className="font-normal text-[var(--color-ink-soft)]">(optional)</span>
              </label>

              <input
                type="text"
                value={prizeMoney}
                onChange={(e) => setPrizeMoney(e.target.value)}
                placeholder="e.g. ₹50,000"
                className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition placeholder:text-[var(--color-ink-soft)]"
              />
            </div>
          </div>

          <div className="rounded-[12px] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-4">
            <div className="flex gap-3 items-start">
              <div className="p-1 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] shrink-0 mt-0.5">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="font-heading font-semibold text-xs text-[var(--color-ink)]">
                  You're the first admin
                </p>
                <p className="mt-1 text-xs font-body text-[var(--color-ink-muted)] leading-relaxed">
                  You will automatically become an Admin of this project. You can invite other members and manage their roles after creating the project.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <Link href="/dashboard">
              <Button variant="secondary" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>

            <Button type="submit" disabled={loading} variant="primary" className="w-full sm:w-auto">
              {loading ? "Creating..." : "Create Project →"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { X, CalendarDays, Clock, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CreateTaskModal({
  project,
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);

    const res = await fetch(`/api/projects/${project._id}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        assignees,
        deadlineDate,
        deadlineTime,
        status,
        priority,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Could not create task");
      return;
    }

    onCreated(data.task);
  }

  function toggleAssignee(id) {
    setAssignees((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-body">
      <div className="w-full max-w-2xl overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl space-y-5">
        <div className="max-h-[85vh] overflow-y-auto pr-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold uppercase text-[var(--color-ink)]">
                Create Task
              </h2>
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                Assign work to one or more team members.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)]"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Task Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Build login page"
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Assign to Members
              </label>
              <div className="grid gap-2 max-h-48 overflow-y-auto">
                {project.members?.map((member) => {
                  const id = String(member.user._id);
                  const selected = assignees.includes(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleAssignee(id)}
                      className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                        selected
                          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15"
                          : "border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 hover:bg-[var(--color-surface-muted)]"
                      }`}
                    >
                      {member.user.image ? (
                        <img
                          src={member.user.image}
                          alt=""
                          className="h-8 w-8 rounded-full border border-[var(--color-border)] object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] font-heading font-bold text-xs">
                          {member.user.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-semibold text-xs text-[var(--color-ink)]">
                          {member.user.name}
                        </p>
                        <p className="text-[11px] text-[var(--color-ink-muted)]">
                          {member.user.email}
                        </p>
                      </div>

                      {selected && (
                        <span className="flex items-center gap-1 text-[11px] font-heading font-bold text-[var(--color-accent-deep)]">
                          <Check size={14} /> Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Deadline Date
                </label>
                <div className="relative">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none"
                  />
                  <input
                    type="date"
                    value={deadlineDate}
                    onChange={(e) => setDeadlineDate(e.target.value)}
                    className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Deadline Time
                </label>
                <div className="relative">
                  <Clock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none"
                  />
                  <input
                    type="time"
                    value={deadlineTime}
                    onChange={(e) => setDeadlineTime(e.target.value)}
                    className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-9 pr-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
                >
                  <option value="todo">To-do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 p-3 self-end">
                <input
                  type="checkbox"
                  checked={priority}
                  onChange={(e) => setPriority(e.target.checked)}
                  className="h-4 w-4 accent-[var(--color-accent-deep)]"
                />
                <div>
                  <p className="font-heading font-bold text-xs text-[var(--color-ink)]">
                    Priority Task
                  </p>
                  <p className="text-[10px] text-[var(--color-ink-muted)]">
                    Highlight prominently in workspace
                  </p>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={loading || !title.trim()}
              >
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
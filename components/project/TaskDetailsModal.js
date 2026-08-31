"use client";

import {
  X,
  CalendarDays,
  Clock,
  User,
  Flag,
  CheckCircle2,
} from "lucide-react";

export default function TaskDetailsModal({
  task,
  onClose,
}) {
  if (!task) return null;

  function formatDate(date) {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function formatDateTime(date) {
    if (!date) return "Unknown";

    return new Date(date).toLocaleString(
      undefined,
      {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  function formatStatus(status) {
    switch (status) {
      case "todo":
        return "To-do";

      case "in_progress":
        return "In Progress";

      case "pending":
        return "Pending";

      case "completed":
        return "Completed";

      default:
        return status || "Unknown";
    }
  }

  const hasDeadline =
    task.deadlineDate || task.deadlineTime;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-body"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-accent-deep)]">
                Task Details
              </span>

              {task.priority && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 px-2 py-0.5 text-[10px] font-heading font-bold text-[var(--color-accent-deep)]">
                  <Flag size={10} />
                  Priority
                </span>
              )}
            </div>

            <h2 className="mt-2 text-xl font-heading font-bold text-[var(--color-ink)] break-words">
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-ink)] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* STATUS */}

        <div className="mt-6">
          <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Status
          </p>

          <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2">
            <CheckCircle2
              size={15}
              className={
                task.status === "completed"
                  ? "text-[var(--color-accent-deep)]"
                  : "text-[var(--color-ink-muted)]"
              }
            />

            <span className="text-xs font-heading font-semibold text-[var(--color-ink)]">
              {formatStatus(task.status)}
            </span>
          </div>
        </div>

        {/* DEADLINE */}

        <div className="mt-6">
          <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Deadline
          </p>

          {hasDeadline ? (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                <CalendarDays
                  size={16}
                  className="text-[var(--color-accent-deep)]"
                />

                <div>
                  <p className="text-[10px] text-[var(--color-ink-muted)]">
                    Date
                  </p>

                  <p className="text-xs font-heading font-semibold text-[var(--color-ink)]">
                    {task.deadlineDate
                      ? formatDate(
                          task.deadlineDate
                        )
                      : "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
                <Clock
                  size={16}
                  className="text-[var(--color-accent-deep)]"
                />

                <div>
                  <p className="text-[10px] text-[var(--color-ink-muted)]">
                    Time
                  </p>

                  <p className="text-xs font-heading font-semibold text-[var(--color-ink)]">
                    {task.deadlineTime ||
                      "Not set"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              No deadline set.
            </p>
          )}
        </div>

        {/* ASSIGNEES */}

        <div className="mt-6">
          <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Assigned To
          </p>

          {task.assignees?.length > 0 ? (
            <div className="mt-2 space-y-2">
              {task.assignees.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover border border-[var(--color-border)]"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-xs font-heading font-bold text-[var(--color-accent-deep)]">
                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-xs font-heading font-semibold text-[var(--color-ink)]">
                      {user.name}
                    </p>

                    <p className="text-[10px] text-[var(--color-ink-muted)] truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              No members assigned.
            </p>
          )}
        </div>

        {/* CREATED BY */}

        <div className="mt-6">
          <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Created By
          </p>

          <div className="mt-2 flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
            {task.createdBy?.image ? (
              <img
                src={task.createdBy.image}
                alt=""
                className="h-8 w-8 rounded-full object-cover border border-[var(--color-border)]"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent)]/20 text-xs font-heading font-bold text-[var(--color-accent-deep)]">
                {task.createdBy?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-heading font-semibold text-[var(--color-ink)]">
                {task.createdBy?.name ||
                  "Unknown"}
              </p>

              <p className="text-[10px] text-[var(--color-ink-muted)]">
                {task.createdBy?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* CREATED AT */}

        <div className="mt-6">
          <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Created At
          </p>

          <div className="mt-2 flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
            <Clock
              size={16}
              className="text-[var(--color-ink-muted)]"
            />

            <p className="text-xs font-heading font-semibold text-[var(--color-ink)]">
              {formatDateTime(task.createdAt)}
            </p>
          </div>
        </div>

        {/* FOOTER */}

        <div className="mt-6 flex justify-end border-t border-[var(--color-border)] pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-xs font-heading font-bold text-[var(--color-ink)] hover:bg-[var(--color-surface)] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
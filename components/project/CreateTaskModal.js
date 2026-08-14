"use client";

import { useState } from "react";
import {
  X,
  CalendarDays,
  Clock,
  UserPlus,
} from "lucide-react";

export default function CreateTaskModal({
  project,
  onClose,
  onCreated,
}) {
  const [title, setTitle] =
    useState("");

  const [assignees, setAssignees] =
    useState([]);

  const [deadlineDate, setDeadlineDate] =
    useState("");

  const [deadlineTime, setDeadlineTime] =
    useState("");

  const [status, setStatus] =
    useState("todo");

  const [priority, setPriority] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);

    const res = await fetch(
      `/api/projects/${project._id}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          title,
          assignees,
          deadlineDate,
          deadlineTime,
          status,
          priority,
        }),
      }
    );

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(
        data.error ||
          "Could not create task"
      );
      return;
    }

    onCreated(data.task);
  }

  function toggleAssignee(id) {
    setAssignees((prev) =>
      prev.includes(id)
        ? prev.filter(
            (item) => item !== id
          )
        : [...prev, id]
    );
  }

  return (
    <Modal>
      <div className="max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Assign work to one or more team members.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 space-y-5"
        >
          <Field label="Task">
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Build login page"
              className="input"
              autoFocus
            />
          </Field>

          <Field label="Assign to">
            <div className="grid gap-2">
              {project.members.map(
                (member) => {
                  const id =
                    String(member.user._id);

                  const selected =
                    assignees.includes(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        toggleAssignee(id)
                      }
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {member.user.image ? (
                        <img
                          src={
                            member.user
                              .image
                          }
                          alt=""
                          className="h-9 w-9 rounded-full"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                          {member.user.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-800">
                          {
                            member.user
                              .name
                          }
                        </p>

                        <p className="text-xs text-slate-400">
                          {
                            member.user
                              .email
                          }
                        </p>
                      </div>

                      {selected && (
                        <span className="text-xs font-bold text-blue-600">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Deadline date">
              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) =>
                    setDeadlineDate(
                      e.target.value
                    )
                  }
                  className="input pl-10"
                />
              </div>
            </Field>

            <Field label="Deadline time">
              <div className="relative">
                <Clock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) =>
                    setDeadlineTime(
                      e.target.value
                    )
                  }
                  className="input pl-10"
                />
              </div>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="input"
              >
                <option value="todo">
                  To-do
                </option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="completed">
                  Completed
                </option>
              </select>
            </Field>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                checked={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-blue-600"
              />

              <div>
                <p className="font-semibold text-slate-800">
                  Priority task
                </p>

                <p className="text-xs text-slate-400">
                  Show this task prominently.
                </p>
              </div>
            </label>
          </div>

          <button
            disabled={
              loading ||
              !title.trim()
            }
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Task"}
          </button>
        </form>
      </div>
    </Modal>
  );
}

function Field({
  label,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {children}
    </div>
  );
}

function Modal({
  children,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        {children}
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          outline: none;
          background: white;
        }

        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px #dbeafe;
        }
      `}</style>
    </div>
  );
}
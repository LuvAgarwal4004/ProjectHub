"use client";

import {
  AlertTriangle,
  X,
} from "lucide-react";

import { useState } from "react";

export default function MarkErrorModal({
  project,
  file,
  onClose,
  onUpdated,
}) {
  const [description, setDescription] =
    useState(
      file.errorDescription || ""
    );

  const [line, setLine] =
    useState(
      file.errorLine
        ? String(file.errorLine)
        : ""
    );

  const [loading, setLoading] =
    useState(false);

  async function submit(e) {
    e.preventDefault();

    if (!description.trim()) {
      return;
    }

    setLoading(true);

    try {
      const res =
        await fetch(
          `/api/projects/${project._id}/files/${file._id}/error`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              description,
              line,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Could not mark error"
        );
      }

      onUpdated(
        data.file
      );

      onClose();
    } catch (error) {
      alert(
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={20}
                className="text-red-500"
              />

              <h2 className="font-bold text-slate-900">
                Mark File as Error
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {file.path ||
                file.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Error description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              placeholder="Explain what is wrong with this file..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Line number
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <input
              type="number"
              min="1"
              value={line}
              onChange={(e) =>
                setLine(
                  e.target.value
                )
              }
              placeholder="42"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !description.trim()
            }
            className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Marking..."
              : "Mark as Error"}
          </button>
        </form>
      </div>
    </div>
  );
}
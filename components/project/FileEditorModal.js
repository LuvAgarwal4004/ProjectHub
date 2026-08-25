"use client";

import {
  X,
  Save,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function FileEditorModal({
  project,
  file,
  onClose,
  onUpdated,
}) {
  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [fixNote, setFixNote] =
    useState("");

  useEffect(() => {
    loadFile();
  }, []);

  async function loadFile() {
    try {
      setLoading(true);

      const res =
        await fetch(
          `/api/projects/${project._id}/files/${file._id}/content`
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Could not load file"
        );
      }

      setContent(
        data.content || ""
      );
    } catch (err) {
      setError(
        err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveFile() {
    try {
      setSaving(true);
      setError("");

      const res =
        await fetch(
          `/api/projects/${project._id}/files/${file._id}/content`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              content,
              note: fixNote,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Could not save file"
        );
      }

      onUpdated(
        data.file
      );
    } catch (err) {
      setError(
        err.message
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm">
      <div className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate font-bold text-slate-900">
              {file.name}
            </h2>

            <p className="truncate text-xs text-slate-400">
              {file.path ||
                file.name}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* ERROR INFO */}

        {file.hasError && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3">
            <div className="flex gap-3">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div>
                <p className="font-semibold text-red-700">
                  Error marked
                </p>

                {file.errorLine && (
                  <p className="text-xs font-semibold text-red-600">
                    Line{" "}
                    {file.errorLine}
                  </p>
                )}

                <p className="mt-1 text-sm text-red-600">
                  {
                    file.errorDescription
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EDITOR */}

        <div className="min-h-0 flex-1 p-3 sm:p-5">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading file...
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center text-sm text-red-500">
              {error}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
              spellCheck={false}
              className="h-full w-full resize-none rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-blue-500"
            />
          )}
        </div>

        {/* FOOTER */}

        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
          {error && (
            <p className="mb-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={fixNote}
              onChange={(e) =>
                setFixNote(
                  e.target.value
                )
              }
              placeholder="Optional: describe what you fixed..."
              disabled={saving}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />

            <button
              onClick={saveFile}
              disabled={
                loading || saving
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  Saving...
                </>
              ) : (
                <>
                  <Save
                    size={16}
                  />
                  Save File
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
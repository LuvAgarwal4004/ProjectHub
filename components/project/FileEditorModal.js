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

  const [markingError, setMarkingError] =
    useState(false);

  const [error, setError] =
    useState("");

  const [errorDescription, setErrorDescription] =
    useState(
      file.errorDescription || ""
    );

  const [errorLine, setErrorLine] =
    useState(
      file.errorLine
        ? String(file.errorLine)
        : ""
    );

  const [fixNote, setFixNote] =
    useState("");

  const [hasError, setHasError] =
    useState(
      Boolean(file.hasError)
    );

  useEffect(() => {
    loadFile();
  }, [file._id]);

  async function loadFile() {
    try {
      setLoading(true);
      setError("");

      const res =
        await fetch(
          `/api/projects/${project._id}/files/${file._id}/content`,
          {
            cache: "no-store",
          }
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

  /*
   * ============================================================
   * MARK ERROR
   * ============================================================
   */

  async function markError() {
    if (
      !errorDescription.trim()
    ) {
      setError(
        "Please describe the error before marking it."
      );
      return;
    }

    try {
      setMarkingError(true);
      setError("");

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
              description:
                errorDescription,
              line: errorLine,
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

      setHasError(true);

      onUpdated(
        data.file,
        {
          keepOpen: true,
        }
      );
    } catch (err) {
      setError(
        err.message
      );
    } finally {
      setMarkingError(false);
    }
  }

  /*
   * ============================================================
   * SAVE / FIX FILE
   * ============================================================
   */

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
              note:
                fixNote ||
                (hasError
                  ? "Fixed marked error"
                  : ""),
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

      setHasError(false);
      setErrorDescription("");
      setErrorLine("");

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
      <div className="flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-bold text-slate-900">
                {file.name}
              </h2>

              {hasError && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
                  <AlertTriangle
                    size={12}
                  />
                  ERROR
                </span>
              )}
            </div>

            <p className="truncate text-xs text-slate-400">
              {file.path ||
                file.name}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={
              saving ||
              markingError
            }
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================================================== */}
        {/* CURRENT ERROR */}
        {/* ================================================== */}

        {hasError && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-3 sm:px-6">
            <div className="flex gap-3">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-red-500"
              />

              <div className="min-w-0">
                <p className="font-bold text-red-700">
                  Error marked on this file
                </p>

                {errorLine && (
                  <p className="mt-0.5 text-xs font-semibold text-red-600">
                    Line {errorLine}
                  </p>
                )}

                <p className="mt-1 break-words text-sm text-red-600">
                  {errorDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* EDITOR */}
        {/* ================================================== */}

        <div className="min-h-0 flex-1 p-3 sm:p-5">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Loading file...
            </div>
          ) : error &&
            !content ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-500">
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

        {/* ================================================== */}
        {/* ERROR / FIX CONTROLS */}
        {/* ================================================== */}

        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">

          {error && (
            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid gap-3 lg:grid-cols-[1fr_140px_auto_auto]">

            {/* ERROR DESCRIPTION */}

            <input
              value={errorDescription}
              onChange={(e) =>
                setErrorDescription(
                  e.target.value
                )
              }
              disabled={
                saving ||
                markingError
              }
              placeholder={
                hasError
                  ? "Update the error description..."
                  : "Describe an error in this file..."
              }
              className="min-w-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />

            {/* LINE */}

            <input
              type="number"
              min="1"
              value={errorLine}
              onChange={(e) =>
                setErrorLine(
                  e.target.value
                )
              }
              disabled={
                saving ||
                markingError
              }
              placeholder="Line #"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />

            {/* MARK ERROR */}

            <button
              onClick={markError}
              disabled={
                loading ||
                saving ||
                markingError ||
                !errorDescription.trim()
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              <AlertTriangle
                size={16}
              />

              {markingError
                ? "Marking..."
                : hasError
                ? "Update Error"
                : "Mark Error"}
            </button>

            {/* SAVE / FIX */}

            <button
              onClick={saveFile}
              disabled={
                loading ||
                saving ||
                markingError
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                "Saving..."
              ) : hasError ? (
                <>
                  <CheckCircle2
                    size={16}
                  />
                  Save & Fix
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save File
                </>
              )}
            </button>
          </div>

          {/* FIX NOTE */}

          <div className="mt-3">
            <input
              value={fixNote}
              onChange={(e) =>
                setFixNote(
                  e.target.value
                )
              }
              disabled={
                saving ||
                markingError
              }
              placeholder="Optional: describe what you fixed..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Mark an error to flag the file for the team.
            When the error is corrected, use{" "}
            <span className="font-semibold">
              Save & Fix
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
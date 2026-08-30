"use client";

import {
  X,
  Save,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/Button";
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

  const [errorStartLine, setErrorStartLine] =
    useState(
      file.errorStartLine
        ? String(file.errorStartLine)
        : ""
    );

  const [errorEndLine, setErrorEndLine] =
    useState(
      file.errorEndLine
        ? String(file.errorEndLine)
        : ""
    );

  const [fixNote, setFixNote] =
    useState("");

  const [hasError, setHasError] =
    useState(Boolean(file.hasError));

  const textareaRef =
    useRef(null);

  const lineNumbersRef =
    useRef(null);

  const highlightRef =
    useRef(null);

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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const lines = useMemo(
    () => content.split("\n"),
    [content]
  );

  function isErrorLine(lineNumber) {
    if (!hasError) {
      return false;
    }

    const start =
      Number(errorStartLine);

    const end =
      Number(errorEndLine);

    if (!start) {
      return false;
    }

    if (!end) {
      return lineNumber === start;
    }

    return (
      lineNumber >= start &&
      lineNumber <= end
    );
  }

  function syncScroll() {
    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    const top =
      textarea.scrollTop;

    const left =
      textarea.scrollLeft;

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop =
        top;
    }

    if (highlightRef.current) {
      highlightRef.current.scrollTop =
        top;

      highlightRef.current.scrollLeft =
        left;
    }
  }

  async function markError() {
    if (
      !errorDescription.trim()
    ) {
      setError(
        "Please describe the error before marking it."
      );
      return;
    }

    const start =
      errorStartLine
        ? Number(errorStartLine)
        : null;

    const end =
      errorEndLine
        ? Number(errorEndLine)
        : null;

    if (
      start !== null &&
      (!Number.isInteger(start) ||
        start < 1)
    ) {
      setError(
        "Start line must be a positive number."
      );
      return;
    }

    if (
      end !== null &&
      (!Number.isInteger(end) ||
        end < 1)
    ) {
      setError(
        "End line must be a positive number."
      );
      return;
    }

    if (
      start !== null &&
      end !== null &&
      end < start
    ) {
      setError(
        "End line cannot be before start line."
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

              startLine: start,
              endLine: end,
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

      setErrorStartLine(
        data.file.errorStartLine
          ? String(
              data.file.errorStartLine
            )
          : ""
      );

      setErrorEndLine(
        data.file.errorEndLine
          ? String(
              data.file.errorEndLine
            )
          : ""
      );

      onUpdated(
        data.file,
        {
          keepOpen: true,
        }
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setMarkingError(false);
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

      setErrorStartLine("");

      setErrorEndLine("");

      onUpdated(data.file);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 backdrop-blur-xs font-body">
      <div className="flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-heading font-bold text-base text-[var(--color-ink)]">
                {file.name}
              </h2>

              {hasError && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-danger)]/15 border border-[var(--color-danger)]/30 px-2.5 py-0.5 text-[10px] font-heading font-bold text-[var(--color-danger)]">
                  <AlertTriangle size={12} />
                  ERROR
                </span>
              )}
            </div>

            <p className="truncate text-xs font-mono text-[var(--color-ink-muted)]">
              {file.path || file.name}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={saving || markingError}
            className="rounded-xl p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* CURRENT ERROR */}
        {hasError && (
          <div className="border-b border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-4 py-3 sm:px-6">
            <div className="flex gap-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--color-danger)]" />
              <div className="min-w-0">
                <p className="font-heading font-bold text-xs uppercase tracking-wider text-[var(--color-danger)]">
                  Error marked on this file
                </p>
                {(errorStartLine || errorEndLine) && (
                  <p className="mt-0.5 text-xs font-mono text-[var(--color-danger)] font-semibold">
                    Lines {errorStartLine || "?"}
                    {errorEndLine && errorEndLine !== errorStartLine ? ` – ${errorEndLine}` : ""}
                  </p>
                )}
                <p className="mt-1 break-words text-xs text-[var(--color-ink)]">
                  {errorDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EDITOR */}
        <div className="min-h-0 flex-1 p-3 sm:p-5">
          {loading ? (
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-ink-muted)]">
              Loading file...
            </div>
          ) : error && !content ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-[var(--color-danger)]">
              {error}
            </div>
          ) : (
            <div className="relative flex h-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#0B0B0A]">

              {/* LINE NUMBERS */}
              <div
                ref={lineNumbersRef}
                className="z-20 w-14 shrink-0 overflow-hidden border-r border-[#1C1E18] bg-[#0B0B0A] text-right font-mono text-xs leading-6 text-[#6B6E66]"
              >
                {lines.map((_, index) => {
                  const lineNumber = index + 1;
                  return (
                    <div
                      key={lineNumber}
                      className={`box-border h-6 px-3 ${
                        isErrorLine(lineNumber)
                          ? "bg-[var(--color-danger)]/30 text-red-300 font-bold"
                          : ""
                      }`}
                    >
                      {lineNumber}
                    </div>
                  );
                })}
              </div>

              {/* CODE AREA */}
              <div className="relative min-w-0 flex-1 overflow-hidden">
                {/* RED HIGHLIGHT LAYER */}
                <div
                  ref={highlightRef}
                  className="pointer-events-none absolute inset-0 z-0 overflow-hidden font-mono text-xs leading-6"
                >
                  {lines.map((line, index) => {
                    const lineNumber = index + 1;
                    return (
                      <div
                        key={lineNumber}
                        className={`h-6 whitespace-pre ${
                          isErrorLine(lineNumber)
                            ? "bg-[var(--color-danger)]/20 text-red-300 font-bold"
                            : "text-transparent"
                        }`}
                      >
                        {line || " "}
                      </div>
                    );
                  })}
                </div>

                {/* ACTUAL EDITOR */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onScroll={syncScroll}
                  spellCheck={false}
                  disabled={saving || markingError}
                  className="relative z-10 h-full w-full resize-none overflow-auto bg-transparent p-0 font-mono text-xs leading-6 text-[#F7F7F4] caret-[var(--color-accent)] outline-none"
                  style={{
                    tabSize: 2,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 sm:px-6">
          {error && (
            <p className="mb-3 rounded-xl bg-[var(--color-danger)]/15 border border-[var(--color-danger)]/30 px-3 py-2 text-xs text-[var(--color-danger)] font-medium">
              {error}
            </p>
          )}

          <div className="grid gap-3 lg:grid-cols-[1fr_120px_120px_auto_auto]">
            {/* DESCRIPTION */}
            <input
              value={errorDescription}
              onChange={(e) => setErrorDescription(e.target.value)}
              disabled={saving || markingError}
              placeholder={hasError ? "Update error description..." : "Describe an error..."}
              className="min-w-0 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-danger)]"
            />

            {/* START */}
            <input
              type="number"
              min="1"
              value={errorStartLine}
              onChange={(e) => setErrorStartLine(e.target.value)}
              disabled={saving || markingError}
              placeholder="Start #"
              className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-danger)]"
            />

            {/* END */}
            <input
              type="number"
              min="1"
              value={errorEndLine}
              onChange={(e) => setErrorEndLine(e.target.value)}
              disabled={saving || markingError}
              placeholder="End #"
              className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-danger)]"
            />

            {/* MARK */}
            <Button
              variant="outline"
              size="sm"
              onClick={markError}
              disabled={loading || saving || markingError || !errorDescription.trim()}
              className="text-[var(--color-danger)] border-[var(--color-danger)]/40 hover:bg-[var(--color-danger)]/10"
            >
              <AlertTriangle size={15} />
              {markingError ? "Marking..." : hasError ? "Update Error" : "Mark Error"}
            </Button>

            {/* SAVE */}
            <Button
              variant="primary"
              size="sm"
              onClick={saveFile}
              disabled={loading || saving || markingError}
            >
              {saving ? (
                "Saving..."
              ) : hasError ? (
                <>
                  <CheckCircle2 size={15} />
                  Save & Fix
                </>
              ) : (
                <>
                  <Save size={15} />
                  Save File
                </>
              )}
            </Button>
          </div>

          <div className="mt-3">
            <input
              value={fixNote}
              onChange={(e) => setFixNote(e.target.value)}
              disabled={saving || markingError}
              placeholder="Optional: describe what you fixed..."
              className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
            />
          </div>

          <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
            Every line is numbered. Enter a start and end line to highlight an entire code section.
          </p>
        </div>
      </div>
    </div>
  );
}
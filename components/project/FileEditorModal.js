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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm">
      <div className="flex h-[95vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

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
              {file.path || file.name}
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

        {/* CURRENT ERROR */}

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

                {(errorStartLine ||
                  errorEndLine) && (
                  <p className="mt-0.5 text-xs font-semibold text-red-600">
                    Lines{" "}
                    {errorStartLine ||
                      "?"}
                    {errorEndLine &&
                    errorEndLine !==
                      errorStartLine
                      ? ` – ${errorEndLine}`
                      : ""}
                  </p>
                )}

                <p className="mt-1 break-words text-sm text-red-600">
                  {errorDescription}
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
          ) : error && !content ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-500">
              {error}
            </div>
          ) : (
            <div className="relative flex h-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950">

              {/* LINE NUMBERS */}

              <div
                ref={lineNumbersRef}
                className="z-20 w-14 shrink-0 overflow-hidden border-r border-slate-800 bg-slate-950 text-right font-mono text-sm leading-6 text-slate-500"
              >
                {lines.map(
                  (_, index) => {
                    const lineNumber =
                      index + 1;

                    return (
                      <div
                        key={lineNumber}
                        className={`box-border h-6 px-3 ${
                          isErrorLine(
                            lineNumber
                          )
                            ? "bg-red-500/30 text-red-300"
                            : ""
                        }`}
                      >
                        {lineNumber}
                      </div>
                    );
                  }
                )}
              </div>

              {/* CODE AREA */}

              <div className="relative min-w-0 flex-1 overflow-hidden">

                {/* RED HIGHLIGHT LAYER */}

                <div
                  ref={highlightRef}
                  className="pointer-events-none absolute inset-0 z-0 overflow-hidden font-mono text-sm leading-6"
                >
                  {lines.map(
                    (line, index) => {
                      const lineNumber =
                        index + 1;

                      return (
                        <div
                          key={lineNumber}
                          className={`h-6 whitespace-pre ${
                            isErrorLine(
                              lineNumber
                            )
                              ? "bg-red-500/20 text-red-300"
                              : "text-transparent"
                          }`}
                        >
                          {line || " "}
                        </div>
                      );
                    }
                  )}
                </div>

                {/* ACTUAL EDITOR */}

                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) =>
                    setContent(
                      e.target.value
                    )
                  }
                  onScroll={syncScroll}
                  spellCheck={false}
                  disabled={
                    saving ||
                    markingError
                  }
                  className="relative z-10 h-full w-full resize-none overflow-auto bg-transparent p-0 font-mono text-sm leading-6 text-slate-100 caret-white outline-none"
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

        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">

          {error && (
            <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid gap-3 lg:grid-cols-[1fr_120px_120px_auto_auto]">

            {/* DESCRIPTION */}

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
                  ? "Update error description..."
                  : "Describe an error..."
              }
              className="min-w-0 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />

            {/* START */}

            <input
              type="number"
              min="1"
              value={errorStartLine}
              onChange={(e) =>
                setErrorStartLine(
                  e.target.value
                )
              }
              disabled={
                saving ||
                markingError
              }
              placeholder="Start #"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />

            {/* END */}

            <input
              type="number"
              min="1"
              value={errorEndLine}
              onChange={(e) =>
                setErrorEndLine(
                  e.target.value
                )
              }
              disabled={
                saving ||
                markingError
              }
              placeholder="End #"
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />

            {/* MARK */}

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
              <AlertTriangle size={16} />

              {markingError
                ? "Marking..."
                : hasError
                ? "Update Error"
                : "Mark Error"}
            </button>

            {/* SAVE */}

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
                  <CheckCircle2 size={16} />
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

          <div className="mt-3">
            <input
              value={fixNote}
              onChange={(e) =>
                setFixNote(e.target.value)
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
            Every line is numbered. Enter a start and
            end line to highlight an entire code section.
          </p>
        </div>
      </div>
    </div>
  );
}
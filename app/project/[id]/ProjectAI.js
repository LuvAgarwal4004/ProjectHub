"use client";

import {
  Sparkles,
  Send,
  Copy,
  Loader2,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import toast from "react-hot-toast";

export default function ProjectAI({
  projectId,
}) {
  const [open, setOpen] =
    useState(false);

  const [prompt, setPrompt] =
    useState("");

  const [response, setResponse] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function askAI(customPrompt) {
    const finalPrompt =
      customPrompt ||
      prompt.trim();

    if (!finalPrompt) {
      return;
    }

    setLoading(true);

    try {
      const res =
        await fetch(
          `/api/projects/${projectId}/ai`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              prompt:
                finalPrompt,
            }),
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "AI request failed"
        );
      }

      setResponse(
        data.response || ""
      );

      setPrompt("");
    } catch (error) {
      toast.error(
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyResponse() {
    if (!response) return;

    await navigator.clipboard.writeText(
      response
    );

    toast.success(
      "Copied to clipboard!"
    );
  }

  return (
    <>
      {/* FLOATING BUTTON */}

      {!open && (
        <button
          onClick={() =>
            setOpen(true)
          }
          className="fixed bottom-6 right-6 z-[150] inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-2xl"
        >
          <Sparkles size={18} />

          Project AI
        </button>
      )}

      {/* CHAT */}

      {open && (
        <div className="fixed bottom-5 right-5 z-[150] flex w-[calc(100vw-2.5rem)] max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

          {/* HEADER */}

          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} />

                <h2 className="font-bold">
                  Project AI
                </h2>
              </div>

              <p className="mt-1 text-xs text-blue-100">
                Ask anything about this project.
              </p>
            </div>

            <button
              onClick={() =>
                setOpen(false)
              }
              className="rounded-xl p-2 hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* CONTENT */}

          <div className="max-h-[55vh] overflow-y-auto p-4">

            {!response && !loading && (
              <div className="space-y-2">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quick actions
                </p>

                <QuickPrompt
                  text="Write a LinkedIn post about this project"
                  onClick={() =>
                    askAI(
                      "Write a professional but engaging LinkedIn post about this project."
                    )
                  }
                />

                <QuickPrompt
                  text="Give me a short project summary"
                  onClick={() =>
                    askAI(
                      "Give me a concise professional summary of this project."
                    )
                  }
                />

                <QuickPrompt
                  text="Write a resume description"
                  onClick={() =>
                    askAI(
                      "Write 2-3 strong resume bullet points describing this project."
                    )
                  }
                />

                <QuickPrompt
                  text="Write a portfolio description"
                  onClick={() =>
                    askAI(
                      "Write a polished technical portfolio description for this project."
                    )
                  }
                />
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center py-10">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                  <Loader2
                    size={20}
                    className="animate-spin text-blue-600"
                  />

                  Thinking...
                </div>
              </div>
            )}

            {response && !loading && (
              <div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {response}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={copyResponse}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Copy size={14} />
                    Copy
                  </button>

                  <button
                    onClick={() =>
                      setResponse("")
                    }
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Ask another
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}

          <div className="border-t border-slate-200 p-3">
            <div className="flex gap-2">
              <input
                value={prompt}
                onChange={(e) =>
                  setPrompt(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    askAI();
                  }
                }}
                placeholder="Ask Project AI..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                onClick={() =>
                  askAI()
                }
                disabled={
                  loading ||
                  !prompt.trim()
                }
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QuickPrompt({
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      {text}
    </button>
  );
}
"use client";

import {
  Sparkles,
  Send,
  Copy,
  Loader2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";

export default function ProjectAI({
  projectId,
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  console.log("PROJECT AI projectId:", projectId);
  async function askAI(customPrompt) {
    const finalPrompt = customPrompt || prompt.trim();
    if (!finalPrompt) return;
    if (!projectId) {
      toast.error("Project ID is missing.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setResponse(data.response || "");
      setPrompt("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyResponse() {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    toast.success("Copied to clipboard!");
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[150] inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-3.5 text-xs font-heading font-extrabold text-[#0B0B0A] shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles size={16} />
          PROJECT AI
        </button>
      )}

      {/* CHAT */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[150] flex w-[calc(100vw-2.5rem)] max-w-md flex-col overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl font-body">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-[var(--color-surface-muted)] border-b border-[var(--color-border)] px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[var(--color-accent-deep)]" />
                <h2 className="font-heading font-bold text-sm text-[var(--color-ink)] uppercase">
                  Project AI
                </h2>
              </div>
              <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                Ask anything about this project.
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="rounded-xl p-2 text-[var(--color-ink-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            >
              <X size={18} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="max-h-[55vh] overflow-y-auto p-4">
            {!response && !loading && (
              <div className="space-y-2">
                <p className="mb-3 text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Quick Actions
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
                <div className="flex items-center gap-3 text-xs font-heading font-semibold text-[var(--color-ink-muted)]">
                  <Loader2
                    size={20}
                    className="animate-spin text-[var(--color-accent-deep)]"
                  />
                  Thinking...
                </div>
              </div>
            )}

            {response && !loading && (
              <div>
                <div className="rounded-xl bg-[var(--color-surface-muted)] p-4 border border-[var(--color-border)]">
                  <p className="whitespace-pre-wrap text-xs leading-6 text-[var(--color-ink)]">
                    {response}
                  </p>
                </div>

                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyResponse}
                  >
                    <Copy size={13} /> Copy
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setResponse("")}
                  >
                    Ask another
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="border-t border-[var(--color-border)] p-3 bg-[var(--color-surface)]">
            <div className="flex gap-2">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askAI();
                  }
                }}
                placeholder="Ask Project AI..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-xs text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
              />

              <Button
                variant="primary"
                size="sm"
                onClick={() => askAI()}
                disabled={loading || !prompt.trim()}
                className="shrink-0 aspect-square p-2.5"
              >
                <Send size={15} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function QuickPrompt({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-muted)]/50 p-3 text-left text-xs font-heading font-medium text-[var(--color-ink)] transition hover:border-[var(--color-accent-deep)] hover:bg-[var(--color-surface)]"
    >
      {text}
    </button>
  );
}
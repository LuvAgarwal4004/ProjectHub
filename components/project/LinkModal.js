"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function LinkModal({
  project,
  onClose,
  onCreated,
}) {
  const [title, setTitle] =
    useState("");

  const [url, setUrl] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submit(e) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch(
      `/api/projects/${project._id}/links`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          description,
        }),
      }
    );

    const data =
      await res.json();

    setLoading(false);

    if (!res.ok) {
      alert(
        data.error ||
          "Could not add link"
      );
      return;
    }

    onCreated(data.link);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Add Link
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Save an important project URL.
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
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="GitHub Repository"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              URL
            </label>

            <input
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              placeholder="https://github.com/..."
              type="url"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              placeholder="What is this link for?"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            disabled={
              loading ||
              !title.trim() ||
              !url.trim()
            }
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Adding..."
              : "Add Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
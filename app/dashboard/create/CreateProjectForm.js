"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CreateProjectForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create project");
        return;
      }

      toast.success("Project created successfully!");

      router.push("/dashboard");
      router.refresh();

    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-6 py-12">

      <div className="mx-auto max-w-3xl">

        {/* BACK */}

        <Link
          href="/dashboard"
          className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          ← Back to dashboard
        </Link>


        {/* HEADER */}

        <div className="mt-8">

          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            New workspace
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Create a project
          </h1>

          <p className="mt-3 text-slate-500">
            Start a new workspace for your project and bring
            everything together in one place.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8"
        >

          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Project name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              maxLength={100}
              placeholder="e.g. HITK Stationary"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-slate-400">
              Give your project a clear and recognizable name.
            </p>
          </div>


          {/* DESCRIPTION */}

          <div className="mt-7">

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              rows={6}
              placeholder="What is this project about?"
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

          </div>


          {/* INFO */}

          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex gap-3">

              <div className="text-xl">
                💡
              </div>

              <div>

                <p className="font-semibold text-blue-900">
                  You're the first admin
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  You will automatically become an Admin of this
                  project. You can invite other members and manage
                  their roles after creating the project.
                </p>

              </div>

            </div>

          </div>


          {/* BUTTONS */}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Link
              href="/dashboard"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating..."
                : "Create Project →"}
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}
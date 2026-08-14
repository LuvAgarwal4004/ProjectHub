"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function AcceptInvitation({
  token,
  invitation,
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function acceptInvitation() {
    setLoading(true);

    try {
      const response =
        await fetch(
          `/api/invitations/${token}/accept`,
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not accept invitation"
        );
      }

      toast.success(
        "You joined the project!"
      );

      router.push(
        `/project/${data.projectId}`
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  const role =
    invitation.role
      ?.charAt(0)
      .toUpperCase() +
    invitation.role?.slice(1);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <CheckCircle2 size={28} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Project Invitation
          </p>

          <h1 className="mt-2 break-words text-3xl font-bold text-slate-900">
            {invitation.project.name}
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            {invitation.project.description ||
              "You have been invited to join this project."}
          </p>
        </div>

        <div className="mt-7 rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your role
          </p>

          <p className="mt-1 font-bold capitalize text-slate-800">
            {role}
          </p>
        </div>

        <button
          onClick={acceptInvitation}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Joining..."
            : "Accept Invitation"}

          {!loading && (
            <ArrowRight size={17} />
          )}
        </button>
      </div>
    </main>
  );
}
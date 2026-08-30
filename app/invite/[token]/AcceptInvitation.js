"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle2, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AcceptInvitation({
  token,
  invitation,
  currentUserEmail,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function acceptInvitation() {
    setLoading(true);

    try {
      const response = await fetch(`/api/invitations/${token}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not accept invitation");
      }

      toast.success("You joined the project!");
      router.push(`/project/${data.projectId}`);
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const role =
    invitation.role?.charAt(0).toUpperCase() + invitation.role?.slice(1);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 font-body">
      <div className="w-full max-w-lg rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl sm:p-9">
        {/* ICON */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
          <CheckCircle2 size={28} />
        </div>

        {/* HEADER */}
        <div className="mt-6 text-center">
          <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--color-accent-deep)]">
            Project Invitation
          </p>

          <h1 className="mt-2 break-words text-3xl font-heading font-extrabold uppercase text-[var(--color-ink)]">
            {invitation.project.name}
          </h1>

          <p className="mt-3 text-xs leading-5 text-[var(--color-ink-muted)]">
            {invitation.project.description ||
              "You have been invited to join this project workspace."}
          </p>
        </div>

        {/* EMAIL */}
        {invitation.email && (
          <div className="mt-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 text-[var(--color-ink-soft)]">
                <Mail size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Invitation sent to
                </p>

                <p className="mt-1 break-all text-xs font-heading font-semibold text-[var(--color-ink)]">
                  {invitation.email}
                </p>

                {currentUserEmail &&
                  currentUserEmail.toLowerCase() !==
                    invitation.email.toLowerCase() && (
                    <p className="mt-2 text-xs leading-5 text-[var(--color-warning)]">
                      You are currently logged in with a different email. Sign
                      in with the invited account to accept this invitation.
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* ROLE */}
        <div className="mt-4 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <p className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
            Assigned Role
          </p>

          <p className="mt-1 font-heading font-bold capitalize text-sm text-[var(--color-ink)]">
            {role}
          </p>
        </div>

        {/* ACCEPT */}
        <div className="mt-6">
          <Button
            variant="primary"
            size="lg"
            onClick={acceptInvitation}
            disabled={
              loading ||
              (invitation.email &&
                currentUserEmail &&
                currentUserEmail.toLowerCase() !==
                  invitation.email.toLowerCase())
            }
            className="w-full shadow-md"
          >
            {loading ? "Joining..." : "Accept Invitation"}
            {!loading && <ArrowRight size={17} />}
          </Button>
        </div>
      </div>
    </main>
  );
}
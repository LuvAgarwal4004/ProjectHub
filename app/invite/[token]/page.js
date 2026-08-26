import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import connectDB from "@/db/connectDb";
import ProjectInvitation from "@/models/ProjectInvitation";

import { authOptions } from "@/lib/authOptions";
import { hashToken } from "@/lib/shareToken";

import AcceptInvitation from "./AcceptInvitation";

export default async function InvitePage({
  params,
}) {
  const { token } = await params;

  const session =
    await getServerSession(authOptions);

  // -----------------------------------------
  // USER MUST BE LOGGED IN
  // -----------------------------------------

  if (!session?.user?.id) {
    redirect(
      `/login?callbackUrl=/invite/${token}`
    );
  }

  await connectDB();

  // -----------------------------------------
  // HASH URL TOKEN
  // -----------------------------------------

  const tokenHash =
    hashToken(token);

  // -----------------------------------------
  // FIND ACTIVE INVITATION
  // -----------------------------------------

  const invitation =
    await ProjectInvitation.findOne({
      tokenHash,
      status: "pending",
      active: true,
      accepted: false,
    })
      .populate(
        "project",
        "name description"
      )
      .lean();

  // -----------------------------------------
  // INVALID / UNKNOWN INVITATION
  // -----------------------------------------

  if (!invitation) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Invitation unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            This invitation is invalid,
            expired, or has already been
            accepted.
          </p>
        </div>
      </main>
    );
  }

  // -----------------------------------------
  // CHECK EXPIRATION
  // -----------------------------------------

  if (
    !invitation.expiresAt ||
    new Date() >
      new Date(invitation.expiresAt)
  ) {
    await ProjectInvitation.updateOne(
      {
        _id: invitation._id,
      },
      {
        $set: {
          active: false,
          status: "expired",
        },
      }
    );

    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">
            Invitation expired
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Ask the project admin for a
            new invitation link.
          </p>
        </div>
      </main>
    );
  }

  return (
    <AcceptInvitation
      token={token}
      invitation={JSON.parse(
        JSON.stringify(invitation)
      )}
      currentUserEmail={
        session.user.email || ""
      }
    />
  );
}
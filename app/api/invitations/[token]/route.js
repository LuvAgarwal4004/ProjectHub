import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import ProjectInvitation from "@/models/ProjectInvitation";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";

export async function POST(
  req,
  { params }
) {
  try {
    const { token } = await params;

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Login required" },
        { status: 401 }
      );
    }

    await connectDb();

    const invitation =
      await ProjectInvitation.findOne({
        token,
        status: "pending",
      }).populate("project");

    if (!invitation) {
      return NextResponse.json(
        {
          error:
            "Invalid or already-used invitation",
        },
        { status: 404 }
      );
    }

    if (
      new Date(invitation.expiresAt) <
      new Date()
    ) {
      invitation.status =
        "expired";

      await invitation.save();

      return NextResponse.json(
        {
          error:
            "This invitation has expired",
        },
        { status: 400 }
      );
    }

    if (
      session.user.email?.toLowerCase() !==
      invitation.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation belongs to another email address",
        },
        { status: 403 }
      );
    }

    const project =
      await Project.findById(
        invitation.project._id
      );

    const alreadyMember =
      project.members.some(
        (member) =>
          String(member.user) ===
          String(session.user.id)
      );

    if (!alreadyMember) {
      project.members.push({
        user: session.user.id,
        role: invitation.role,
      });

      await project.save();
    }

    invitation.status =
      "accepted";

    await invitation.save();

    return NextResponse.json({
      success: true,
      projectId: project._id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
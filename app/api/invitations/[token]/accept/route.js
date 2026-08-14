import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectInvitation from "@/models/ProjectInvitation";

import { authOptions } from "@/lib/authOptions";
import { hashToken } from "@/lib/shareToken";

export async function POST(
  request,
  { params }
) {
  try {
    await connectDB();

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "You must be logged in",
        },
        { status: 401 }
      );
    }

    const { token } = await params;

    const tokenHash =
      hashToken(token);

    const invitation =
      await ProjectInvitation.findOne({
        tokenHash,
        status: "pending",
        active: true,
        accepted: false,
      });

    if (!invitation) {
      return NextResponse.json(
        {
          error:
            "Invalid or already-used invitation",
        },
        { status: 400 }
      );
    }

    if (
      new Date() >
      invitation.expiresAt
    ) {
      invitation.status = "expired";
      invitation.active = false;

      await invitation.save();

      return NextResponse.json(
        {
          error:
            "This invitation has expired",
        },
        { status: 400 }
      );
    }

    // If this was specifically sent to an email,
    // only that account can accept it.
    if (
      invitation.email &&
      session.user.email?.toLowerCase() !==
        invitation.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            `This invitation was sent to ${invitation.email}`,
        },
        { status: 403 }
      );
    }

    const project =
      await Project.findById(
        invitation.project
      );

    if (!project) {
      return NextResponse.json(
        {
          error:
            "Project no longer exists",
        },
        { status: 404 }
      );
    }

    const alreadyMember =
      project.members.some(
        (member) =>
          String(member.user) ===
          String(session.user.id)
      );

    if (alreadyMember) {
      invitation.accepted = true;
      invitation.active = false;
      invitation.status = "accepted";

      await invitation.save();

      return NextResponse.json({
        success: true,
        projectId:
          project._id.toString(),
      });
    }

    project.members.push({
      user: session.user.id,
      role: invitation.role,
    });

    await project.save();

    invitation.accepted = true;
    invitation.active = false;
    invitation.status = "accepted";

    await invitation.save();

    return NextResponse.json({
      success: true,
      projectId:
        project._id.toString(),
    });
  } catch (error) {
    console.error(
      "ACCEPT INVITATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to accept invitation",
      },
      { status: 500 }
    );
  }
}
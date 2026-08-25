import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectInvitation from "@/models/ProjectInvitation";
import User from "@/models/User";

import { authOptions } from "@/lib/authOptions";
import { hashToken } from "@/lib/shareToken";

export async function POST(
  request,
  { params }
) {
  try {
    const { token } = await params;

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to accept this invitation",
        },
        { status: 401 }
      );
    }

    await connectDB();

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
            "Invitation is invalid or has already been used",
        },
        { status: 400 }
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
        { _id: invitation._id },
        {
          $set: {
            active: false,
            status: "expired",
          },
        }
      );

      return NextResponse.json(
        {
          error:
            "This invitation has expired",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // GET PROJECT
    // -----------------------------------------

    const project =
      await Project.findById(
        invitation.project
      );

    if (!project) {
      return NextResponse.json(
        {
          error:
            "The project no longer exists",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // GET CURRENT USER
    // -----------------------------------------

    const user =
      await User.findById(
        session.user.id
      );

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User account not found",
        },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // EMAIL-BASED INVITATIONS
    // -----------------------------------------

    if (invitation.email) {
      const invitedEmail =
        invitation.email
          .trim()
          .toLowerCase();

      const currentEmail =
        String(user.email || "")
          .trim()
          .toLowerCase();

      if (
        !currentEmail ||
        currentEmail !== invitedEmail
      ) {
        return NextResponse.json(
          {
            error:
              "This invitation was sent to a different email address. Sign in with the invited account.",
          },
          { status: 403 }
        );
      }
    }

    // -----------------------------------------
    // CHECK IF ALREADY MEMBER
    // -----------------------------------------

    const alreadyMember =
      project.members.some(
        (member) =>
          String(member.user) ===
          String(user._id)
      );

    if (alreadyMember) {
      await ProjectInvitation.updateOne(
        { _id: invitation._id },
        {
          $set: {
            active: false,
            accepted: true,
            status: "accepted",
          },
        }
      );

      return NextResponse.json({
        success: true,
        projectId:
          project._id.toString(),
      });
    }

    // -----------------------------------------
    // ADD USER TO PROJECT
    // -----------------------------------------

    project.members.push({
      user: user._id,
      role: invitation.role,
    });

    await project.save();

    // -----------------------------------------
    // MARK INVITATION USED
    // -----------------------------------------

    await ProjectInvitation.updateOne(
      { _id: invitation._id },
      {
        $set: {
          active: false,
          accepted: true,
          status: "accepted",
        },
      }
    );

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
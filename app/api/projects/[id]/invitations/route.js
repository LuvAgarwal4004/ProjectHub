import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectInvitation from "@/models/ProjectInvitation";
import User from "@/models/User";

import { authOptions } from "@/lib/authOptions";
import {
  generateToken,
  hashToken,
} from "@/lib/shareToken";

export async function POST(req, { params }) {
  try {
    const { id } = await params;

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // ONLY PROJECT ADMIN CAN INVITE
    // -----------------------------------------

    const currentMember =
      project.members.find(
        (member) =>
          String(member.user) ===
          String(session.user.id)
      );

    if (
      !currentMember ||
      currentMember.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Only the project admin can invite users",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase() || null;

    const role =
      body.role || "viewer";

    // -----------------------------------------
    // VALIDATE ROLE
    // -----------------------------------------

    if (
      !["viewer", "editor"].includes(role)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid invitation role",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // VALIDATE EMAIL
    // -----------------------------------------

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid email address",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // IF USER ALREADY EXISTS,
    // DON'T INVITE EXISTING MEMBER
    // -----------------------------------------

    if (email) {
      const existingUser =
        await User.findOne({ email });

      if (existingUser) {
        const alreadyMember =
          project.members.some(
            (member) =>
              String(member.user) ===
              String(existingUser._id)
          );

        if (alreadyMember) {
          return NextResponse.json(
            {
              error:
                "This user is already a member of the project",
            },
            { status: 400 }
          );
        }
      }
    }

    // -----------------------------------------
    // INVALIDATE PREVIOUS INVITATIONS
    // -----------------------------------------

    if (email) {
      await ProjectInvitation.updateMany(
        {
          project: project._id,
          email,
          status: "pending",
          active: true,
        },
        {
          $set: {
            active: false,
            status: "expired",
          },
        }
      );
    }

    // -----------------------------------------
    // GENERATE RAW TOKEN
    // -----------------------------------------

    const rawToken =
      generateToken();

    const tokenHash =
      hashToken(rawToken);

    // -----------------------------------------
    // EXPIRY = 7 DAYS
    // -----------------------------------------

    const expiresAt =
      new Date();

    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

    // -----------------------------------------
    // STORE ONLY HASH
    // -----------------------------------------

    await ProjectInvitation.create({
      project: project._id,
      invitedBy: session.user.id,

      email,

      role,

      tokenHash,

      expiresAt,

      active: true,

      accepted: false,

      status: "pending",
    });

    // -----------------------------------------
    // CREATE INVITATION URL
    // -----------------------------------------

    const origin =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      new URL(req.url).origin;

    const invitationLink =
      `${origin}/invite/${rawToken}`;

    return NextResponse.json({
      success: true,
      invitationLink,
      expiresAt,
    });
  } catch (error) {
    console.error(
      "INVITATION CREATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create invitation",
      },
      { status: 500 }
    );
  }
}
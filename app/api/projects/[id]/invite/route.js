import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectInvitation from "@/models/ProjectInvitation";

import { authOptions } from "@/lib/authOptions";
import {
  generateToken,
  hashToken,
} from "@/lib/shareToken";

export async function POST(request, { params }) {
  try {
    await connectDB();

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const email =
      body.email?.trim().toLowerCase() || null;

    const role = body.role || "viewer";

    if (!["viewer", "editor"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid invitation role" },
        { status: 400 }
      );
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

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

    // Prevent duplicate pending email invitations.
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

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + 7
    );

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

    const origin =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      new URL(request.url).origin;

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
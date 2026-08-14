import crypto from "crypto";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectInvitation from "@/models/ProjectInvitation";
import User from "@/models/User";

import { authOptions } from "@/lib/authOptions";
import { sendProjectInvitation } from "@/lib/mailer";

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

    await connectDb();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const admin =
      project.members.find(
        (m) =>
          String(m.user) ===
          String(session.user.id)
      );

    if (
      !admin ||
      admin.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    const role =
      body.role === "editor"
        ? "editor"
        : "viewer";

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    // const alreadyMember =
    //   project.members.some(
    //     async (member) => {
    //       const user =
    //         await User.findById(
    //           member.user
    //         );

    //       return (
    //         user?.email?.toLowerCase() ===
    //         email
    //       );
    //     }
    //   );

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      const exists =
        project.members.some(
          (member) =>
            String(member.user) ===
            String(existingUser._id)
        );

      if (exists) {
        return NextResponse.json(
          {
            error:
              "This user is already a member",
          },
          { status: 400 }
        );
      }
    }

    const existingInvitation =
      await ProjectInvitation.findOne({
        project: id,
        email,
        status: "pending",
      });

    if (existingInvitation) {
      return NextResponse.json(
        {
          error:
            "An invitation is already pending for this email",
        },
        { status: 400 }
      );
    }

    const token =
      crypto.randomBytes(32).toString("hex");

    const invitation =
      await ProjectInvitation.create({
        project: id,
        email,
        role,
        token,
        invitedBy: session.user.id,
        expiresAt:
          new Date(
            Date.now() +
              7 *
                24 *
                60 *
                60 *
                1000
          ),
      });

    await sendProjectInvitation({
      email,
      projectName: project.name,
      inviterName:
        session.user.name ||
        "A project admin",
      role,
      token,
    });

    return NextResponse.json({
      success: true,
      invitationId:
        invitation._id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
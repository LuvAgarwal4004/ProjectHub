import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";

export async function PATCH(req, { params }) {
  try {
    const { id, userId } = await params;

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

    if (
      String(userId) ===
      String(session.user.id)
    ) {
      return NextResponse.json(
        {
          error:
            "Use transfer admin to change your own role",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    if (
      !["editor", "viewer"].includes(
        body.role
      )
    ) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const member =
      project.members.find(
        (m) =>
          String(m.user) ===
          String(userId)
      );

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    member.role = body.role;

    await project.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id, userId } = await params;

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

    const target =
      project.members.find(
        (m) =>
          String(m.user) ===
          String(userId)
      );

    if (!target) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    if (target.role === "admin") {
      return NextResponse.json(
        {
          error:
            "Transfer admin before removing the admin",
        },
        { status: 400 }
      );
    }

    project.members =
      project.members.filter(
        (m) =>
          String(m.user) !==
          String(userId)
      );

    await project.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
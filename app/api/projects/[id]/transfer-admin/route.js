import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";

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

    const currentAdmin =
      project.members.find(
        (m) =>
          String(m.user) ===
          String(session.user.id)
      );

    if (
      !currentAdmin ||
      currentAdmin.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    const { userId } =
      await req.json();

    const newAdmin =
      project.members.find(
        (m) =>
          String(m.user) ===
          String(userId)
      );

    if (!newAdmin) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    if (
      String(userId) ===
      String(session.user.id)
    ) {
      return NextResponse.json(
        {
          error:
            "You are already the admin",
        },
        { status: 400 }
      );
    }

    currentAdmin.role = "editor";
    newAdmin.role = "admin";

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
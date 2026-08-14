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

    const member =
      project.members.find(
        (m) =>
          String(m.user) ===
          String(session.user.id)
      );

    if (!member) {
      return NextResponse.json(
        { error: "You are not a member" },
        { status: 400 }
      );
    }

    if (member.role === "admin") {
      return NextResponse.json(
        {
          error:
            "Transfer admin to another member before leaving",
        },
        { status: 400 }
      );
    }

    project.members =
      project.members.filter(
        (m) =>
          String(m.user) !==
          String(session.user.id)
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
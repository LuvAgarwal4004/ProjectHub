import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectLink from "@/models/ProjectLink";

import { authOptions } from "@/lib/authOptions";

export async function DELETE(
  req,
  { params }
) {
  try {
    const {
      id,
      linkId,
    } = await params;

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

    const member =
      project.members.find(
        (m) =>
          String(m.user) ===
          String(session.user.id)
      );

    if (
      !member ||
      !["admin", "editor"].includes(
        member.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot delete links",
        },
        { status: 403 }
      );
    }

    const deleted =
      await ProjectLink.findOneAndDelete({
        _id: linkId,
        project: id,
      });

    if (!deleted) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE LINK ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete link",
      },
      { status: 500 }
    );
  }
}
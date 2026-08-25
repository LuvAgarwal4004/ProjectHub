import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectFile from "@/models/ProjectFile";

import { authOptions } from "@/lib/authOptions";
import {
  getProjectMember,
} from "@/lib/projectAccess";

export async function PATCH(
  req,
  { params }
) {
  try {
    const {
      id,
      fileId,
    } = await params;

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDb();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          error:
            "Project not found",
        },
        { status: 404 }
      );
    }

    const member =
      getProjectMember(
        project,
        session.user.id
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
            "Only admins and editors can clear errors.",
        },
        { status: 403 }
      );
    }

    if (
      project.status ===
      "closed"
    ) {
      return NextResponse.json(
        {
          error:
            "This project is closed.",
        },
        { status: 403 }
      );
    }

    const file =
      await ProjectFile.findOne({
        _id: fileId,
        project: id,
      });

    if (!file) {
      return NextResponse.json(
        {
          error:
            "File not found",
        },
        { status: 404 }
      );
    }

    file.hasError =
      false;

    file.errorDescription =
      "";

    file.errorLine =
      null;

    file.errorMarkedBy =
      null;

    file.errorMarkedAt =
      null;

    await file.save();

    return NextResponse.json({
      success: true,
      file,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }
}
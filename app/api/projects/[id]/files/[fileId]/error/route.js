import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectFile from "@/models/ProjectFile";

import { authOptions } from "@/lib/authOptions";
import { getProjectMember } from "@/lib/projectAccess";

export async function PATCH(req, { params }) {
  try {
    const { id, fileId } = await params;

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
      getProjectMember(
        project,
        session.user.id
      );

    if (
      !member ||
      !["admin", "editor"].includes(member.role)
    ) {
      return NextResponse.json(
        {
          error:
            "Only admins and editors can mark errors.",
        },
        { status: 403 }
      );
    }

    if (project.status === "closed") {
      return NextResponse.json(
        {
          error:
            "This project is closed.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const file =
      await ProjectFile.findOne({
        _id: fileId,
        project: id,
      });

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    if (!body.description?.trim()) {
      return NextResponse.json(
        {
          error:
            "Please describe the error.",
        },
        { status: 400 }
      );
    }

    let startLine =
      body.startLine === null ||
      body.startLine === undefined ||
      body.startLine === ""
        ? null
        : Number(body.startLine);

    let endLine =
      body.endLine === null ||
      body.endLine === undefined ||
      body.endLine === ""
        ? null
        : Number(body.endLine);

    if (
      startLine !== null &&
      (!Number.isInteger(startLine) ||
        startLine < 1)
    ) {
      return NextResponse.json(
        {
          error:
            "Start line must be a positive number.",
        },
        { status: 400 }
      );
    }

    if (
      endLine !== null &&
      (!Number.isInteger(endLine) ||
        endLine < 1)
    ) {
      return NextResponse.json(
        {
          error:
            "End line must be a positive number.",
        },
        { status: 400 }
      );
    }

    if (
      startLine !== null &&
      endLine !== null &&
      endLine < startLine
    ) {
      return NextResponse.json(
        {
          error:
            "End line cannot be before start line.",
        },
        { status: 400 }
      );
    }

    file.hasError = true;

    file.errorDescription =
      body.description.trim();

    file.errorStartLine =
      startLine;

    file.errorEndLine =
      endLine;

    file.errorMarkedBy =
      session.user.id;

    file.errorMarkedAt =
      new Date();

    await file.save();

    const populated =
      await ProjectFile.findById(
        file._id
      )
        .populate(
          "errorMarkedBy",
          "name email"
        )
        .populate(
          "lastFixedBy",
          "name email"
        )
        .lean();

    return NextResponse.json({
      success: true,
      file: populated,
    });
  } catch (error) {
    console.error(
      "MARK ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Could not mark error.",
      },
      { status: 500 }
    );
  }
}
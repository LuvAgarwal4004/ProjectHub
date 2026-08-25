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
            "Only admins and editors can mark errors.",
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

    const body =
      await req.json();

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

    if (
      !body.description?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Please describe the error.",
        },
        { status: 400 }
      );
    }

    const line =
      body.line === null ||
      body.line === undefined ||
      body.line === ""
        ? null
        : Number(body.line);

    file.hasError =
      true;

    file.errorDescription =
      body.description.trim();

    file.errorLine =
      Number.isInteger(line) &&
      line > 0
        ? line
        : null;

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
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }
}
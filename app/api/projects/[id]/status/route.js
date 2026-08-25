import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";
import {
  isProjectAdmin,
} from "@/lib/projectAccess";

export async function PATCH(
  req,
  { params }
) {
  try {
    const { id } =
      await params;

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

    if (
      !isProjectAdmin(
        project,
        session.user.id
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only admins can change project status.",
        },
        { status: 403 }
      );
    }

    const body =
      await req.json();

    const status =
      body.status;

    if (
      !["open", "closed"].includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid project status.",
        },
        { status: 400 }
      );
    }

    project.status =
      status;

    await project.save();

    return NextResponse.json({
      success: true,
      status:
        project.status,
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
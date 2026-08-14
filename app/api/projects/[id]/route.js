import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";


/* =========================
   UPDATE PROJECT
========================= */

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Only admins can edit project information
    const member = project.members.find(
      (m) =>
        String(m.user) === String(session.user.id)
    );

    if (!member || member.role !== "admin") {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const name = String(body.name || "").trim();
    const description = String(
      body.description || ""
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          error: "Project name is required",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Project name is too long",
        },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        {
          error: "Project description is too long",
        },
        { status: 400 }
      );
    }

    project.name = name;
    project.description = description;

    await project.save();

    return NextResponse.json({
      success: true,
      project: {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
      },
    });
  } catch (error) {
    console.error("UPDATE PROJECT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update project",
      },
      { status: 500 }
    );
  }
}


/* =========================
   DELETE PROJECT
========================= */

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDb();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Only admins can delete
    const member = project.members.find(
      (m) =>
        String(m.user) === String(session.user.id)
    );

    if (!member || member.role !== "admin") {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const confirmationName = String(
      body.projectName || ""
    ).trim();

    // Exact project-name confirmation
    if (confirmationName !== project.name) {
      return NextResponse.json(
        {
          error:
            "Project name does not match.",
        },
        { status: 400 }
      );
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
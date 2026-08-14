import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectTask from "@/models/ProjectTask";

import { authOptions } from "@/lib/authOptions";

async function getAdmin(projectId, userId) {
  const project = await Project.findById(projectId);

  if (!project) return null;

  const member = project.members.find(
    (m) => String(m.user) === String(userId)
  );

  if (!member || member.role !== "admin") {
    return null;
  }

  return project;
}

export async function PATCH(req, { params }) {
  try {
    const { id, taskId } = await params;

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
      await getAdmin(id, session.user.id);

    if (!project) {
      return NextResponse.json(
        { error: "Only the project admin can manage tasks" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const allowed = [
      "title",
      "assignees",
      "deadlineDate",
      "deadlineTime",
      "status",
      "priority",
    ];

    const update = {};

    for (const field of allowed) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    const task =
      await ProjectTask.findOneAndUpdate(
        {
          _id: taskId,
          project: id,
        },
        update,
        {
          new: true,
        }
      )
        .populate(
          "assignees",
          "name email image"
        )
        .lean();

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task,
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
    const { id, taskId } = await params;

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
      await getAdmin(id, session.user.id);

    if (!project) {
      return NextResponse.json(
        { error: "Only the project admin can delete tasks" },
        { status: 403 }
      );
    }

    const deleted =
      await ProjectTask.findOneAndDelete({
        _id: taskId,
        project: id,
      });

    if (!deleted) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

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
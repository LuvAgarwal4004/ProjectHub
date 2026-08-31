import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectTask from "@/models/ProjectTask";

import { authOptions } from "@/lib/authOptions";

async function getTaskManager(projectId, userId) {
  const project = await Project.findById(projectId);

  if (!project) {
    return null;
  }

  const member = project.members.find(
    (m) => String(m.user) === String(userId)
  );

  if (!member) {
    return null;
  }

  return {
    project,
    member,
  };
}

async function getAdmin(projectId, userId) {
  const project = await Project.findById(projectId);

  if (!project) {
    return null;
  }

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

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const membership = await getTaskManager(
      id,
      session.user.id
    );

    // -----------------------------------------
    // ONLY ADMIN + EDITOR CAN UPDATE TASKS
    // -----------------------------------------

    if (
      !membership ||
      !["admin", "editor"].includes(
        membership.member.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only project admins and editors can update tasks",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // CLOSED PROJECTS CANNOT BE EDITED
    // -----------------------------------------

    if (membership.project.status === "closed") {
      return NextResponse.json(
        {
          error: "This project is closed",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    // -----------------------------------------
    // VALIDATE STATUS
    // -----------------------------------------

    if (
      body.status !== undefined &&
      ![
        "todo",
        "in_progress",
        "pending",
        "completed",
      ].includes(body.status)
    ) {
      return NextResponse.json(
        {
          error: "Invalid task status",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // ALLOWED FIELDS
    // -----------------------------------------

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

    // -----------------------------------------
    // PRIORITY IS ADMIN-ONLY
    // -----------------------------------------

    if (
      update.priority !== undefined &&
      membership.member.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Only the project admin can change task priority",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // VALIDATE ASSIGNEES
    // -----------------------------------------

    if (update.assignees !== undefined) {
      const memberIds =
        membership.project.members.map(
          (member) => String(member.user)
        );

      update.assignees = Array.isArray(
        update.assignees
      )
        ? update.assignees.filter((userId) =>
            memberIds.includes(String(userId))
          )
        : [];
    }

    // -----------------------------------------
    // VALIDATE TITLE
    // -----------------------------------------

    if (update.title !== undefined) {
      update.title = String(update.title).trim();

      if (!update.title) {
        return NextResponse.json(
          {
            error: "Task title cannot be empty",
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------------------
    // FIND + UPDATE TASK
    // -----------------------------------------

    const task =
      await ProjectTask.findOneAndUpdate(
        {
          _id: taskId,
          project: id,
        },
        update,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "assignees",
          "name email image"
        )
        .populate(
          "createdBy",
          "name email image"
        )
        .lean();

    if (!task) {
      return NextResponse.json(
        {
          error: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(
      "UPDATE TASK ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update task",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id, taskId } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // -----------------------------------------
    // ONLY ADMIN CAN DELETE
    // -----------------------------------------

    const project = await getAdmin(
      id,
      session.user.id
    );

    if (!project) {
      return NextResponse.json(
        {
          error:
            "Only the project admin can delete tasks",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // CLOSED PROJECTS CANNOT BE MODIFIED
    // -----------------------------------------

    if (project.status === "closed") {
      return NextResponse.json(
        {
          error: "This project is closed",
        },
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
        {
          error: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE TASK ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to delete task",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectTask from "@/models/ProjectTask";

import { authOptions } from "@/lib/authOptions";

async function getMembership(projectId, userId) {
  const project = await Project.findById(projectId);

  if (!project) return null;

  const member = project.members.find(
    (m) => String(m.user) === String(userId)
  );

  if (!member) return null;

  return { project, member };
}

export async function GET(req, { params }) {
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

    const membership =
      await getMembership(id, session.user.id);

    if (!membership) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const tasks = await ProjectTask.find({
      project: id,
    })
      .populate(
        "assignees",
        "name email image"
      )
      .populate(
        "createdBy",
        "name email image"
      )
      .sort({
        priority: -1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

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

    const membership =
      await getMembership(id, session.user.id);

    if (!membership) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    if (membership.member.role !== "admin") {
      return NextResponse.json(
        { error: "Only the admin can create tasks" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    const task = await ProjectTask.create({
      project: id,
      title: body.title.trim(),
      assignees: body.assignees || [],
      deadlineDate: body.deadlineDate || "",
      deadlineTime: body.deadlineTime || "",
      status: body.status || "todo",
      priority: Boolean(body.priority),
      createdBy: session.user.id,
    });

    const populatedTask =
      await ProjectTask.findById(task._id)
        .populate(
          "assignees",
          "name email image"
        )
        .populate(
          "createdBy",
          "name email image"
        )
        .lean();

    return NextResponse.json({
      success: true,
      task: populatedTask,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
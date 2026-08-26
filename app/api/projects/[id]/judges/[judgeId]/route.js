import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import { authOptions } from "@/lib/authOptions";
import { canModifyOpenProject } from "@/lib/projectAccess";

export async function PATCH(req, { params }) {
  try {
    const { id, judgeId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!canModifyOpenProject(project, session.user.id)) {
      return NextResponse.json(
        { error: "You cannot edit judges on this project" },
        { status: 403 }
      );
    }

    const judge = project.judges.id(judgeId);
    if (!judge) {
      return NextResponse.json({ error: "Judge not found" }, { status: 404 });
    }

    const body = await req.json();

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json(
          { error: "Judge name cannot be empty" },
          { status: 400 }
        );
      }
      judge.name = body.name.trim();
    }

    if (body.designation !== undefined) judge.designation = body.designation.trim();
    if (body.organization !== undefined) judge.organization = body.organization.trim();
    if (body.email !== undefined) judge.email = body.email.trim();
    if (body.linkedIn !== undefined) judge.linkedIn = body.linkedIn.trim();
    if (body.score !== undefined) judge.score = body.score.trim();
    if (body.notes !== undefined) judge.notes = body.notes.trim();

    await project.save();

    return NextResponse.json({
      success: true,
      judge,
      judges: project.judges,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id, judgeId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!canModifyOpenProject(project, session.user.id)) {
      return NextResponse.json(
        { error: "You cannot delete judges from this project" },
        { status: 403 }
      );
    }

    project.judges.pull({ _id: judgeId });
    await project.save();

    return NextResponse.json({
      success: true,
      judges: project.judges,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

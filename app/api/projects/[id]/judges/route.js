import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import { authOptions } from "@/lib/authOptions";
import { canModifyOpenProject } from "@/lib/projectAccess";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
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
        { error: "You cannot add judges to this project" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Judge name is required" },
        { status: 400 }
      );
    }

    const newJudge = {
      name: body.name.trim(),
      designation: body.designation?.trim() || "",
      organization: body.organization?.trim() || "",
      email: body.email?.trim() || "",
      linkedIn: body.linkedIn?.trim() || "",
      score: body.score?.trim() || "",
      notes: body.notes?.trim() || "",
    };

    project.judges.push(newJudge);
    await project.save();

    const added = project.judges[project.judges.length - 1];

    return NextResponse.json({
      success: true,
      judge: added,
      judges: project.judges,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

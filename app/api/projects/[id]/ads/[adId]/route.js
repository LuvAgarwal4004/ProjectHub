import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import { authOptions } from "@/lib/authOptions";
import { canModifyOpenProject } from "@/lib/projectAccess";

export async function PATCH(req, { params }) {
  try {
    const { id, adId } = await params;
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
        { error: "You cannot edit sponsor/ads on this project" },
        { status: 403 }
      );
    }

    const ad = project.moneyStatus?.ads?.id(adId);
    if (!ad) {
      return NextResponse.json(
        { error: "Sponsor/Ad entry not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    if (body.name !== undefined) {
      if (!body.name.trim()) {
        return NextResponse.json(
          { error: "Partner name cannot be empty" },
          { status: 400 }
        );
      }
      ad.name = body.name.trim();
    }

    if (body.type !== undefined) ad.type = body.type.trim();
    if (body.amount !== undefined) ad.amount = Number(body.amount || 0);
    if (body.status !== undefined) ad.status = body.status;
    if (body.contact !== undefined) ad.contact = body.contact.trim();
    if (body.notes !== undefined) ad.notes = body.notes.trim();

    await project.save();

    return NextResponse.json({
      success: true,
      ad,
      moneyStatus: project.moneyStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id, adId } = await params;
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
        { error: "You cannot delete sponsor/ads from this project" },
        { status: 403 }
      );
    }

    project.moneyStatus?.ads?.pull({ _id: adId });
    await project.save();

    return NextResponse.json({
      success: true,
      moneyStatus: project.moneyStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectLink from "@/models/ProjectLink";

import { authOptions } from "@/lib/authOptions";

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

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const member = project.members.find(
      (m) =>
        String(m.user) ===
        String(session.user.id)
    );

    if (!member) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const links =
      await ProjectLink.find({
        project: id,
      })
        .populate(
          "addedBy",
          "name email image"
        )
        .sort({ createdAt: -1 })
        .lean();

    return NextResponse.json({
      success: true,
      links,
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

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const member = project.members.find(
      (m) =>
        String(m.user) ===
        String(session.user.id)
    );

    if (
      !member ||
      !["admin", "editor"].includes(member.role)
    ) {
      return NextResponse.json(
        { error: "You cannot add links" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (
      !body.title?.trim() ||
      !body.url?.trim()
    ) {
      return NextResponse.json(
        { error: "Title and URL are required" },
        { status: 400 }
      );
    }

    let url = body.url.trim();

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {
      url = `https://${url}`;
    }

    const link =
      await ProjectLink.create({
        project: id,
        title: body.title.trim(),
        url,
        description:
          body.description?.trim() || "",
        addedBy: session.user.id,
      });

    const populated =
      await ProjectLink.findById(link._id)
        .populate(
          "addedBy",
          "name email image"
        )
        .lean();

    return NextResponse.json({
      success: true,
      link: populated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
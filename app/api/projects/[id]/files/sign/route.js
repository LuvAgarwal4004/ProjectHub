import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import cloudinary from "@/lib/cloudinary";

import { authOptions } from "@/lib/authOptions";

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
        { error: "You cannot upload files" },
        { status: 403 }
      );
    }

    const timestamp =
      Math.round(new Date().getTime() / 1000);

    const folder = `projecthub/projects/${id}`;

    const signature =
      cloudinary.utils.api_sign_request(
        {
          timestamp,
          folder,
        },
        process.env.CLOUD_API_SECRET
      );

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUD_API_KEY,
      cloudName:
        process.env.CLOUD_CLOUD_NAME,
      folder,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
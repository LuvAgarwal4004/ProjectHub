import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import connectDb from "@/db/connectDb";
import ProjectFile from "@/models/ProjectFile";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";

export async function GET(req, { params }) {
  try {
    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fileId } = await params;

    await connectDb();

    const file =
      await ProjectFile.findById(fileId);

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const project =
      await Project.findById(file.project);

    const member =
      project.members.find(
        (m) =>
          m.user.toString() ===
          session.user.id
      );

    if (!member) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const signedUrl =
      cloudinary.utils.private_download_url(
        file.publicId,
        file.extension || "",
        {
          resource_type:
            file.resourceType || "raw",
        }
      );

    return NextResponse.redirect(
      signedUrl
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not download file." },
      { status: 500 }
    );
  }
}
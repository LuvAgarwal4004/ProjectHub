import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import ProjectFile from "@/models/ProjectFile";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req, { params }) {
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

    const member = project.members.find(
      (m) =>
        m.user.toString() === session.user.id
    );

    if (
      !member ||
      !["admin", "editor"].includes(member.role)
    ) {
      return NextResponse.json(
        { error: "You cannot delete this file." },
        { status: 403 }
      );
    }

    await cloudinary.uploader.destroy(
      file.publicId,
      {
        resource_type:
          file.resourceType || "raw",
      }
    );

    await ProjectFile.findByIdAndDelete(fileId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Could not delete file." },
      { status: 500 }
    );
  }
}
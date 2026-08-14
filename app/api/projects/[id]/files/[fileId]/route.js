import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectFile from "@/models/ProjectFile";
import cloudinary from "@/lib/cloudinary";

import { authOptions } from "@/lib/authOptions";

async function getMembership(
  projectId,
  userId
) {
  const project =
    await Project.findById(projectId);

  if (!project) {
    return null;
  }

  const member =
    project.members.find(
      (m) =>
        String(m.user) ===
        String(userId)
    );

  if (!member) {
    return null;
  }

  return {
    project,
    member,
  };
}

function getResourceType(file) {
  if (
    ["image", "raw", "video"].includes(
      file.resourceType
    )
  ) {
    return file.resourceType;
  }

  // Fallback for old records
  // that stored "auto".
  const url =
    file.url || "";

  if (
    url.includes("/raw/upload/")
  ) {
    return "raw";
  }

  if (
    url.includes("/video/upload/")
  ) {
    return "video";
  }

  return "image";
}

/* =========================
   PATCH
   ADMIN ONLY
========================= */

export async function PATCH(
  request,
  { params }
) {
  try {
    const { id, fileId } =
      await params;

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const membership =
      await getMembership(
        id,
        session.user.id
      );

    if (
      !membership ||
      membership.member.role !==
        "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Only the admin can edit file details",
        },
        { status: 403 }
      );
    }

    const body =
      await request.json();

    const name =
      body.name?.trim();

    const description =
      body.description?.trim() || "";

    if (!name) {
      return NextResponse.json(
        {
          error:
            "File name is required",
        },
        { status: 400 }
      );
    }

    const file =
      await ProjectFile.findOneAndUpdate(
        {
          _id: fileId,
          project: id,
        },
        {
          $set: {
            name,
            description,
          },
        },
        {
          new: true,
        }
      )
        .populate(
          "uploadedBy",
          "name email image"
        )
        .lean();

    if (!file) {
      return NextResponse.json(
        {
          error: "File not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      file,
    });
  } catch (error) {
    console.error(
      "EDIT FILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to edit file",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE
   ADMIN + EDITOR
========================= */

export async function DELETE(
  request,
  { params }
) {
  try {
    const { id, fileId } =
      await params;

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const membership =
      await getMembership(
        id,
        session.user.id
      );

    if (
      !membership ||
      !["admin", "editor"].includes(
        membership.member.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot delete files",
        },
        { status: 403 }
      );
    }

    const file =
      await ProjectFile.findOne({
        _id: fileId,
        project: id,
      });

    if (!file) {
      return NextResponse.json(
        {
          error: "File not found",
        },
        { status: 404 }
      );
    }

    const resourceType =
      getResourceType(file);

    try {
      await cloudinary.uploader.destroy(
        file.publicId,
        {
          resource_type:
            resourceType,
          type: "upload",
          invalidate: true,
        }
      );
    } catch (cloudinaryError) {
      console.error(
        "CLOUDINARY DELETE ERROR:",
        cloudinaryError
      );

      return NextResponse.json(
        {
          error:
            "Could not delete file from storage",
        },
        { status: 500 }
      );
    }

    await file.deleteOne();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE FILE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete file",
      },
      { status: 500 }
    );
  }
}
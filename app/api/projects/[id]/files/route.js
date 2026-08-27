import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectFile from "@/models/ProjectFile";

import { authOptions } from "@/lib/authOptions";
import {
  getProjectMember,
} from "@/lib/projectAccess";
const EDITABLE_EXTENSIONS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "css",
  "scss",
  "sass",
  "less",
  "html",
  "htm",
  "json",
  "md",
  "txt",
  "xml",
  "yml",
  "yaml",
  "py",
  "java",
  "c",
  "cpp",
  "h",
  "hpp",
  "cs",
  "php",
  "sql",
  "sh",
  "bash",
  "zsh",
  "env",
  "gitignore",
  "vue",
  "svelte",
  "go",
  "rs",
  "rb",
  "swift",
  "kt",
];

function isEditableFileName(name = "") {
  const cleanName =
    name
      .split("/")
      .pop()
      ?.toLowerCase() || "";

  if (
    cleanName === ".env" ||
    cleanName === ".gitignore"
  ) {
    return true;
  }

  const extension =
    cleanName
      .split(".")
      .pop();

  return EDITABLE_EXTENSIONS.includes(
    extension
  );
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

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const member =
      getProjectMember(
        project,
        session.user.id
      );

    if (!member) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    const files =
      await ProjectFile.find({
        project: id,
      })
        .populate(
          "uploadedBy",
          "name email image"
        )
        .populate(
          "errorMarkedBy",
          "name email"
        )
        .populate(
          "lastFixedBy",
          "name email"
        )
        .sort({ path: 1, createdAt: -1 })
        .lean();

    return NextResponse.json({
      success: true,
      files,
      projectStatus:
        project.status || "open",
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

    const member =
      getProjectMember(
        project,
        session.user.id
      );

    if (
      !member ||
      !["admin", "editor"].includes(
        member.role
      )
    ) {
      return NextResponse.json(
        { error: "You cannot upload files" },
        { status: 403 }
      );
    }

    /*
     * CLOSED PROJECT PROTECTION
     */
    if (project.status === "closed") {
      return NextResponse.json(
        {
          error:
            "This project is closed. An admin must reopen it before changes can be made.",
        },
        { status: 403 }
      );
    }

    const body =
      await req.json();

    if (
      !body.name?.trim() ||
      !body.url ||
      !body.publicId
    ) {
      return NextResponse.json(
        {
          error:
            "Missing file information",
        },
        { status: 400 }
      );
    }

    const file =
      await ProjectFile.create({
        project: id,

        name: body.name.trim(),

        originalName:
          body.originalName?.trim() ||
          body.name.trim(),

        /*
         * Store the complete relative path.
         */
        path:
          body.path?.trim() ||
          body.name.trim(),

        mimeType:
          body.mimeType ||
          "application/octet-stream",

        extension:
          body.extension || "",

        editable: isEditableFileName(
          body.name ||
          body.originalName ||
          ""
        ),

        description:
          body.description?.trim() || "",

        url: body.url,

        publicId: body.publicId,

        resourceType:
          ["image", "raw", "video"].includes(
            body.resourceType
          )
            ? body.resourceType
            : "raw",

        format:
          body.format || "",

        size:
          Number(body.size) || 0,

        uploadedBy:
          session.user.id,

        /*
         * Text/source files can be edited.
         */
        hasError: false,
        version: 1,
      });

    const populated =
      await ProjectFile.findById(
        file._id
      )
        .populate(
          "uploadedBy",
          "name email image"
        )
        .lean();

    return NextResponse.json({
      success: true,
      file: populated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
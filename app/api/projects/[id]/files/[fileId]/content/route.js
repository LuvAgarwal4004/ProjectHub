import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectFile from "@/models/ProjectFile";
import ProjectFileVersion from "@/models/ProjectFileVersion";

import { authOptions } from "@/lib/authOptions";
import {
  getProjectMember,
} from "@/lib/projectAccess";
const EDITABLE_EXTENSIONS = [
  "js", "jsx", "ts", "tsx", "css", "scss", "html", "json", "md", "txt",
  "xml", "yml", "yaml", "py", "java", "c", "cpp", "h", "hpp", "cs",
  "php", "sql", "sh", "bash", "env",
];

function isEditableFileName(name = "") {
  const extension = name.split(".").pop()?.toLowerCase();
  return EDITABLE_EXTENSIONS.includes(extension);
}
export async function GET(
  req,
  { params }
) {
  try {
    const {
      id,
      fileId,
    } = await params;

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDb();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          error:
            "Project not found",
        },
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
        {
          error:
            "Access denied",
        },
        { status: 403 }
      );
    }

    const file =
      await ProjectFile.findOne({
        _id: fileId,
        project: id,
      }).lean();

    if (!file) {
      return NextResponse.json(
        {
          error:
            "File not found",
        },
        { status: 404 }
      );
    }

    if (!isEditableFileName(file.path || file.name)) {
      return NextResponse.json(
        {
          error:
            "This file type cannot be edited.",
        },
        { status: 400 }
      );
    }

    const response =
      await fetch(file.url);

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Could not download file content.",
        },
        { status: 500 }
      );
    }

    const content =
      await response.text();

    return NextResponse.json({
      success: true,
      content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req,
  { params }
) {
  try {
    const {
      id,
      fileId,
    } = await params;

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDb();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          error:
            "Project not found",
        },
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
        {
          error:
            "Only admins and editors can edit files.",
        },
        { status: 403 }
      );
    }

    /*
     * CLOSED PROJECT PROTECTION
     */
    if (
      project.status ===
      "closed"
    ) {
      return NextResponse.json(
        {
          error:
            "This project is closed. An admin must reopen it before files can be changed.",
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
          error:
            "File not found",
        },
        { status: 404 }
      );
    }

    if (!isEditableFileName(file.path || file.name)) {
      return NextResponse.json(
        {
          error:
            "This file type cannot be edited.",
        },
        { status: 400 }
      );
    }

    const body =
      await req.json();

    const content =
      typeof body.content ===
        "string"
        ? body.content
        : null;

    if (
      content === null
    ) {
      return NextResponse.json(
        {
          error:
            "File content is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Get old content.
     */
    const oldResponse =
      await fetch(file.url);

    const oldContent =
      oldResponse.ok
        ? await oldResponse.text()
        : "";

    /*
     * Store old version.
     */
    await ProjectFileVersion.create(
      {
        file: file._id,
        project: id,
        version: file.version,
        content: oldContent,
        savedBy:
          session.user.id,
        note:
          body.note?.trim() ||
          "Previous version",
      }
    );

    /*
     * Upload the new source back
     * to Cloudinary.
     *
     * We use an authenticated server-side
     * upload here.
     */

    const cloudinary =
      (
        await import(
          "@/lib/cloudinary"
        )
      ).default;

    const result =
      await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                public_id:
                  file.publicId,
                resource_type:
                  "raw",
                overwrite:
                  true,
              },
              (
                error,
                result
              ) => {
                if (error)
                  reject(
                    error
                  );
                else
                  resolve(
                    result
                  );
              }
            );

          stream.end(
            Buffer.from(
              content,
              "utf8"
            )
          );
        }
      );

    file.url =
      result.secure_url ||
      file.url;

    file.size =
      Buffer.byteLength(
        content,
        "utf8"
      );

    file.version =
      (file.version || 1) + 1;

    file.lastFixedAt =
      new Date();

    file.lastFixedBy =
      session.user.id;

    file.fixNote =
      body.note?.trim() ||
      "";

    /*
     * Saving the file means
     * the previously marked error
     * has potentially been fixed.
     *
     * We don't automatically erase
     * the error. Instead we mark it
     * as fixed by clearing it only
     * when the editor explicitly
     * saves.
     */

    if (file.hasError) {
      file.hasError = false;
      file.errorDescription = "";
      file.errorLine = null;
      file.errorMarkedBy = null;
      file.errorMarkedAt = null;
    }

    await file.save();

    const populated =
      await ProjectFile.findById(
        file._id
      )
        .populate(
          "uploadedBy",
          "name email image"
        )
        .populate(
          "lastFixedBy",
          "name email"
        )
        .lean();

    return NextResponse.json({
      success: true,
      file: populated,
    });
  } catch (error) {
    console.error(
      "FILE SAVE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }
}
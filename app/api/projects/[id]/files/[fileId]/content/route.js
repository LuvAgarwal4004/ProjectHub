import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectFile from "@/models/ProjectFile";
import ProjectFileVersion from "@/models/ProjectFileVersion";

import { authOptions } from "@/lib/authOptions";
import { getProjectMember } from "@/lib/projectAccess";

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

function isEditableFile(file) {
  if (file.editable === true) {
    return true;
  }

  const name = file.name || "";

  const extension = name
    .split(".")
    .pop()
    ?.toLowerCase();

  return EDITABLE_EXTENSIONS.includes(
    extension
  );
}

/*
 * ============================================================
 * GET FILE CONTENT
 * ============================================================
 */

export async function GET(req, { params }) {
  try {
    const { id, fileId } = await params;

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDb();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
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
          error: "Access denied",
        },
        {
          status: 403,
        }
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
          error: "File not found",
        },
        {
          status: 404,
        }
      );
    }

    if (!isEditableFile(file)) {
      return NextResponse.json(
        {
          error:
            "This file type cannot be edited inside ProjectHub.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Download the current file from Cloudinary.
     */
    const response =
      await fetch(file.url, {
        cache: "no-store",
      });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Could not download file content from storage.",
        },
        {
          status: 500,
        }
      );
    }

    const content =
      await response.text();

    return NextResponse.json({
      success: true,
      content,
      file: {
        ...file,
        editable: true,
      },
    });
  } catch (error) {
    console.error(
      "GET FILE CONTENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Could not load file.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ============================================================
 * SAVE FILE
 * ============================================================
 */

export async function PATCH(req, { params }) {
  try {
    const { id, fileId } = await params;

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDb();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
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
        {
          status: 403,
        }
      );
    }

    /*
     * CLOSED PROJECT PROTECTION
     */
    if (project.status === "closed") {
      return NextResponse.json(
        {
          error:
            "This project is closed. An admin must reopen it before files can be changed.",
        },
        {
          status: 403,
        }
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
        {
          status: 404,
        }
      );
    }

    if (!isEditableFile(file)) {
      return NextResponse.json(
        {
          error:
            "This file type cannot be edited inside ProjectHub.",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await req.json();

    const content =
      typeof body.content === "string"
        ? body.content
        : null;

    if (content === null) {
      return NextResponse.json(
        {
          error:
            "File content is required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * GET CURRENT CONTENT
     * ============================================================
     */

    const oldResponse =
      await fetch(file.url, {
        cache: "no-store",
      });

    const oldContent =
      oldResponse.ok
        ? await oldResponse.text()
        : "";

    /*
     * ============================================================
     * SAVE OLD VERSION
     * ============================================================
     */

    await ProjectFileVersion.create({
      file: file._id,
      project: id,
      version: file.version,
      content: oldContent,
      savedBy: session.user.id,
      note:
        body.note?.trim() ||
        "Previous version",
    });

    /*
     * ============================================================
     * UPLOAD NEW CONTENT TO CLOUDINARY
     * ============================================================
     */

    const cloudinary =
      (
        await import("@/lib/cloudinary")
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
                overwrite: true,
                invalidate: true,
              },
              (
                error,
                result
              ) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
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

    /*
     * ============================================================
     * UPDATE DATABASE
     * ============================================================
     */

    file.url =
      result.secure_url ||
      file.url;

    file.size =
      Buffer.byteLength(
        content,
        "utf8"
      );

    file.editable = true;

    file.version =
      (file.version || 1) + 1;

    file.lastFixedAt =
      new Date();

    file.lastFixedBy =
      session.user.id;

    file.fixNote =
      body.note?.trim() || "";

    /*
     * IMPORTANT:
     *
     * Saving a file counts as fixing its
     * currently marked error.
     */
    if (file.hasError) {
      file.hasError = false;
      file.errorDescription = "";
      file.errorStartLine = null;
      file.errorEndLine = null;
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
          "errorMarkedBy",
          "name email"
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
          error.message ||
          "Could not save file.",
      },
      {
        status: 500,
      }
    );
  }
}
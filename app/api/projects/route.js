import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // 🔒 NEVER return project data without authentication
    if (!session?.user?.id) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDb();

    const projects = await Project.find({
      "members.user": session.user.id,
    })
      .populate("members.user", "name email image")
      .sort({ updatedAt: -1 })
      .lean();

    return Response.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("GET PROJECTS ERROR:", error);

    return Response.json(
      {
        error: "Failed to fetch projects",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    // 🔒 NEVER allow project creation without authentication
    if (!session?.user?.id) {
      return Response.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    await connectDb();

    const body = await req.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!name) {
      return Response.json(
        {
          error: "Project name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 100) {
      return Response.json(
        {
          error: "Project name is too long",
        },
        {
          status: 400,
        }
      );
    }

    if (description.length > 1000) {
      return Response.json(
        {
          error: "Project description is too long",
        },
        {
          status: 400,
        }
      );
    }

    const project = await Project.create({
      name,
      description,

      createdBy: session.user.id,

      members: [
        {
          user: session.user.id,
          role: "admin",
        },
      ],
    });

    return Response.json(
      {
        success: true,
        project: {
          id: project._id.toString(),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE PROJECT ERROR:", error);

    return Response.json(
      {
        error: "Failed to create project",
      },
      {
        status: 500,
      }
    );
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import { authOptions } from "@/lib/authOptions";
import { canModifyOpenProject } from "@/lib/projectAccess";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
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
        { error: "You cannot add certificates to this project" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: "Certificate title is required" },
        { status: 400 }
      );
    }

    let url = (body.url || "").trim();
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    const newCert = {
      title: body.title.trim(),
      recipient: body.recipient?.trim() || "",
      issuer: body.issuer?.trim() || "",
      issueDate: body.issueDate?.trim() || "",
      url,
      credentialId: body.credentialId?.trim() || "",
      notes: body.notes?.trim() || "",
    };

    project.certificates.push(newCert);
    await project.save();

    const added = project.certificates[project.certificates.length - 1];

    return NextResponse.json({
      success: true,
      certificate: added,
      certificates: project.certificates,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

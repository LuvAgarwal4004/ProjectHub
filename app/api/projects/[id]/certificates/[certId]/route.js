import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import { authOptions } from "@/lib/authOptions";
import { canModifyOpenProject } from "@/lib/projectAccess";

export async function PATCH(req, { params }) {
  try {
    const { id, certId } = await params;
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
        { error: "You cannot edit certificates on this project" },
        { status: 403 }
      );
    }

    const cert = project.certificates.id(certId);
    if (!cert) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    if (body.title !== undefined) {
      if (!body.title.trim()) {
        return NextResponse.json(
          { error: "Certificate title cannot be empty" },
          { status: 400 }
        );
      }
      cert.title = body.title.trim();
    }

    if (body.recipient !== undefined) cert.recipient = body.recipient.trim();
    if (body.issuer !== undefined) cert.issuer = body.issuer.trim();
    if (body.issueDate !== undefined) cert.issueDate = body.issueDate.trim();
    if (body.credentialId !== undefined) cert.credentialId = body.credentialId.trim();
    if (body.notes !== undefined) cert.notes = body.notes.trim();

    if (body.url !== undefined) {
      let url = body.url.trim();
      if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
      cert.url = url;
    }

    await project.save();

    return NextResponse.json({
      success: true,
      certificate: cert,
      certificates: project.certificates,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id, certId } = await params;
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
        { error: "You cannot delete certificates from this project" },
        { status: 403 }
      );
    }

    project.certificates.pull({ _id: certId });
    await project.save();

    return NextResponse.json({
      success: true,
      certificates: project.certificates,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

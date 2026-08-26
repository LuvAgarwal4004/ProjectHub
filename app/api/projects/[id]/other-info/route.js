import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import { authOptions } from "@/lib/authOptions";
import { canEditProject, getProjectMember } from "@/lib/projectAccess";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDb();
    const project = await Project.findById(id).lean();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const member = getProjectMember(project, session.user.id);
    if (!member) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      judges: project.judges || [],
      certificates: project.certificates || [],
      moneyStatus: project.moneyStatus || {
        currency: "$",
        prizeMoney: 0,
        receivedAmount: 0,
        payoutStatus: "pending",
        payoutMethod: "",
        notes: "",
        ads: [],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
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

    if (!canEditProject(project, session.user.id)) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 });
    }

    if (project.status === "closed") {
      return NextResponse.json(
        { error: "Project is closed and finalized" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (body.moneyStatus) {
      const ms = body.moneyStatus;
      project.moneyStatus = {
        currency: ms.currency || project.moneyStatus?.currency || "$",
        prizeMoney: Number(ms.prizeMoney ?? project.moneyStatus?.prizeMoney ?? 0),
        receivedAmount: Number(
          ms.receivedAmount ?? project.moneyStatus?.receivedAmount ?? 0
        ),
        payoutStatus: ms.payoutStatus || project.moneyStatus?.payoutStatus || "pending",
        payoutMethod: (ms.payoutMethod ?? project.moneyStatus?.payoutMethod ?? "").trim(),
        notes: (ms.notes ?? project.moneyStatus?.notes ?? "").trim(),
        ads: project.moneyStatus?.ads || [],
      };
    }

    await project.save();

    return NextResponse.json({
      success: true,
      judges: project.judges,
      certificates: project.certificates,
      moneyStatus: project.moneyStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

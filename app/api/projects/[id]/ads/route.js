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
        { error: "You cannot add sponsor/ads to this project" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Sponsor or Partner name is required" },
        { status: 400 }
      );
    }

    if (!project.moneyStatus) {
      project.moneyStatus = {
        currency: "$",
        prizeMoney: 0,
        receivedAmount: 0,
        payoutStatus: "pending",
        payoutMethod: "",
        notes: "",
        ads: [],
      };
    }

    const newAd = {
      name: body.name.trim(),
      type: body.type?.trim() || "Sponsorship",
      amount: Number(body.amount || 0),
      status: body.status || "confirmed",
      contact: body.contact?.trim() || "",
      notes: body.notes?.trim() || "",
    };

    project.moneyStatus.ads.push(newAd);
    await project.save();

    const added =
      project.moneyStatus.ads[project.moneyStatus.ads.length - 1];

    return NextResponse.json({
      success: true,
      ad: added,
      moneyStatus: project.moneyStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectFile from "@/models/ProjectFile";

import { authOptions } from "@/lib/authOptions";

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

        const member = project.members.find(
            (m) =>
                String(m.user) ===
                String(session.user.id)
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
                .sort({ createdAt: -1 })
                .lean();

        return NextResponse.json({
            success: true,
            files,
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

        const member = project.members.find(
            (m) =>
                String(m.user) ===
                String(session.user.id)
        );

        if (
            !member ||
            !["admin", "editor"].includes(member.role)
        ) {
            return NextResponse.json(
                { error: "You cannot upload files" },
                { status: 403 }
            );
        }

        const body = await req.json();

        if (
            !body.name?.trim() ||
            !body.url ||
            !body.publicId
        ) {
            return NextResponse.json(
                { error: "Missing file information" },
                { status: 400 }
            );
        }

        const file =
            await ProjectFile.create({
                project: id,
                name: body.name.trim(),
                description:
                    body.description?.trim() || "",
                url: body.url,
                publicId: body.publicId,
                resourceType:
                    ["image", "raw", "video"].includes(
                        body.resourceType
                    )
                        ? body.resourceType
                        : "image",
                format: body.format || "",
                size: body.size || 0,
                uploadedBy: session.user.id,
            });

        const populated =
            await ProjectFile.findById(file._id)
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
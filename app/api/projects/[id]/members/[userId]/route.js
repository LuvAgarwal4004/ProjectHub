import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/db/connectDb";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";

export async function PATCH(
  req,
  { params }
) {
  try {
    const { id, userId } =
      await params;

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const currentUser =
      project.members.find(
        (member) =>
          String(member.user) ===
          String(session.user.id)
      );

    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    if (
      String(userId) ===
      String(session.user.id)
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot change your own role.",
        },
        { status: 400 }
      );
    }

    const targetMember =
      project.members.find(
        (member) =>
          String(member.user) ===
          String(userId)
      );

    if (!targetMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const body =
      await req.json();

    const newRole =
      body.role;

    if (
      !["admin", "editor", "viewer"].includes(
        newRole
      )
    ) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // DON'T REMOVE THE LAST ADMIN
    // -----------------------------------------

    if (
      targetMember.role === "admin" &&
      newRole !== "admin"
    ) {
      const adminCount =
        project.members.filter(
          (member) =>
            member.role === "admin"
        ).length;

      if (adminCount <= 1) {
        return NextResponse.json(
          {
            error:
              "The project must always have at least one admin.",
          },
          { status: 400 }
        );
      }
    }

    targetMember.role =
      newRole;

    await project.save();

    return NextResponse.json({
      success: true,
      role: newRole,
    });
  } catch (error) {
    console.error(
      "CHANGE ROLE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to change role",
      },
      { status: 500 }
    );
  }
}

/* =========================================
   REMOVE MEMBER
========================================= */

export async function DELETE(
  req,
  { params }
) {
  try {
    const { id, userId } =
      await params;

    const session =
      await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const project =
      await Project.findById(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const currentUser =
      project.members.find(
        (member) =>
          String(member.user) ===
          String(session.user.id)
      );

    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Admin only" },
        { status: 403 }
      );
    }

    if (
      String(userId) ===
      String(session.user.id)
    ) {
      return NextResponse.json(
        {
          error:
            "You cannot remove yourself from the project.",
        },
        { status: 400 }
      );
    }

    const targetMember =
      project.members.find(
        (member) =>
          String(member.user) ===
          String(userId)
      );

    if (!targetMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // NEVER REMOVE AN ADMIN
    // -----------------------------------------

    if (
      targetMember.role === "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Change the admin's role before removing them.",
        },
        { status: 400 }
      );
    }

    project.members =
      project.members.filter(
        (member) =>
          String(member.user) !==
          String(userId)
      );

    await project.save();

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "REMOVE MEMBER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to remove member",
      },
      { status: 500 }
    );
  }
}
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

import { authOptions } from "@/lib/authOptions";

import ProjectSettings from "./ProjectSettings";

export default async function SettingsPage({
  params,
}) {
  const session =
    await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  await connectDb();

  const project =
    await Project.findById(id)
      .populate(
        "members.user",
        "name email image"
      )
      .lean();

  if (!project) {
    notFound();
  }

  const member =
    project.members.find(
      (m) =>
        String(m.user?._id) ===
        String(session.user.id)
    );

  if (!member || member.role !== "admin") {
    notFound();
  }

  return (
    <ProjectSettings
      project={JSON.parse(
        JSON.stringify(project)
      )}
    />
  );
}
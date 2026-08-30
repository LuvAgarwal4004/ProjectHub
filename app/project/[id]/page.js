import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";

import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import ProjectTask from "@/models/ProjectTask";
import ProjectFile from "@/models/ProjectFile";
import ProjectLink from "@/models/ProjectLink";

import { authOptions } from "@/lib/authOptions";
import ProjectWorkspace from "@/components/project/ProjectWorkspace";

export default async function ProjectPage({ params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  await connectDb();

  const [project, userProjects] = await Promise.all([
    Project.findById(id)
      .populate("members.user", "name email image")
      .populate("createdBy", "name email image")
      .lean(),
    Project.find({ "members.user": session.user.id })
      .select("name _id")
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  if (!project) {
    notFound();
  }

  const currentMember = project.members.find(
    (member) => String(member.user?._id) === String(session.user.id)
  );

  if (!currentMember) {
    notFound();
  }

  const [tasks, files, links] = await Promise.all([
    ProjectTask.find({ project: id })
      .populate("assignees", "name email image")
      .populate("createdBy", "name email image")
      .sort({ priority: -1, createdAt: -1 })
      .lean(),
    ProjectFile.find({ project: id })
      .populate("uploadedBy", "name email image")
      .sort({ createdAt: -1 })
      .lean(),
    ProjectLink.find({ project: id })
      .populate("addedBy", "name email image")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const serialise = (value) => JSON.parse(JSON.stringify(value));

  return (
    <ProjectWorkspace
      project={serialise(project)}
      userProjects={serialise(userProjects)}
      currentMember={serialise(currentMember)}
      tasks={serialise(tasks)}
      files={serialise(files)}
      links={serialise(links)}
    />
  );
}
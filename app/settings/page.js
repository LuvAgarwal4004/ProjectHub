import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";
import User from "@/models/User";
import AppShell from "@/components/layout/AppShell";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Account Settings — DEVHOUSE",
  description: "Manage your profile details, security, and account preferences.",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id && !session?.user?.email) {
    redirect("/login");
  }

  await connectDb();

  // Fetch user projects for AppShell sidebar
  const projects = await Project.find({
    "members.user": session.user.id,
  })
    .populate("members.user", "name email image")
    .sort({ updatedAt: -1 })
    .lean();

  const user = await User.findOne({
    $or: [{ _id: session.user.id }, { email: session.user.email }],
  })
    .select("-password")
    .lean();

  const serializedProjects = JSON.parse(JSON.stringify(projects));
  const serializedUser = JSON.parse(JSON.stringify(user || session.user));

  return (
    <AppShell projects={serializedProjects} title="Account Settings">
      <SettingsClient user={serializedUser} />
    </AppShell>
  );
}

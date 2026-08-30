import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/authOptions";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FolderKanban, ArrowRight, User, Users, Calendar } from "lucide-react";

export default async function DashboardPage() {
  // 🔒 SERVER-SIDE AUTHENTICATION CHECK
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  await connectDb();

  // 🔒 Only fetch projects where THIS USER is a member
  const projects = await Project.find({
    "members.user": session.user.id,
  })
    .populate("members.user", "name email image")
    .sort({ updatedAt: -1 })
    .lean();

  const serializedProjects = JSON.parse(JSON.stringify(projects));

  return (
    <AppShell
      projects={serializedProjects}
      title="Dashboard"
      topbarActions={
        <Link href="/dashboard/create">
          <Button size="sm" variant="primary" className="shadow-2xs">
            + New Project
          </Button>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[16px] p-6 shadow-2xs">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-accent-deep)]">
              Welcome Back
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] mt-1 tracking-tight">
              Hello, {session.user.name || "there"}
            </h1>
            <p className="text-xs sm:text-sm font-body text-[var(--color-ink-muted)] mt-1">
              Manage your projects, files, links, and team members in one place.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[12px] px-4 py-2.5 text-center">
              <p className="text-xl font-heading font-bold text-[var(--color-ink)]">
                {serializedProjects.length}
              </p>
              <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Projects
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-heading font-bold text-[var(--color-ink)]">
                Your Projects
              </h2>
              <p className="text-xs font-body text-[var(--color-ink-muted)]">
                Select a project to access its workspace, files, and links.
              </p>
            </div>
          </div>

          {serializedProjects.length === 0 ? (
            <EmptyProjects />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serializedProjects.map((project) => (
                <ProjectCard
                  key={project._id.toString()}
                  project={project}
                  userId={session.user.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ProjectCard({ project, userId }) {
  const currentMember = project.members?.find(
    (member) =>
      String(member.user?._id || member.user) === String(userId)
  );

  const admins = project.members?.filter((member) => member.role === "admin") || [];
  const adminNames = admins.map((member) => member.user?.name).filter(Boolean);
  const adminName = adminNames.length > 0 ? adminNames.join(", ") : "Unknown";
  const role = currentMember?.role || "viewer";

  return (
    <Link href={`/project/${project._id}`} className="group block h-full focus:outline-none">
      <Card
        hoverable
        className="h-full flex flex-col justify-between p-5 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[16px] transition-all duration-200 group-hover:border-[var(--color-accent)] group-hover:shadow-md group-focus:border-[var(--color-accent)]"
      >
        <div className="space-y-4">
          {/* Top Header: Folder Anchor & Status / Role Badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-deep)] shrink-0 shadow-2xs">
              <FolderKanban size={20} />
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Secondary Role Badge */}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-heading font-medium tracking-wider uppercase text-[var(--color-ink-muted)] bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
                {role}
              </span>

              {/* Status Badge as Clear Focal Point */}
              {project.deployedUrl ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-extrabold bg-[var(--color-accent)]/25 dark:bg-[var(--color-surface-muted)] text-[#14532D] dark:text-[#F7F7F4] border border-[#14532D]/30 dark:border-[var(--color-border)] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14532D] dark:bg-[var(--color-accent)] animate-pulse shrink-0" />
                  Live
                </span>
              ) : project.status === "closed" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink-soft)] shrink-0" />
                  Closed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)] shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] dark:bg-[var(--color-accent)] shrink-0" />
                  Active
                </span>
              )}
            </div>
          </div>

          {/* Project Title & Category / Metadata Chips */}
          <div>
            <h3 className="font-heading font-bold text-lg text-[var(--color-ink)] truncate group-hover:text-[var(--color-accent-deep)] transition">
              {project.name}
            </h3>

            {/* Category / Metadata Chips */}
            {(project.event || project.institution || project.prizeMoney) && (
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                {project.event && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-medium tracking-wider uppercase bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                    {project.event}
                  </span>
                )}
                {project.institution && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-medium tracking-wider uppercase bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                    {project.institution}
                  </span>
                )}
                {project.prizeMoney && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-medium tracking-wider uppercase bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
                    Prize: {project.prizeMoney}
                  </span>
                )}
              </div>
            )}

            <p className="mt-2 font-body text-xs text-[var(--color-ink-muted)] line-clamp-2 min-h-[32px] leading-relaxed">
              {project.description || "No description added yet."}
            </p>
          </div>
        </div>

        {/* Divider, Meta Rows with Leading Icons & Footer CTA */}
        <div className="pt-4 mt-4 border-t border-[var(--color-border)] space-y-2.5">
          {/* Admin Meta Row */}
          <div className="flex items-center justify-between text-xs font-body">
            <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
              <User size={14} className="shrink-0 text-[var(--color-ink-soft)]" />
              <span>Admin</span>
            </div>
            <span className="font-heading font-medium text-[var(--color-ink)] truncate max-w-[140px]">
              {adminName}
            </span>
          </div>

          {/* Members Meta Row */}
          <div className="flex items-center justify-between text-xs font-body">
            <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
              <Users size={14} className="shrink-0 text-[var(--color-ink-soft)]" />
              <span>Members</span>
            </div>
            <span className="font-heading font-semibold text-[var(--color-ink)]">
              {project.members?.length || 0}
            </span>
          </div>

          {/* Created Meta Row */}
          <div className="flex items-center justify-between text-xs font-body">
            <div className="flex items-center gap-2 text-[var(--color-ink-muted)]">
              <Calendar size={14} className="shrink-0 text-[var(--color-ink-soft)]" />
              <span>Created</span>
            </div>
            <span className="font-body text-[var(--color-ink)]">
              {formatDate(project.createdAt)}
            </span>
          </div>

          {/* Tightened Footer CTA */}
          <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[var(--color-accent-deep)] group-hover:text-[var(--color-accent-hover)] transition">
              <span>Open project</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 shrink-0" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function EmptyProjects() {
  return (
    <Card className="py-16 text-center border-dashed">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-deep)]">
        <FolderKanban size={32} />
      </div>
      <h3 className="mt-4 font-heading font-bold text-xl text-[var(--color-ink)]">
        No projects yet
      </h3>
      <p className="mx-auto mt-2 max-w-sm font-body text-xs text-[var(--color-ink-muted)] leading-relaxed">
        Create your first DEVHOUSE workspace to start storing files, links, and organizing team members.
      </p>
      <Link href="/dashboard/create" className="mt-6 inline-block">
        <Button variant="primary" size="md">
          + Create Your First Project
        </Button>
      </Link>
    </Card>
  );
}

function formatDate(date) {
  if (!date) return "Unknown";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
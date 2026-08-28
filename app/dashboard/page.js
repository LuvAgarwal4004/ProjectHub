import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/authOptions";
import connectDb from "@/db/connectDb";
import Project from "@/models/Project";

import DashboardUserMenu from "@/components/DashboardUserMenu";

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800">

      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <section className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

          {/* TOP ROW */}
          <div className="flex items-start justify-between gap-4">

            {/* LEFT SIDE */}
            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-600">
                ProjectHub
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Welcome back, {session.user.name || "there"} 👋
              </h1>

              <p className="mt-2 hidden text-sm text-slate-500 sm:block">
                Manage your projects and everything connected to them.
              </p>
            </div>

            {/* USER PROFILE */}
            <div className="shrink-0">
              <DashboardUserMenu user={session.user} />
            </div>

          </div>

          {/* MOBILE DESCRIPTION */}
          <p className="mt-3 text-sm text-slate-500 sm:hidden">
            Manage your projects and everything connected to them.
          </p>

        </div>
      </section>


      {/* ================================================== */}
      {/* DASHBOARD CONTENT */}
      {/* ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">

        {/* SECTION HEADER */}

        <div className="mb-8 flex items-end justify-between gap-4">

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 sm:text-sm">
              Your workspace
            </p>

            <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
              Your Projects
            </h2>
          </div>

          <div className="flex items-center gap-4">

            <p className="shrink-0 text-sm text-slate-500">
              {projects.length}{" "}
              {projects.length === 1
                ? "project"
                : "projects"}
            </p>

            <Link
              href="/dashboard/create"
              className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 hover:-translate-y-0.5"
            >
              + New Project
            </Link>

          </div>

        </div>


        {/* ================================================== */}
        {/* PROJECTS */}
        {/* ================================================== */}

        {projects.length === 0 ? (
          <EmptyProjects />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {projects.map((project) => (
              <ProjectCard
                key={project._id.toString()}
                project={project}
                userId={session.user.id}
              />
            ))}

          </div>
        )}

      </section>

    </main>
  );
}


/* ================================================== */
/* PROJECT CARD */
/* ================================================== */

function ProjectCard({ project, userId }) {
  const currentMember =
    project.members.find(
      (member) =>
        String(
          member.user?._id ||
          member.user
        ) === String(userId)
    );

  const admins = project.members.filter(
    (member) => member.role === "admin"
  );

  const adminNames = admins
    .map((member) => member.user?.name)
    .filter(Boolean);

  const adminName =
    adminNames.length > 0
      ? adminNames.join(", ")
      : "Unknown";

  const role =
    currentMember?.role || "viewer";

  return (
    <Link
      href={`/project/${project._id}`}
      className="group block"
    >
      <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50">

        {/* TOP */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            📁
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`
        rounded-full px-3 py-1 text-xs font-semibold capitalize
        ${role === "admin"
                  ? "bg-blue-100 text-blue-700"
                  : role === "editor"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }
      `}
            >
              {role}
            </span>

            {project.status === "closed" && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Fixed & Closed
              </span>
            )}
          </div>

        </div>


        {/* PROJECT NAME */}

        <h3 className="mt-6 truncate text-xl font-bold text-slate-900 transition group-hover:text-blue-600">
          {project.name}
        </h3>


        {/* DESCRIPTION */}

        <p className="mt-2 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-500">
          {project.description ||
            "No description added yet."}
        </p>
        {/* PROJECT METADATA */}

        {(
          project.event ||
          project.institution ||
          project.prizeMoney ||
          project.deployedUrl
        ) && (
            <div className="mt-5 grid grid-cols-2 gap-2">

              {project.event && (
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                    Event
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                    {project.event}
                  </p>
                </div>
              )}

              {project.institution && (
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Institution
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                    {project.institution}
                  </p>
                </div>
              )}

              {project.prizeMoney && (
                <div className="rounded-xl bg-amber-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Prize
                  </p>

                  <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                    {project.prizeMoney}
                  </p>
                </div>
              )}

              {project.deployedUrl && (
                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    Deployed
                  </p>

                  <span className="mt-1 block truncate text-xs font-semibold text-emerald-700">
                    Live →
                  </span>
                </div>
              )}

            </div>
          )}
        {/* OTHER INFO HIGHLIGHTS */}
        {(Number(project.moneyStatus?.prizeMoney || 0) > 0 ||
          (project.certificates?.length || 0) > 0 ||
          (project.judges?.length || 0) > 0) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Number(project.moneyStatus?.prizeMoney || 0) > 0 && (
                <span className="inline-flex items-center rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200/50">
                  💰 {project.moneyStatus?.currency || "$"}{Number(project.moneyStatus.prizeMoney).toLocaleString()}
                </span>
              )}
              {(project.certificates?.length || 0) > 0 && (
                <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200/50">
                  📜 {project.certificates.length} Cert{project.certificates.length === 1 ? "" : "s"}
                </span>
              )}
              {(project.judges?.length || 0) > 0 && (
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200/50">
                  👨‍⚖️ {project.judges.length} Judge{project.judges.length === 1 ? "" : "s"}
                </span>
              )}
            </div>
          )}


        {/* DETAILS */}

        <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Admin
            </span>

            <span className="max-w-[180px] truncate font-medium text-slate-700">
              {adminName}
            </span>
          </div>


          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Team members
            </span>

            <span className="font-semibold text-slate-700">
              {project.members.length}
            </span>
          </div>


          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Created
            </span>

            <span className="font-medium text-slate-700">
              {formatDate(project.createdAt)}
            </span>
          </div>

        </div>
        {project.deployedUrl && (
          <div className="mt-4">
            <span className="inline-flex items-center rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              🚀 Live deployment available
            </span>
          </div>
        )}

        {/* OPEN */}

        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-blue-600">
          <span>Open project</span>

          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>

      </div>
    </Link>
  );
}


/* ================================================== */
/* EMPTY STATE */
/* ================================================== */

function EmptyProjects() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center sm:py-20">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-4xl">
        📁
      </div>

      <h3 className="mt-6 text-2xl font-bold text-slate-900">
        No projects yet
      </h3>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        Create your first ProjectHub workspace and keep your
        files, links, information and team members together.
      </p>

      <Link
        href="/dashboard/create"
        className="mt-7 inline-flex rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        Create Your First Project →
      </Link>

    </div>
  );
}


/* ================================================== */
/* DATE */
/* ================================================== */

function formatDate(date) {
  if (!date) return "Unknown";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
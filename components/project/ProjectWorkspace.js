"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FileTree from "./FileTree";
import FileEditorModal from "./FileEditorModal";
import MarkErrorModal from "./MarkErrorModal";

import {
  ArrowLeft,
  Settings,
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  FileText,
  Link2,
  Users,
  Trash2,
  Download,
  ExternalLink,
  Star,
  Pencil,
  Award,
  Wallet,
  FileCheck,
  Sparkles,
} from "lucide-react";

import CreateTaskModal from "./CreateTaskModal";
import FileModal from "./FileModal";
import LinkModal from "./LinkModal";
import OtherInfoTab from "./OtherInfoTab";
// const EDITABLE_EXTENSIONS = [
//   "js", "jsx", "ts", "tsx", "css", "scss", "html", "json", "md", "txt",
//   "xml", "yml", "yaml", "py", "java", "c", "cpp", "h", "hpp", "cs",
//   "php", "sql", "sh", "bash", "env",
// ];

// function isEditableFileName(name = "") {
//   const extension = name.split(".").pop()?.toLowerCase();
//   return EDITABLE_EXTENSIONS.includes(extension);
// }

export default function ProjectWorkspace({
  project,
  tasks: initialTasks,
  files: initialFiles,
  links: initialLinks,
  currentMember,
}) {
  const router = useRouter();

  const [tab, setTab] =
    useState("overview");

  const [tasks, setTasks] =
    useState(initialTasks);

  const [files, setFiles] =
    useState(initialFiles);

  const [links, setLinks] =
    useState(initialLinks);

  const [taskModal, setTaskModal] =
    useState(false);

  const [fileModal, setFileModal] =
    useState(null);

  const [linkModal, setLinkModal] =
    useState(false);
  const [editorFile, setEditorFile] =
    useState(null);

  const [errorFile, setErrorFile] =
    useState(null);
  const isAdmin =
    currentMember.role === "admin";
  const isClosed =
    project.status === "closed";
  const canEditResources =
    !isClosed &&
    ["admin", "editor"].includes(
      currentMember.role
    );

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status === "completed"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status !== "completed"
    ).length;

  async function refresh() {
    router.refresh();
  }

  async function updateTask(
    taskId,
    update
  ) {
    const res = await fetch(
      `/api/projects/${project._id}/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(update),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error || "Update failed"
      );
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        String(task._id) ===
          String(taskId)
          ? data.task
          : task
      )
    );
  }

  const EDITABLE_EXTENSIONS = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "css",
    "scss",
    "sass",
    "less",
    "html",
    "htm",
    "json",
    "md",
    "txt",
    "xml",
    "yml",
    "yaml",
    "py",
    "java",
    "c",
    "cpp",
    "h",
    "hpp",
    "cs",
    "php",
    "sql",
    "sh",
    "bash",
    "zsh",
    "env",
    "gitignore",
    "vue",
    "svelte",
    "go",
    "rs",
    "rb",
    "swift",
    "kt",
  ];

  function isEditableFile(file) {
    if (file.editable === true) {
      return true;
    }

    const name =
      file.name || "";

    const cleanName =
      name
        .split("/")
        .pop()
        ?.toLowerCase() || "";

    if (
      cleanName === ".env" ||
      cleanName === ".gitignore"
    ) {
      return true;
    }

    const extension =
      cleanName
        .split(".")
        .pop();

    return EDITABLE_EXTENSIONS.includes(
      extension
    );
  }

  function openFile(file) {
    const canEdit =
      ["admin", "editor"].includes(
        currentMember.role
      );

    if (
      canEdit &&
      isEditableFile(file)
    ) {
      setEditorFile({
        ...file,
        editable: true,
      });

      return;
    }

    /*
     * Viewer or non-text file:
     * open normally.
     */
    window.open(
      file.url,
      "_blank",
      "noopener,noreferrer"
    );
  }
  async function deleteTask(taskId) {
    if (
      !confirm(
        "Delete this task?"
      )
    ) {
      return;
    }

    const res = await fetch(
      `/api/projects/${project._id}/tasks/${taskId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error || "Delete failed"
      );
      return;
    }

    setTasks((prev) =>
      prev.filter(
        (task) =>
          String(task._id) !==
          String(taskId)
      )
    );

    toast.success("Task deleted");
  }

  async function deleteFile(fileId) {
    if (
      !confirm(
        "Delete this file?"
      )
    ) {
      return;
    }

    const res = await fetch(
      `/api/projects/${project._id}/files/${fileId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error || "Delete failed"
      );
      return;
    }

    setFiles((prev) =>
      prev.filter(
        (file) =>
          String(file._id) !==
          String(fileId)
      )
    );

    toast.success("File deleted");
  }

  async function deleteLink(linkId) {
    if (
      !confirm(
        "Delete this link?"
      )
    ) {
      return;
    }

    const res = await fetch(
      `/api/projects/${project._id}/links/${linkId}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(
        data.error || "Delete failed"
      );
      return;
    }

    setLinks((prev) =>
      prev.filter(
        (link) =>
          String(link._id) !==
          String(linkId)
      )
    );

    toast.success("Link deleted");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800">
      {/* NAVBAR */}

      <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={18} />

            <span className="hidden sm:inline">
              Dashboard
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xl font-bold text-slate-900 sm:text-2xl"
          >
            Project
            <span className="text-blue-600">
              Hub
            </span>
          </Link>

          <button
            onClick={() => {
              setTab("otherInfo");
              const el = document.getElementById("project-workspace-tabs");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition sm:px-4 ${tab === "otherInfo"
              ? "border-blue-600 bg-blue-600 text-white shadow-sm"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/70 hover:text-blue-700"
              }`}
          >
            <Award size={16} />
            <span className="hidden sm:inline">Other Info</span>
            <span className="sm:hidden">Info</span>
            {(project.judges?.length || 0) +
              (project.certificates?.length || 0) +
              (project.moneyStatus?.ads?.length || 0) >
              0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[11px] font-bold ${tab === "otherInfo"
                    ? "bg-white text-blue-700"
                    : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {(project.judges?.length || 0) +
                    (project.certificates?.length || 0) +
                    (project.moneyStatus?.ads?.length || 0)}
                </span>
              )}
          </button>

          {isAdmin ? (
            <Link
              href={`/project/${project._id}/settings`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 sm:px-4"
            >
              <Settings size={16} />

              <span className="hidden sm:inline">
                Settings
              </span>
            </Link>
          ) : (
            <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-700">
              {currentMember.role}
            </div>
          )}
          {isAdmin && !isClosed && (
            <button
              onClick={async () => {
                const confirmed =
                  window.confirm(
                    "Are you sure you want to FIX & CLOSE this project?\n\nAfter closing, editors will no longer be able to upload, edit, delete or add anything."
                  );

                if (!confirmed) {
                  return;
                }

                try {
                  const res =
                    await fetch(
                      `/api/projects/${project._id}/status`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type":
                            "application/json",
                        },
                        body: JSON.stringify({
                          status:
                            "closed",
                        }),
                      }
                    );

                  const data =
                    await res.json();

                  if (!res.ok) {
                    throw new Error(
                      data.error ||
                      "Could not close project"
                    );
                  }

                  toast.success(
                    "Project fixed and closed"
                  );

                  router.refresh();
                } catch (error) {
                  toast.error(
                    error.message
                  );
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
            >
              <CheckCircle2
                size={16}
              />
              Fix & Close Project
            </button>
          )}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10">
        {/* HEADER */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Project
              </p>

              <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {project.name}
              </h1>

              <p className="mt-3 max-w-3xl break-words text-sm leading-7 text-slate-600 sm:text-base">
                {project.description ||
                  "No project description has been added yet."}
              </p>

              <p className="mt-5 text-sm text-slate-500">
                Admin:{" "}
                <span className="font-semibold text-slate-800">
                  {
                    project.members.find(
                      (member) =>
                        member.role ===
                        "admin"
                    )?.user?.name ||
                    project.createdBy?.name ||
                    "Unknown"
                  }
                </span>
              </p>
            </div>
          </div>
        </section>
        {isClosed && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={21}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div>
                <p className="font-bold text-green-800">
                  Project Fixed & Closed
                </p>

                <p className="mt-1 text-sm text-green-700">
                  This project has been finalized.
                  Editors can no longer modify files,
                  links, or team members.
                </p>
              </div>
            </div>
          </div>
        )}
        {isAdmin && isClosed && (
          <button
            onClick={async () => {
              const confirmed =
                window.confirm(
                  "Reopen this project? Editors will be allowed to make changes again."
                );

              if (!confirmed) {
                return;
              }

              try {
                const res =
                  await fetch(
                    `/api/projects/${project._id}/status`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type":
                          "application/json",
                      },
                      body: JSON.stringify({
                        status:
                          "open",
                      }),
                    }
                  );

                const data =
                  await res.json();

                if (!res.ok) {
                  throw new Error(
                    data.error ||
                    "Could not reopen project"
                  );
                }

                toast.success(
                  "Project reopened"
                );

                router.refresh();
              } catch (error) {
                toast.error(
                  error.message
                );
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-semibold text-green-700 hover:bg-green-50"
          >
            Reopen Project
          </button>
        )}
        {/* TASK STATS */}

        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TaskStat
            icon={
              <ListTodo size={20} />
            }
            label="Tasks"
            value={totalTasks}
          />

          <TaskStat
            icon={
              <CheckCircle2 size={20} />
            }
            label="Completed"
            value={completedTasks}
          />

          <TaskStat
            icon={<Clock3 size={20} />}
            label="Pending"
            value={pendingTasks}
          />
        </section>

        {/* TASKS */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tasks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track work, deadlines and priorities.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() =>
                  setTaskModal(true)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                <Plus size={17} />
                Create Task
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ListTodo size={25} />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  No tasks yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first task for this project.
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  isAdmin={isAdmin}
                  onStatusChange={(status) =>
                    updateTask(
                      task._id,
                      { status }
                    )
                  }
                  onPriority={() =>
                    updateTask(
                      task._id,
                      {
                        priority:
                          !task.priority,
                      }
                    )
                  }
                  onDelete={() =>
                    deleteTask(task._id)
                  }
                />
              ))
            )}
          </div>
        </section>

        {/* TABS */}

        <section id="project-workspace-tabs" className="mt-8">
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
              <Tab
                active={
                  tab === "overview"
                }
                onClick={() =>
                  setTab("overview")
                }
                icon={
                  <FileText size={17} />
                }
                label="Overview"
              />

              <Tab
                active={
                  tab === "files"
                }
                onClick={() =>
                  setTab("files")
                }
                icon={
                  <FileText size={17} />
                }
                label={`Files (${files.length})`}
              />

              <Tab
                active={
                  tab === "links"
                }
                onClick={() =>
                  setTab("links")
                }
                icon={
                  <Link2 size={17} />
                }
                label={`Links (${links.length})`}
              />

              <Tab
                active={
                  tab === "team"
                }
                onClick={() =>
                  setTab("team")
                }
                icon={
                  <Users size={17} />
                }
                label={`Team (${project.members.length})`}
              />

              <Tab
                active={
                  tab === "otherInfo"
                }
                onClick={() =>
                  setTab("otherInfo")
                }
                icon={
                  <Award size={17} />
                }
                label={`Other Info (${(project.judges?.length || 0) +
                  (project.certificates?.length || 0) +
                  (project.moneyStatus?.ads?.length || 0)
                  })`}
              />
            </div>
          </div>

          <div className="mt-5">
            {tab === "overview" && (
              <Overview
                project={project}
                tasks={tasks}
                files={files}
                links={links}
                onSelectTab={setTab}
              />
            )}

            {tab === "files" && (
              <FilesTab
                files={files}
                isAdmin={isAdmin}
                canEditResources={
                  canEditResources
                }
                onUpload={() =>
                  setFileModal("create")
                }
                onEdit={openFile}
                onDelete={deleteFile}
                onMarkError={(file) =>
                  setErrorFile(file)
                }
              />
            )}

            {tab === "links" && (
              <LinksTab
                links={links}
                canEditResources={
                  canEditResources
                }
                onCreate={() =>
                  setLinkModal(true)
                }
                onDelete={deleteLink}
              />
            )}

            {tab === "team" && (
              <TeamTab
                members={project.members}
              />
            )}

            {tab === "otherInfo" && (
              <OtherInfoTab
                project={project}
                canEditResources={canEditResources}
                isAdmin={isAdmin}
                onProjectUpdated={refresh}
              />
            )}
          </div>
        </section>
      </div>

      {taskModal && (
        <CreateTaskModal
          project={project}
          onClose={() =>
            setTaskModal(false)
          }
          onCreated={(task) => {
            setTasks((prev) => [
              task,
              ...prev,
            ]);

            setTaskModal(false);
            toast.success(
              "Task created"
            );
          }}
        />
      )}

      {fileModal && (
        <FileModal
          project={project}
          file={
            fileModal === "create"
              ? null
              : fileModal
          }
          onClose={() =>
            setFileModal(null)
          }
          onCreated={(file) => {
            setFiles((prev) => [
              file,
              ...prev,
            ]);

            setFileModal(null);
            toast.success(
              "File uploaded"
            );
          }}
          onUpdated={(file) => {
            setFiles((prev) =>
              prev.map((item) =>
                String(item._id) ===
                  String(file._id)
                  ? file
                  : item
              )
            );

            setFileModal(null);
            toast.success(
              "File updated"
            );
          }}
        />
      )}

      {linkModal && (
        <LinkModal
          project={project}
          onClose={() =>
            setLinkModal(false)
          }
          onCreated={(link) => {
            setLinks((prev) => [
              link,
              ...prev,
            ]);

            setLinkModal(false);
            toast.success(
              "Link added"
            );
          }}
        />
      )}
      {editorFile && (
  <FileEditorModal
    project={project}
    file={editorFile}
    onClose={() =>
      setEditorFile(null)
    }
    onUpdated={(
      updatedFile,
      options = {}
    ) => {
      setFiles((prev) =>
        prev.map((item) =>
          String(item._id) ===
            String(updatedFile._id)
            ? updatedFile
            : item
        )
      );

      setEditorFile(
        updatedFile
      );

      if (!options.keepOpen) {
        setEditorFile(null);

        toast.success(
          "File saved successfully"
        );
      } else {
        toast.success(
          "Error marked"
        );
      }
    }}
  />
)}

      {errorFile && (
        <MarkErrorModal
          project={project}
          file={errorFile}
          onClose={() =>
            setErrorFile(null)
          }
          onUpdated={(updatedFile) => {
            setFiles((prev) =>
              prev.map((item) =>
                String(item._id) ===
                  String(updatedFile._id)
                  ? updatedFile
                  : item
              )
            );

            toast.success(
              "Error marked"
            );
          }}
        />
      )}
    </main>
  );
}

function TaskStat({
  icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-700">
        {label}
      </p>
    </div>
  );
}

function TaskRow({
  task,
  isAdmin,
  onStatusChange,
  onPriority,
  onDelete,
}) {
  const assignee =
    task.assignees?.[0];

  return (
    <div className="p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-slate-300">
            {task.status ===
              "completed" && (
                <CheckCircle2
                  size={14}
                  className="text-green-600"
                />
              )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`break-words font-semibold ${task.status ===
                  "completed"
                  ? "text-slate-400 line-through"
                  : "text-slate-900"
                  }`}
              >
                {task.title}
              </h3>

              {task.priority && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                  <Star
                    size={11}
                    fill="currentColor"
                  />
                  Priority
                </span>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
              <span>
                {assignee?.name ||
                  "Unassigned"}
              </span>

              {task.deadlineDate && (
                <span>
                  Due{" "}
                  {task.deadlineDate}
                  {task.deadlineTime
                    ? ` · ${task.deadlineTime}`
                    : ""}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <>
              <select
                value={task.status}
                onChange={(e) =>
                  onStatusChange(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-blue-500"
              >
                <option value="todo">
                  To-do
                </option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="pending">
                  Pending
                </option>
                <option value="completed">
                  Completed
                </option>
              </select>

              <button
                onClick={onPriority}
                title="Toggle priority"
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
              >
                <Star
                  size={16}
                  fill={
                    task.priority
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              <button
                onClick={onDelete}
                className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
              >
                <Trash2
                  size={16}
                />
              </button>
            </>
          ) : (
            <StatusBadge
              status={task.status}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}) {
  const labels = {
    todo: "To-do",
    in_progress: "In Progress",
    pending: "Pending",
    completed: "Completed",
  };

  return (
    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
      {labels[status] ||
        status}
    </span>
  );
}

function Tab({
  active,
  onClick,
  icon,
  label,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active
        ? "bg-blue-600 text-white"
        : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Overview({
  project,
  tasks,
  files,
  links,
  onSelectTab,
}) {
  const judgesCount = project.judges?.length || 0;
  const certsCount = project.certificates?.length || 0;
  const currency = project.moneyStatus?.currency || "$";
  const prizeMoney = Number(project.moneyStatus?.prizeMoney || 0);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Project Overview
          </h2>
          {onSelectTab && (
            <button
              onClick={() => onSelectTab("otherInfo")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Award size={13} />
              View Other Info →
            </button>
          )}
        </div>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {project.description ||
            "No description available."}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Info
            label="Created By"
            value={
              project.createdBy
                ?.name || "Unknown"
            }
          />

          <Info
            label="Members"
            value={
              project.members.length
            }
          />

          <Info
            label="Files & Links"
            value={`${files.length} files · ${links.length} links`}
          />

          <Info
            label="Judges"
            value={`${judgesCount} evaluator${judgesCount === 1 ? "" : "s"}`}
          />

          <Info
            label="Certificates"
            value={`${certsCount} stored`}
          />

          <Info
            label="Prize / Grant"
            value={`${currency}${prizeMoney.toLocaleString()}`}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-slate-900">
          Task Progress
        </h2>

        <div className="mt-6">
          <div className="flex items-end justify-between">
            <span className="text-sm text-slate-500">
              Completed
            </span>

            <span className="font-bold text-slate-900">
              {
                tasks.filter(
                  (task) =>
                    task.status ===
                    "completed"
                ).length
              }
              /{tasks.length}
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                width: `${tasks.length
                  ? (tasks.filter(
                    (task) =>
                      task.status ===
                      "completed"
                  ).length /
                    tasks.length) *
                  100
                  : 0
                  }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function FilesTab({
  files,
  isAdmin,
  canEditResources,
  onUpload,
  onEdit,
  onDelete,
  onMarkError,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Project Files
          </h2>

          <p className="mt-1 text-sm text-slate-500">
             Browse, edit, review and manage project files.
          </p>
        </div>

        {canEditResources && (
          <button
            onClick={onUpload}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Upload
          </button>
        )}
      </div>

      <div className="mt-6">
        {files.length === 0 ? (
          <Empty
            icon={<FileText size={24} />}
            text="No files yet"
          />
        ) : (
          <FileTree
            files={files}
            onOpenFile={(file) =>
              onEdit(file)
            }
            onMarkError={onMarkError}
            canMarkErrors={canEditResources}
          />
        )}
      </div>

      {/* ERROR FILE LIST */}

      {files.some(
        (file) => file.hasError
      ) && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="font-bold text-red-700">
              Files requiring attention
            </p>

            <div className="mt-3 space-y-2">
              {files
                .filter(
                  (file) =>
                    file.hasError
                )
                .map((file) => (
                  <div
                    key={file._id}
                    className="flex flex-col gap-2 rounded-xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {file.path ||
                          file.name}
                      </p>

                      {file.errorLine && (
                        <p className="text-xs font-semibold text-red-500">
                          Line{" "}
                          {
                            file.errorLine
                          }
                        </p>
                      )}

                      <p className="mt-1 text-xs text-slate-500">
                        {
                          file.errorDescription
                        }
                      </p>
                    </div>

                    {canEditResources && (
                      <button
                        onClick={() =>
                          onMarkError(
                            file
                          )
                        }
                        className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Update Error
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
}

function LinksTab({
  links,
  canEditResources,
  onCreate,
  onDelete,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Links
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Important URLs for the project.
          </p>
        </div>

        {canEditResources && (
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Link
          </button>
        )}
      </div>

      <div className="mt-6 grid gap-3">
        {links.length === 0 ? (
          <Empty
            icon={<Link2 size={24} />}
            text="No links yet"
          />
        ) : (
          links.map((link) => (
            <div
              key={link._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Link2
                    size={20}
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-slate-900">
                    {link.title}
                  </h3>

                  {link.description && (
                    <p className="mt-1 break-words text-sm text-slate-500">
                      {link.description}
                    </p>
                  )}

                  <p className="mt-1 break-all text-xs text-blue-600">
                    {link.url}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink
                    size={14}
                  />
                  Open
                </a>

                {canEditResources && (
                  <button
                    onClick={() =>
                      onDelete(
                        link._id
                      )
                    }
                    className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2
                      size={15}
                    />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TeamTab({
  members,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-slate-900">
        Team
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Everyone who has access to this project.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {members.map((member) => (
          <div
            key={member.user._id}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex min-w-0 items-center gap-3">
              {member.user.image ? (
                <img
                  src={member.user.image}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {member.user.name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "U"}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">
                  {member.user.name}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {member.user.email}
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty({
  icon,
  text,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        {icon}
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-500">
        {text}
      </p>
    </div>
  );
}
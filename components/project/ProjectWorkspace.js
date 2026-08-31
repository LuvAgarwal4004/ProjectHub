"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FileTree from "./FileTree";
import FileEditorModal from "./FileEditorModal";
import MarkErrorModal from "./MarkErrorModal";
import ProjectAI from "@/app/project/[id]/ProjectAI";
import TaskDetailsModal from "./TaskDetailsModal";
import {
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
  Pencil,
  Award,
  Sparkles,
  Trophy,
  Building,
} from "lucide-react";

import CreateTaskModal from "./CreateTaskModal";
import FileModal from "./FileModal";
import LinkModal from "./LinkModal";
import OtherInfoTab from "./OtherInfoTab";

import AppShell from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function ProjectWorkspace({
  project,
  userProjects = [],
  tasks: initialTasks,
  files: initialFiles,
  links: initialLinks,
  currentMember,
}) {
  const router = useRouter();

  const [tab, setTab] = useState("overview");
  const [tasks, setTasks] = useState(() =>
    sortTasks(initialTasks)
  );
  const [files, setFiles] = useState(initialFiles);
  const [links, setLinks] = useState(initialLinks);

  const [taskModal, setTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [fileModal, setFileModal] = useState(null);
  const [linkModal, setLinkModal] = useState(false);
  const [editorFile, setEditorFile] = useState(null);
  const [errorFile, setErrorFile] = useState(null);

  const isAdmin = currentMember.role === "admin";
  const isEditor = currentMember.role === "editor";
  const isViewer = currentMember.role === "viewer";

  const isClosed = project.status === "closed";

  const canManageTasks =
    !isClosed && (isAdmin || isEditor);

  const canCreateTasks =
    !isClosed && isAdmin;

  const canDeleteTasks =
    !isClosed && isAdmin;

  const canEditResources =
    !isClosed && (isAdmin || isEditor);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status !== "completed").length;
  function sortTasks(taskList) {
    return [...taskList].sort((a, b) => {
      // Priority tasks always come first
      if (Boolean(a.priority) !== Boolean(b.priority)) {
        return a.priority ? -1 : 1;
      }

      // Within the same priority group,
      // newest tasks come first
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }

  async function updateTask(taskId, update) {
    const res = await fetch(`/api/projects/${project._id}/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Update failed");
      return;
    }

    setTasks((prev) =>
      sortTasks(
        prev.map((task) =>
          String(task._id) === String(taskId)
            ? data.task
            : task
        )
      )
    );
  }
  async function changeMemberRole(userId, role) {
    const res = await fetch(`/api/projects/${project._id}/members/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not change role");
      return;
    }
    toast.success("Role updated");
    router.refresh();
  }

  async function removeMember(userId) {
    if (!confirm("Remove this member from the project?")) return;
    const res = await fetch(`/api/projects/${project._id}/members/${userId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not remove member");
      return;
    }
    toast.success("Member removed");
    router.refresh();
  }
  const EDITABLE_EXTENSIONS = [
    "js", "jsx", "ts", "tsx", "css", "scss", "sass", "less", "html", "htm",
    "json", "md", "txt", "xml", "yml", "yaml", "py", "java", "c", "cpp",
    "h", "hpp", "cs", "php", "sql", "sh", "bash", "zsh", "env", "gitignore",
    "vue", "svelte", "go", "rs", "rb", "swift", "kt",
  ];

  function isEditableFile(file) {
    if (file.editable === true) return true;
    const name = file.name || "";
    const cleanName = name.split("/").pop()?.toLowerCase() || "";
    if (cleanName === ".env" || cleanName === ".gitignore") return true;
    const extension = cleanName.split(".").pop();
    return EDITABLE_EXTENSIONS.includes(extension);
  }

  function openFile(file) {
    const canEdit = ["admin", "editor"].includes(currentMember.role);
    if (canEdit && isEditableFile(file)) {
      setEditorFile({ ...file, editable: true });
      return;
    }
    window.open(file.url, "_blank", "noopener,noreferrer");
  }

  async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;
    const res = await fetch(`/api/projects/${project._id}/tasks/${taskId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Delete failed");
      return;
    }
    setTasks((prev) => prev.filter((task) => String(task._id) !== String(taskId)));
    toast.success("Task deleted");
  }

  async function deleteFile(fileId) {
    if (!confirm("Delete this file?")) return;
    const res = await fetch(`/api/projects/${project._id}/files/${fileId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Delete failed");
      return;
    }
    setFiles((prev) => prev.filter((file) => String(file._id) !== String(fileId)));
    toast.success("File deleted");
  }

  async function deleteLink(linkId) {
    if (!confirm("Delete this link?")) return;
    const res = await fetch(`/api/projects/${project._id}/links/${linkId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Delete failed");
      return;
    }
    setLinks((prev) => prev.filter((link) => String(link._id) !== String(linkId)));
    toast.success("Link deleted");
  }

  const tabList = [
    { id: "overview", label: "Overview", icon: <ListTodo size={14} /> },
    { id: "files", label: `Files (${files.length})`, icon: <FileText size={14} /> },
    { id: "links", label: `Links (${links.length})`, icon: <Link2 size={14} /> },
    { id: "ai", label: "AI Assistant", icon: <Sparkles size={14} /> },
    { id: "members", label: `Members (${project.members?.length || 0})`, icon: <Users size={14} /> },
    {
      id: "otherInfo",
      label: "Other Info",
      icon: <Award size={14} />,
      badge: (project.judges?.length || 0) + (project.certificates?.length || 0) + (project.moneyStatus?.ads?.length || 0),
    },
  ];

  const topbarActions = (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Link href={`/project/${project._id}/settings`}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Settings size={14} />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </Link>
      )}

      {isAdmin && !isClosed && (
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            if (!window.confirm("Are you sure you want to FIX & CLOSE this project?")) return;
            try {
              const res = await fetch(`/api/projects/${project._id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "closed" }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Could not close project");
              toast.success("Project fixed and closed");
              router.refresh();
            } catch (err) {
              toast.error(err.message);
            }
          }}
          className="gap-1.5 text-[var(--color-accent-deep)] hover:text-[var(--color-accent-deep)] border-[var(--color-border)]"
        >
          <CheckCircle2 size={14} className="text-[var(--color-accent-deep)] shrink-0" />
          <span className="hidden sm:inline font-bold">Fix & Close</span>
        </Button>
      )}

      {isAdmin && isClosed && (
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            if (!window.confirm("Reopen this project? Members will be able to make changes again.")) return;
            try {
              const res = await fetch(`/api/projects/${project._id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "open" }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Could not reopen project");
              toast.success("Project reopened");
              router.refresh();
            } catch (err) {
              toast.error(err.message);
            }
          }}
          className="gap-1.5"
        >
          <Clock3 size={14} className="shrink-0" />
          <span className="hidden sm:inline font-bold">Reopen Project</span>
        </Button>
      )}
    </div>
  );

  return (
    <AppShell
      projects={userProjects}
      currentProjectId={project._id}
      title={project.name}
      topbarActions={topbarActions}
    >
      <div className="space-y-6">
        {/* Project Banner Header */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-accent-deep)]">
                  Project Workspace
                </span>
                <Badge role={currentMember.role} />
                {isClosed && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-[var(--color-accent)]/15 dark:bg-[var(--color-surface-muted)] text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 dark:border-[var(--color-border)]">
                    <CheckCircle2 size={11} className="text-[var(--color-accent-deep)] shrink-0" />
                    <span>Fixed & Closed</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] tracking-tight">
                {project.name}
              </h1>

              <p className="font-body text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed max-w-3xl">
                {project.description || "No description provided for this project."}
              </p>

              {/* Metadata Pills */}
              <div className="flex items-center gap-3 flex-wrap pt-1">
                {project.deployedUrl && (
                  <a
                    href={project.deployedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-medium bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 hover:bg-[var(--color-accent)]/30 transition"
                  >
                    <span>Live Demo</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {project.event && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body bg-[var(--color-surface-muted)] text-[var(--color-ink)] border border-[var(--color-border)]">
                    <Trophy size={12} className="text-[var(--color-accent-deep)]" />
                    <span>{project.event}</span>
                  </span>
                )}
                {project.institution && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body bg-[var(--color-surface-muted)] text-[var(--color-ink)] border border-[var(--color-border)]">
                    <Building size={12} className="text-[var(--color-ink-muted)]" />
                    <span>{project.institution}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            {canEditResources && (
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Button size="sm" variant="primary" onClick={() => setFileModal("upload")}>
                  + Upload File
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setLinkModal(true)}>
                  + Add Link
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Tab Navigation */}
        <div id="project-workspace-tabs" className="flex items-center gap-1.5 border-b border-[var(--color-border)] pb-2 overflow-x-auto">
          {tabList.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-heading whitespace-nowrap transition ${tab === t.id
                ? "bg-[var(--color-accent)] text-[#0B0B0A] font-bold shadow-xs"
                : "font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
                }`}
            >
              {t.icon}
              <span>{t.label}</span>
              {t.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${tab === t.id ? "bg-[#0B0B0A] text-[var(--color-accent)]" : "bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)]"
                  }`}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}

        {/* 1. OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Total Tasks
                </p>
                <p className="text-2xl font-heading font-bold text-[var(--color-ink)] mt-1">{totalTasks}</p>
              </Card>

              <Card className="p-4">
                <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Completed
                </p>
                <p className="text-2xl font-heading font-bold text-[var(--color-accent-deep)] mt-1">{completedTasks}</p>
              </Card>

              <Card className="p-4">
                <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Pending
                </p>
                <p className="text-2xl font-heading font-bold text-[var(--color-warning)] mt-1">{pendingTasks}</p>
              </Card>

              <Card className="p-4">
                <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Total Files
                </p>
                <p className="text-2xl font-heading font-bold text-[var(--color-ink)] mt-1">{files.length}</p>
              </Card>
            </div>

            {/* Task Section */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-base text-[var(--color-ink)]">Project Tasks</h3>
                {canCreateTasks && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setTaskModal(true)}
                  >
                    + Add Task
                  </Button>
                )}
              </div>

              {tasks.length === 0 ? (
                <p className="text-xs font-body text-[var(--color-ink-muted)] py-4 text-center">No tasks added yet.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => setSelectedTask(task)}
                      className={`group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-[10px] border text-xs font-body cursor-pointer transition ${task.priority
                        ? "border-[var(--color-accent-deep)] bg-[var(--color-accent)]/15 shadow-sm"
                        : "border-[var(--color-border)] bg-[var(--color-surface-muted)] hover:bg-[var(--color-surface)]"
                        }`}
                    >
                      {/* Task information */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status indicator */}
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${task.status === "completed"
                            ? "bg-[var(--color-accent-deep)]"
                            : task.status === "in_progress"
                              ? "bg-[var(--color-warning)]"
                              : task.status === "pending"
                                ? "bg-[var(--color-danger)]"
                                : "bg-[var(--color-ink-soft)]"
                            }`}
                        />

                        <div className="flex items-center gap-2 min-w-0">
                          {task.priority && (
                            <span className="shrink-0 rounded-full bg-[var(--color-accent)]/25 border border-[var(--color-accent)]/40 px-1.5 py-0.5 text-[9px] font-heading font-bold uppercase text-[var(--color-accent-deep)]">
                              Priority
                            </span>
                          )}

                          <span
                            className={`font-heading font-medium truncate ${task.status === "completed"
                              ? "line-through text-[var(--color-ink-soft)]"
                              : "text-[var(--color-ink)]"
                              }`}
                          >
                            {task.title}
                          </span>
                        </div>
                      </div>

                      {/* Task controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {canManageTasks ? (
                          <select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) =>
                              updateTask(task._id, {
                                status: e.target.value,
                              })
                            }
                            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[11px] font-heading font-semibold text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)]"
                          >
                            <option value="todo">To-do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </select>
                        ) : (
                          <span className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[11px] font-heading font-semibold text-[var(--color-ink-muted)]">
                            {task.status === "todo"
                              ? "To-do"
                              : task.status === "in_progress"
                                ? "In Progress"
                                : task.status === "pending"
                                  ? "Pending"
                                  : "Completed"}
                          </span>
                        )}

                        {/* Delete = admin/editor currently based on canEditResources.
          If you want deletion admin-only, see the change below. */}
                        {isAdmin && !isClosed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task._id);
                            }}
                            className="text-[var(--color-ink-soft)] hover:text-[var(--color-danger)] p-1 transition"
                            title="Delete task"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* 2. FILES TAB */}
        {tab === "files" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-[var(--color-ink)]">Project Files</h3>
              {canEditResources && (
                <Button size="sm" variant="primary" onClick={() => setFileModal("upload")}>
                  + Upload File
                </Button>
              )}
            </div>

            <FileTree files={files} onOpenFile={openFile} onDeleteFile={deleteFile} canEdit={canEditResources} />
          </div>
        )}

        {/* 3. LINKS TAB */}
        {tab === "links" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-base text-[var(--color-ink)]">Saved Links</h3>
              {canEditResources && (
                <Button size="sm" variant="primary" onClick={() => setLinkModal(true)}>
                  + Add Link
                </Button>
              )}
            </div>

            {links.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-xs font-body text-[var(--color-ink-muted)]">No links added yet.</p>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {links.map((l) => (
                  <Card key={l._id} className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-heading font-semibold text-sm text-[var(--color-ink)] hover:text-[var(--color-accent-deep)] truncate flex items-center gap-1.5"
                      >
                        <span className="truncate">{l.title || l.url}</span>
                        <ExternalLink size={12} className="shrink-0" />
                      </a>
                      {l.description && (
                        <p className="text-xs font-body text-[var(--color-ink-muted)] truncate mt-0.5">{l.description}</p>
                      )}
                    </div>

                    {canEditResources && (
                      <button
                        onClick={() => deleteLink(l._id)}
                        className="text-[var(--color-ink-soft)] hover:text-[var(--color-danger)] p-1 shrink-0 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. AI ASSISTANT TAB */}
        {tab === "ai" && (
          <Card className="p-6">
            <ProjectAI projectId={project._id} />
          </Card>
        )}

        {/* 5. MEMBERS TAB */}
        {tab === "members" && (
          <Card className="p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-[var(--color-ink)]">Team Members</h3>
            <div className="space-y-3">
              {project.members?.map((m) => {
                const memberId = m.user?._id || m._id;
                const isSelf = String(memberId) === String(currentMember.user?._id || currentMember._id);
                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between p-3 rounded-[12px] bg-[var(--color-surface-muted)] border border-[var(--color-border)]"
                  >
                    <div className="flex items-center gap-3">
                      {m.user?.image ? (
                        <img src={m.user.image} alt={m.user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[#0B0B0A] font-heading font-bold text-xs flex items-center justify-center">
                          {(m.user?.name || "U")[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-heading font-semibold text-xs text-[var(--color-ink)]">{m.user?.name}</p>
                        <p className="font-body text-[11px] text-[var(--color-ink-muted)]">{m.user?.email}</p>
                      </div>
                    </div>

                    {isAdmin && !isSelf ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={m.role}
                          onChange={(e) => changeMemberRole(memberId, e.target.value)}
                          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[11px] font-heading font-semibold text-[var(--color-ink)]"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                        <button
                          onClick={() => removeMember(memberId)}
                          className="text-[var(--color-ink-soft)] hover:text-[var(--color-danger)] p-1 transition"
                          title="Remove member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <Badge role={m.role} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 6. OTHER INFO TAB */}
        {tab === "otherInfo" && (
          <Card className="p-6">
            <OtherInfoTab
              project={project}
              isAdmin={isAdmin}
              canEditResources={canEditResources}
              onProjectUpdated={() => router.refresh()}
            />
          </Card>
        )}
      </div>
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      {/* Modals */}
      {taskModal && (
        <CreateTaskModal
          project={project}
          onClose={() => setTaskModal(false)}
          onCreated={(newTask) => {
            setTasks((prev) =>
              sortTasks([newTask, ...prev])
            );

            setTaskModal(false);
          }}
        />
      )}

      {fileModal === "upload" && (
        <FileModal
          project={project}
          onClose={() => setFileModal(null)}
          onCreated={(newFile) => setFiles((prev) => [newFile, ...prev])}
        />
      )}

      {linkModal && (
        <LinkModal
          project={project}
          onClose={() => setLinkModal(false)}
          onCreated={(newLink) => setLinks((prev) => [newLink, ...prev])}
        />
      )}

      {editorFile && (
        <FileEditorModal
          file={editorFile}
          project={project}
          onClose={() => setEditorFile(null)}
          onUpdated={(updated, opts = {}) => {
            setFiles((prev) =>
              prev.map((f) => (String(f._id) === String(updated._id) ? updated : f))
            );
            if (!opts.keepOpen) {
              setEditorFile(null);
            }
          }}
        />
      )}

      {errorFile && (
        <MarkErrorModal
          file={errorFile}
          project={project}
          onClose={() => setErrorFile(null)}
          onSaved={(updated) =>
            setFiles((prev) => prev.map((f) => (String(f._id) === String(updated._id) ? updated : f)))
          }
        />
      )}
    </AppShell>
  );
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Shield,
  UserPlus,
  Trash2,
  LogOut,
  Copy,
  Link2,
  MessageCircle,
  Pencil,
  Save,
  AlertTriangle,
  Mail,
  UserCheck,
} from "lucide-react";

export default function ProjectSettings({ project, userProjects = [] }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [projectName, setProjectName] = useState(project.name || "");
  const [projectDescription, setProjectDescription] = useState(
    project.description || ""
  );
  const [savingProject, setSavingProject] = useState(false);
  const [deleteProjectName, setDeleteProjectName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);
  const [role, setRole] = useState("viewer");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [deployedUrl, setDeployedUrl] = useState(project.deployedUrl || "");
  const [event, setEvent] = useState(project.event || "");
  const [institution, setInstitution] = useState(project.institution || "");
  const [prizeMoney, setPrizeMoney] = useState(project.prizeMoney || "");

  async function generateInvitation() {
    setInviteLoading(true);

    try {
      const response = await fetch(`/api/projects/${project._id}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || null,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invitation");
      }

      setInvitationLink(data.invitationLink);

      try {
        await navigator.clipboard.writeText(data.invitationLink);
        toast.success("Invitation link generated and copied!");
      } catch {
        toast.success("Invitation link generated!");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setInviteLoading(false);
    }
  }

  async function copyInvitationLink() {
    if (!invitationLink) return;
    await navigator.clipboard.writeText(invitationLink);
    toast.success("Invitation link copied!");
  }

  async function saveProjectDetails() {
    const name = projectName.trim();
    const description = projectDescription.trim();

    if (!name) {
      toast.error("Project name is required");
      return;
    }

    setSavingProject(true);

    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          deployedUrl: deployedUrl.trim(),
          event: event.trim(),
          institution: institution.trim(),
          prizeMoney: prizeMoney.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not update project");
      }

      toast.success("Project settings saved");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSavingProject(false);
    }
  }

  function sendInvitationEmail() {
    if (!invitationLink) {
      toast.error("Generate the invitation link first");
      return;
    }

    const subject = encodeURIComponent(`Invitation to join ${project.name}`);
    const body = encodeURIComponent(
      `Hey,\n\nYou have been invited to join the project "${project.name}" as a ${role}.\n\nJoin here:\n${invitationLink}\n\nThis invitation expires in 7 days.`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  function sendInvitationWhatsApp() {
    if (!invitationLink) {
      toast.error("Generate the invitation link first");
      return;
    }

    const message = encodeURIComponent(
      `You've been invited to join "${project.name}" as a ${role}.\n\nJoin here:\n${invitationLink}`
    );

    window.open(`https://wa.me/?text=${message}`, "_blank");
  }

  async function changeRole(userId, newRole) {
    const res = await fetch(
      `/api/projects/${project._id}/members/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      }
    );

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

    const res = await fetch(
      `/api/projects/${project._id}/members/${userId}`,
      { method: "DELETE" }
    );

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not remove member");
      return;
    }

    toast.success("Member removed");
    router.refresh();
  }

  async function transferAdmin(userId, name) {
    if (!confirm(`Transfer admin to ${name}? You will become an editor.`)) return;

    const res = await fetch(`/api/projects/${project._id}/transfer-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Could not transfer admin");
      return;
    }

    toast.success("Admin transferred");
    router.push(`/project/${project._id}`);
    router.refresh();
  }

  async function handleDeleteProject() {
    if (deleteProjectName.trim() !== project.name.trim()) {
      toast.error("Project name does not match");
      return;
    }

    setDeletingProject(true);

    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: deleteProjectName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not delete project");
      }

      toast.success("Project deleted");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingProject(false);
    }
  }

  return (
    <AppShell
      projects={userProjects}
      currentProjectId={project._id}
      title="Project Settings"
      topbarActions={
        <Link href={`/project/${project._id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} /> Back to Project
          </Button>
        </Link>
      }
    >
      <div className="space-y-8 font-body">
        {/* Header Section */}
        <div>
          <p className="text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-accent-deep)]">
            Settings & Permissions
          </p>
          <h1 className="mt-1 text-3xl font-heading font-extrabold uppercase text-[var(--color-ink)]">
            {project.name}
          </h1>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Manage project details, member access, roles, and administrative options.
          </p>
        </div>

        {/* 1. PROJECT INFORMATION */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 flex items-center justify-center font-heading">
              <Pencil size={18} />
            </div>
            <div>
              <h2 className="text-base font-heading font-extrabold uppercase text-[var(--color-ink)]">
                Project Information
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Update core project metadata and public details.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Project Name
              </label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                maxLength={100}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                placeholder="Project name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Description
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full resize-none rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                placeholder="Project description"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Deployed URL
                </label>
                <input
                  type="url"
                  value={deployedUrl}
                  onChange={(e) => setDeployedUrl(e.target.value)}
                  placeholder="https://your-project.vercel.app"
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Event / Hackathon
                </label>
                <input
                  value={event}
                  onChange={(e) => setEvent(e.target.value)}
                  placeholder="e.g. SIH 2026"
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Institution
                </label>
                <input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="College / Organization"
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={saveProjectDetails}
                disabled={savingProject}
              >
                <Save size={16} />
                {savingProject ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Card>

        {/* 2. INVITE MEMBER */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 flex items-center justify-center font-heading">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-heading font-extrabold uppercase text-[var(--color-ink)]">
                Invite Member
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Generate an invitation link to invite team members with specific roles.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Member Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                >
                  <option value="editor">Editor (Can add resources)</option>
                  <option value="viewer">Viewer (Read only)</option>
                  <option value="admin">Admin (Full access)</option>
                </select>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={generateInvitation}
              disabled={inviteLoading}
              className="w-full sm:w-auto"
            >
              <Link2 size={16} />
              {inviteLoading ? "Generating..." : "Generate Invitation Link"}
            </Button>

            {invitationLink && (
              <div className="rounded-[12px] border border-[var(--color-accent)] bg-[var(--color-accent)]/15 p-4 space-y-3">
                <p className="text-xs font-heading font-bold text-[var(--color-accent-deep)] uppercase tracking-wider">
                  Invitation Link Ready
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={invitationLink}
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-mono text-[var(--color-ink)] outline-none"
                  />
                  <Button variant="secondary" size="sm" onClick={copyInvitationLink}>
                    <Copy size={14} /> Copy
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant="outline" size="sm" onClick={sendInvitationEmail}>
                    <Mail size={14} /> Email Invite
                  </Button>
                  <Button variant="outline" size="sm" onClick={sendInvitationWhatsApp}>
                    <MessageCircle size={14} /> WhatsApp
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 3. TEAM MEMBERS & ROLES */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 flex items-center justify-center font-heading">
                <Shield size={18} />
              </div>
              <div>
                <h2 className="text-base font-heading font-extrabold uppercase text-[var(--color-ink)]">
                  Team Members ({project.members?.length || 0})
                </h2>
                <p className="text-xs text-[var(--color-ink-muted)]">
                  Manage member roles and permissions.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {project.members?.map((member) => {
              const memberUser = member.user || {};
              const isMemberAdmin = member.role === "admin";

              return (
                <div
                  key={memberUser._id || member._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    {memberUser.image ? (
                      <img
                        src={memberUser.image}
                        alt={memberUser.name || "Member"}
                        className="w-10 h-10 rounded-full border border-[var(--color-border)] object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/30 text-[var(--color-accent-deep)] font-heading font-bold text-sm flex items-center justify-center shrink-0">
                        {(memberUser.name || "U")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-heading font-bold text-sm text-[var(--color-ink)]">
                        {memberUser.name || "Unknown User"}
                      </p>
                      <p className="font-body text-xs text-[var(--color-ink-muted)]">
                        {memberUser.email || ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end">
                    <Badge role={member.role} />

                    {!isMemberAdmin && (
                      <select
                        value={member.role}
                        onChange={(e) => changeRole(memberUser._id, e.target.value)}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs font-heading text-[var(--color-ink)] outline-none"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}

                    {!isMemberAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => transferAdmin(memberUser._id, memberUser.name)}
                        className="text-xs"
                      >
                        <UserCheck size={14} /> Make Admin
                      </Button>
                    )}

                    {!isMemberAdmin && (
                      <button
                        onClick={() => removeMember(memberUser._id)}
                        className="p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-lg transition"
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 4. DANGER ZONE */}
        <Card className="p-6 border-[var(--color-danger)]/30 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-danger)]/20">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-danger)]/15 text-[var(--color-danger)] flex items-center justify-center font-heading">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-base font-heading font-extrabold uppercase text-[var(--color-danger)]">
                Danger Zone
              </h2>
              <p className="text-xs text-[var(--color-ink-muted)]">
                Irreversible actions for this project workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-heading font-bold text-sm text-[var(--color-ink)]">
                Delete This Project
              </p>
              <p className="text-xs text-[var(--color-ink-muted)] mt-0.5">
                Permanently delete this project, files, links, and member associations.
              </p>
            </div>

            <Button
              variant="danger"
              size="md"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} /> Delete Project
            </Button>
          </div>
        </Card>

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-xl space-y-5">
              <div>
                <h3 className="text-lg font-heading font-extrabold uppercase text-[var(--color-danger)]">
                  Delete Project
                </h3>
                <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                  Type <span className="font-mono font-bold text-[var(--color-ink)]">{project.name}</span> to confirm deletion.
                </p>
              </div>

              <input
                type="text"
                value={deleteProjectName}
                onChange={(e) => setDeleteProjectName(e.target.value)}
                placeholder={project.name}
                className="w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-danger)]"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  disabled={
                    deletingProject ||
                    deleteProjectName.trim() !== project.name.trim()
                  }
                  onClick={handleDeleteProject}
                >
                  {deletingProject ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
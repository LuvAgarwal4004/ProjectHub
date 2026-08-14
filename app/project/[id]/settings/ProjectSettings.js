"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    Shield,
    UserPlus,
    Trash2,
    LogOut,
    Copy,
    Mail,
    Link2,
    MessageCircle,
} from "lucide-react";

export default function ProjectSettings({
    project,
}) {
    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [role, setRole] =
        useState("viewer");

    const [inviteLoading, setInviteLoading] =
        useState(false);

    const [invitationLink, setInvitationLink] =
        useState("");

    async function generateInvitation() {
        setInviteLoading(true);

        try {
            const response =
                await fetch(
                    `/api/projects/${project._id}/invite`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            email:
                                email.trim() || null,
                            role,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Failed to generate invitation"
                );
            }

            setInvitationLink(
                data.invitationLink
            );

            try {
                await navigator.clipboard.writeText(
                    data.invitationLink
                );

                toast.success(
                    "Invitation link generated and copied!"
                );
            } catch {
                toast.success(
                    "Invitation link generated!"
                );
            }
        } catch (error) {
            toast.error(
                error.message
            );
        } finally {
            setInviteLoading(false);
        }
    }
    async function copyInvitationLink() {
        if (!invitationLink) return;

        await navigator.clipboard.writeText(
            invitationLink
        );

        toast.success(
            "Invitation link copied!"
        );
    }

    function sendInvitationEmail() {
        if (!invitationLink) {
            toast.error(
                "Generate the invitation link first"
            );
            return;
        }

        if (!email.trim()) {
            toast.error(
                "Enter an email address first"
            );
            return;
        }

        const subject =
            encodeURIComponent(
                `Invitation to join ${project.name}`
            );

        const body =
            encodeURIComponent(
                `Hey,\n\nYou have been invited to join the project "${project.name}" as a ${role}.\n\nJoin here:\n${invitationLink}\n\nThis invitation expires in 7 days.`
            );

        window.location.href =
            `mailto:${email}?subject=${subject}&body=${body}`;
    }

    function sendInvitationWhatsApp() {
        if (!invitationLink) {
            toast.error(
                "Generate the invitation link first"
            );
            return;
        }

        const message =
            encodeURIComponent(
                `You've been invited to join "${project.name}" as a ${role}.\n\nJoin here:\n${invitationLink}`
            );

        window.open(
            `https://wa.me/?text=${message}`,
            "_blank"
        );
    }


    async function changeRole(
        userId,
        newRole
    ) {
        const res = await fetch(
            `/api/projects/${project._id}/members/${userId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    role: newRole,
                }),
            }
        );

        const data =
            await res.json();

        if (!res.ok) {
            toast.error(
                data.error ||
                "Could not change role"
            );
            return;
        }

        toast.success(
            "Role updated"
        );

        router.refresh();
    }

    async function removeMember(
        userId
    ) {
        if (
            !confirm(
                "Remove this member from the project?"
            )
        ) {
            return;
        }

        const res = await fetch(
            `/api/projects/${project._id}/members/${userId}`,
            {
                method: "DELETE",
            }
        );

        const data =
            await res.json();

        if (!res.ok) {
            toast.error(
                data.error ||
                "Could not remove member"
            );
            return;
        }

        toast.success(
            "Member removed"
        );

        router.refresh();
    }

    async function leaveProject() {
        if (
            !confirm(
                "Leave this project?"
            )
        ) {
            return;
        }

        const res = await fetch(
            `/api/projects/${project._id}/leave`,
            {
                method: "POST",
            }
        );

        const data =
            await res.json();

        if (!res.ok) {
            toast.error(
                data.error ||
                "Could not leave project"
            );
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    async function transferAdmin(
        userId,
        name
    ) {
        if (
            !confirm(
                `Transfer admin to ${name}? You will become an editor.`
            )
        ) {
            return;
        }

        const res = await fetch(
            `/api/projects/${project._id}/transfer-admin`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    userId,
                }),
            }
        );

        const data =
            await res.json();

        if (!res.ok) {
            toast.error(
                data.error ||
                "Could not transfer admin"
            );
            return;
        }

        toast.success(
            "Admin transferred"
        );

        router.push(
            `/project/${project._id}`
        );

        router.refresh();
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
                    <Link
                        href={`/project/${project._id}`}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />
                        Back to Project
                    </Link>
                </div>
            </nav>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                        Project Settings
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        {project.name}
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage members, roles and project access.
                    </p>
                </div>

                {/* INVITE */}

                <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <UserPlus size={20} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Invite Member
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Generate an invitation link and
                                send it by WhatsApp or
                                anywhere else.
                            </p>
                        </div>
                    </div>

                    {/* <div className="mt-6 grid gap-3 md:grid-cols-[1fr_160px]">
                        <input
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="member@example.com (optional for shared link)"
                            type="email"
                            className="min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >
                            <option value="viewer">
                                Viewer
                            </option>

                            <option value="editor">
                                Editor
                            </option>
                        </select>
                    </div> */}

                    <button
                        onClick={generateInvitation}
                        disabled={inviteLoading}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Link2 size={17} />

                        {inviteLoading
                            ? "Generating..."
                            : "Generate Invitation Link"}
                    </button>

                    {invitationLink && (
                        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                                Invitation Link
                            </p>

                            <input
                                readOnly
                                value={invitationLink}
                                className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 outline-none"
                            />

                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                                <button
                                    onClick={copyInvitationLink}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <Copy size={15} />
                                    Copy
                                </button>

                                {/* <button
                                    onClick={sendInvitationEmail}
                                    disabled={!email.trim()}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Mail size={15} />
                                    Email
                                </button> */}

                                <button
                                    onClick={sendInvitationWhatsApp}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    <MessageCircle size={15} />
                                    WhatsApp
                                </button>
                            </div>

                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                You can also paste this link directly
                                into Discord, Telegram, WhatsApp,
                                etc.
                            </p>
                        </div>
                    )}
                </section>

                {/* MEMBERS */}

                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Shield size={20} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Members
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Change roles or remove members.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {project.members.map(
                            (member) => (
                                <div
                                    key={member.user._id}
                                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        {member.user.image ? (
                                            <img
                                                src={
                                                    member.user.image
                                                }
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
                                                {
                                                    member.user
                                                        .name
                                                }
                                            </p>

                                            <p className="truncate text-xs text-slate-400">
                                                {
                                                    member.user
                                                        .email
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {member.role ===
                                            "admin" ? (
                                            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-700">
                                                Admin
                                            </span>
                                        ) : (
                                            <>
                                                <select
                                                    value={
                                                        member.role
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        changeRole(
                                                            member.user
                                                                ._id,
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold"
                                                >
                                                    <option value="viewer">
                                                        Viewer
                                                    </option>

                                                    <option value="editor">
                                                        Editor
                                                    </option>
                                                </select>

                                                <button
                                                    onClick={() =>
                                                        transferAdmin(
                                                            member.user
                                                                ._id,
                                                            member.user
                                                                .name
                                                        )
                                                    }
                                                    className="rounded-xl border border-blue-100 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                                >
                                                    Make Admin
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        removeMember(
                                                            member.user
                                                                ._id
                                                        )
                                                    }
                                                    className="rounded-xl border border-red-100 p-2 text-red-500 hover:bg-red-50"
                                                >
                                                    <Trash2
                                                        size={15}
                                                    />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </section>

                {/* LEAVE */}

                <section className="mt-6 rounded-3xl border border-red-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="font-bold text-slate-900">
                                Leave Project
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Admin must transfer ownership before leaving.
                            </p>
                        </div>

                        <button
                            onClick={leaveProject}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            Leave Project
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
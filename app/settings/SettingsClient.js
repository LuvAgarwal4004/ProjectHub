"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Camera,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";

export default function SettingsClient({ user: initialUser }) {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();

  // Profile Form State
  const [name, setName] = useState(initialUser?.name || session?.user?.name || "");
  const [image, setImage] = useState(initialUser?.image || session?.user?.image || "");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      // Update client session
      await updateSession({ name, image });

      toast.success("Profile details updated successfully");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner Card */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[20px] p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt={name || "User"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-border)] shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] text-[#0B0B0A] font-heading font-extrabold text-2xl flex items-center justify-center border-2 border-[var(--color-border)] shadow-xs">
                  {(name || "U")[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 bg-[var(--color-surface)] p-1 rounded-full border border-[var(--color-border)] text-[var(--color-accent-deep)]">
                <Sparkles size={13} />
              </div>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-[var(--color-ink)]">
                {name || "User Account"}
              </h1>
              <p className="text-xs font-body text-[var(--color-ink-muted)] mt-0.5">
                {initialUser?.email || session?.user?.email}
              </p>
            </div>
          </div>

          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="secondary"
            size="sm"
            className="text-[var(--color-danger)] hover:text-white hover:bg-[var(--color-danger)] border-[var(--color-danger)]/30 shrink-0 font-bold"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        {/* Left Column: Profile Information & Theme */}
        <div className="md:col-span-7 space-y-6">
          {/* Profile Edit Card */}
          <Card className="p-6 bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-heading font-bold text-[var(--color-ink)] flex items-center gap-2">
                <User size={18} className="text-[var(--color-accent-deep)]" />
                Personal Details
              </h2>
              <p className="text-xs font-body text-[var(--color-ink-muted)] mt-1">
                Update your display name and profile picture.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                  Display Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                  <input
                    type="email"
                    value={initialUser?.email || session?.user?.email || ""}
                    disabled
                    className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] py-2.5 pl-10 pr-24 text-sm text-[var(--color-ink-muted)] outline-none opacity-80 cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] font-heading font-bold text-[var(--color-accent-deep)] bg-[var(--color-accent)]/20 px-2 py-0.5 rounded-full border border-[var(--color-accent)]/30">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                  Profile Avatar URL (Optional)
                </label>
                <div className="relative">
                  <Camera size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition"
                  />
                </div>
                <p className="text-[11px] text-[var(--color-ink-muted)] mt-1">
                  Paste a direct link to an image, or leave blank to use your name initials.
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={profileLoading} variant="primary" size="sm" className="font-bold">
                  {profileLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Theme & Appearance Card */}
          <Card className="p-6 bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-heading font-bold text-[var(--color-ink)] flex items-center gap-2">
                <Sun size={18} className="text-[var(--color-accent-deep)]" />
                Theme & Appearance
              </h2>
              <p className="text-xs font-body text-[var(--color-ink-muted)] mt-1">
                Toggle between light and dark mode for your DevHouse workspace.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-[12px] bg-[var(--color-surface-muted)] border border-[var(--color-border)]">
              <div>
                <p className="text-xs font-heading font-semibold text-[var(--color-ink)]">
                  Interface Theme
                </p>
                <p className="text-[11px] font-body text-[var(--color-ink-muted)]">
                  Switch between Warm Off-White and Deep Charcoal
                </p>
              </div>
              <ThemeToggle size="md" />
            </div>
          </Card>
        </div>

        {/* Right Column: Security & Danger Zone */}
        <div className="md:col-span-5 space-y-6">
          {/* Password Change Card */}
          <Card className="p-6 bg-[var(--color-surface)] border-[var(--color-border)] shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-heading font-bold text-[var(--color-ink)] flex items-center gap-2">
                <Lock size={18} className="text-[var(--color-accent-deep)]" />
                Security & Password
              </h2>
              <p className="text-xs font-body text-[var(--color-ink-muted)] mt-1">
                Change your account password securely.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-10 pr-10 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-1 transition cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                  New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-10 pr-10 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-1 transition cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-10 pr-10 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-1 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={passwordLoading} variant="secondary" size="sm" className="w-full font-bold">
                  {passwordLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Card>

          {/* Danger / Logout Card */}
          <Card className="p-6 bg-[var(--color-surface)] border border-[var(--color-danger)]/20 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-heading font-bold text-[var(--color-danger)] flex items-center gap-2">
                <LogOut size={18} />
                Session & Logout
              </h2>
              <p className="text-xs font-body text-[var(--color-ink-muted)] mt-1">
                Safely terminate your current session on this device.
              </p>
            </div>

            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              variant="danger"
              size="md"
              className="w-full font-bold shadow-xs"
            >
              <LogOut size={16} />
              <span>Log Out of DEVHOUSE</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      setOtpSent(true);
      toast.success("OTP sent successfully");
    } else {
      toast.error(data.error);
    }
  };

  const resetPassword = async () => {
    if (!otp || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.success) {
      toast.success("Password reset successfully");
      router.push("/login");
    } else {
      toast.error(data.error);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-10 text-[var(--color-ink)] font-body">
      <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div
            style={{ backgroundColor: "#0B0B0A" }}
            className="hidden p-12 text-white lg:flex lg:flex-col lg:justify-between border-r border-[var(--color-border)]"
          >
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="DEVHOUSE"
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-white/20 shrink-0 shadow-2xs"
                />
                <span className="text-xl font-heading font-extrabold uppercase tracking-tight text-white">
                  DEV<span className="text-[var(--color-accent)]">HOUSE</span>
                </span>
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full border border-white/10 transition"
              >
                <ArrowLeft size={13} />
                <span>Home</span>
              </Link>
            </div>

            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/20 text-[var(--color-accent)]">
                <ShieldCheck size={24} />
              </div>

              <h1 className="text-3xl font-heading font-bold leading-tight text-white">
                Securely get
                <br />
                <span className="text-[var(--color-accent)]">back in.</span>
              </h1>

              <p className="mt-4 leading-relaxed text-white/70 font-body text-sm">
                We'll verify your identity using a one-time password before allowing you to create a new password.
              </p>
            </div>

            <p className="text-xs font-heading tracking-widest uppercase text-white/50">
              Your account security matters.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="mx-auto max-w-sm w-full">
              <div className="mb-6 flex items-center justify-between">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-heading font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] bg-[var(--color-surface-muted)] px-3 py-1 rounded-full border border-[var(--color-border)] transition"
                >
                  <ArrowLeft size={13} />
                  <span>Home</span>
                </Link>
              </div>

              <div>
                <p className="text-xs font-heading font-bold uppercase tracking-widest text-[var(--color-accent-deep)]">
                  Account recovery
                </p>

                <h2 className="mt-1 text-2xl font-heading font-bold tracking-tight text-[var(--color-ink)]">
                  Reset your password
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  {otpSent
                    ? "Enter the verification code sent to your email and your new password."
                    : "Enter your registered email address and we'll send you a verification code."}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="you@example.com"
                      disabled={otpSent}
                      className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition disabled:opacity-60"
                    />
                  </div>
                </div>

                {!otpSent && (
                  <Button onClick={sendOtp} disabled={loading} variant="primary" className="w-full py-2.5 text-sm mt-2 shadow-xs">
                    {loading ? "Sending..." : "Send OTP"}
                    {!loading && <ArrowRight size={16} />}
                  </Button>
                )}

                {otpSent && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                        Verification Code
                      </label>
                      <div className="relative">
                        <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                        <input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit OTP"
                          maxLength={6}
                          className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-3 font-heading text-center tracking-[0.3em] text-sm outline-none focus:border-[var(--color-accent-deep)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a new password"
                          className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-10 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-1 transition cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <Button onClick={resetPassword} disabled={loading} variant="primary" className="w-full py-2.5 text-sm">
                      {loading ? "Resetting..." : "Reset Password"}
                      {!loading && <ArrowRight size={16} />}
                    </Button>
                  </div>
                )}
              </div>

              <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
                Remember your password?{" "}
                <Link href="/login" className="font-heading font-bold text-[var(--color-accent-deep)] hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
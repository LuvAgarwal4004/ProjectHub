"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Could not send verification code");
      return;
    }

    toast.success("Verification code sent to your email");
    setOtpSent(true);
    setTimer(30);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        otp,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Verification failed");
      return;
    }

    toast.success("Account created successfully!");

    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (loginRes?.error) {
      router.push("/login");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Could not resend verification code");
      return;
    }

    toast.success("New verification code sent");
    setTimer(30);
  };

  useEffect(() => {
    if (!otpSent || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
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


              <h1 className="text-3xl font-heading font-bold leading-tight text-white">
                Build your
                <br />
                <span className="text-[var(--color-accent)]">project workspace.</span>
              </h1>

              <p className="mt-4 leading-relaxed text-white/70 font-body text-sm">
                Create projects, organize resources and bring your team together in one simple workspace.
              </p>
            </div>

            <p className="text-xs font-heading tracking-widest uppercase text-white/50">
              Organize. Share. Collaborate.
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="mx-auto max-w-sm w-full">
              <div className="mb-8 flex items-center justify-between lg:hidden">
                <Link href="/" className="flex items-center gap-2.5">
                  <img
                    src="/logo.png"
                    alt="DEVHOUSE"
                    className="w-7 h-7 rounded-lg object-contain bg-white dark:bg-[#171915] p-0.5 border border-[var(--color-border)] shrink-0 shadow-2xs"
                  />
                  <span className="text-lg font-heading font-extrabold uppercase text-[var(--color-ink)]">
                    DEV<span className="text-[var(--color-accent-deep)]">HOUSE</span>
                  </span>
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
                  Get started
                </p>

                <h2 className="mt-1 text-2xl font-heading font-bold tracking-tight text-[var(--color-ink)]">
                  Create your account
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  Start organizing your projects and collaborating with your team.
                </p>
              </div>

              <form onSubmit={handleSignup} className="mt-6 space-y-3.5">
                <InputField
                  icon={<User size={16} />}
                  label="Name"
                  value={name}
                  onChange={setName}
                  placeholder="Your name"
                  type="text"
                />

                <InputField
                  icon={<Mail size={16} />}
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  type="email"
                />

                <InputField
                  icon={<Lock size={16} />}
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Create a password"
                  type="password"
                  showToggle={true}
                  isVisible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />

                <InputField
                  icon={<Lock size={16} />}
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat your password"
                  type="password"
                  showToggle={true}
                  isVisible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                <Button type="submit" disabled={loading} variant="primary" className="w-full py-2.5 text-sm mt-2 shadow-xs">
                  {loading ? "Sending OTP..." : "Create Account"}
                  {!loading && <ArrowRight size={16} />}
                </Button>
              </form>

              {otpSent && (
                <div className="mt-6 rounded-[12px] border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)] text-[var(--color-ink)] shadow-2xs shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-xs text-[var(--color-ink)]">
                        Verify your email
                      </h3>
                      <p className="text-[11px] font-body text-[var(--color-ink-muted)]">
                        OTP sent to {email}
                      </p>
                    </div>
                  </div>

                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="6-digit OTP"
                    className="mt-3 w-full rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-center font-heading text-base tracking-[0.3em] outline-none focus:border-[var(--color-accent-deep)]"
                  />

                  <Button onClick={handleVerifyOtp} variant="primary" className="mt-3 w-full py-2 text-xs">
                    Verify Email
                    <ArrowRight size={14} />
                  </Button>

                  <button
                    disabled={timer > 0}
                    onClick={handleResendOtp}
                    className="mt-2 w-full text-center text-xs font-heading font-medium text-[var(--color-accent-deep)] disabled:text-[var(--color-ink-soft)] cursor-pointer"
                  >
                    {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
                  </button>
                </div>
              )}

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--color-border)]" />
                <span className="text-[10px] font-heading font-bold text-[var(--color-ink-soft)] uppercase">OR</span>
                <div className="h-px flex-1 bg-[var(--color-border)]" />
              </div>

              <Button onClick={handleGoogle} variant="secondary" className="w-full py-2.5 text-sm">
                <span className="font-heading font-bold text-base mr-1">G</span>
                Continue with Google
              </Button>

              <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
                Already have an account?{" "}
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

function InputField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  showToggle = false,
  isVisible = false,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none">
          {icon}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={showToggle ? (isVisible ? "text" : "password") : type}
          placeholder={placeholder}
          className={`w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-10 ${showToggle ? "pr-10" : "pr-3"
            } text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-1 transition cursor-pointer"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
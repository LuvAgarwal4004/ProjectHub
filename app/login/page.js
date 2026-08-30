"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  };

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
                Your projects,
                <br />
                <span className="text-[var(--color-accent)]">all in one place.</span>
              </h1>

              <p className="mt-4 leading-relaxed text-white/70 font-body text-sm">
                Access your projects, files, links and team resources from one organized workspace.
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
                    Dev<span className="text-[var(--color-accent-deep)]">House</span>
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
                  Welcome back
                </p>

                <h2 className="mt-1 text-2xl font-heading font-bold tracking-tight text-[var(--color-ink)]">
                  Login to DevHouse
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                  Continue to your projects and shared workspaces.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
                      className="w-full rounded-[12px] border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-10 pr-3 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-heading font-medium uppercase tracking-wide text-[var(--color-ink-muted)]">
                      Password
                    </label>
                    <Link href="/forgot-password" className="text-xs font-heading text-[var(--color-accent-deep)] hover:underline">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
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

                <Button type="submit" disabled={loading} variant="primary" className="w-full py-2.5 text-sm mt-2 shadow-xs">
                  {loading ? "Logging in..." : "Login"}
                  {!loading && <ArrowRight size={16} />}
                </Button>
              </form>

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
                Don't have an account?{" "}
                <Link href="/signup" className="font-heading font-bold text-[var(--color-accent-deep)] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
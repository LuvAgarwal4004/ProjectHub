"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 text-slate-800">

      <div className="mx-auto flex min-h-[90vh] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">

          {/* LEFT */}

          <div className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">

            <Link
              href="/"
              className="text-2xl font-bold"
            >
              Project
              <span className="text-blue-400">
                Hub
              </span>
            </Link>

            <div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                ✦
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Your projects,
                <br />
                all in one place.
              </h1>

              <p className="mt-6 max-w-md leading-7 text-slate-300">
                Access your projects, files, links and team resources
                from one organized workspace.
              </p>

            </div>

            <p className="text-sm text-slate-500">
              Organize. Share. Collaborate.
            </p>

          </div>


          {/* RIGHT */}

          <div className="p-6 sm:p-10 lg:p-14">

            <div className="mx-auto max-w-md">

              <Link
                href="/"
                className="mb-10 inline-block text-xl font-bold text-slate-900 lg:hidden"
              >
                Project
                <span className="text-blue-600">
                  Hub
                </span>
              </Link>

              <div>

                <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  Login to ProjectHub
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Continue to your projects and shared workspaces.
                </p>

              </div>


              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-5"
              >

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>


                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      type="password"
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Logging in..."
                    : "Login"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>

              </form>


              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-medium text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />

              </div>


              <button
                onClick={handleGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3.5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
              >
                <span className="text-lg">
                  G
                </span>

                Continue with Google
              </button>


              <p className="mt-8 text-center text-sm text-slate-500">

                Don't have an account?{" "}

                <Link
                  href="/signup"
                  className="font-semibold text-blue-600 hover:underline"
                >
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
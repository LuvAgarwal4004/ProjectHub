"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }

    setLoading(true);

    const res = await fetch(
      "/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

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

    const res = await fetch(
      "/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      }
    );

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10 text-slate-800">

      <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">

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

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
                <ShieldCheck
                  size={28}
                  className="text-blue-400"
                />
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Securely get
                <br />
                back in.
              </h1>

              <p className="mt-6 max-w-md leading-7 text-slate-300">
                We'll verify your identity using a one-time password
                before allowing you to create a new password.
              </p>

            </div>


            <p className="text-sm text-slate-500">
              Your account security matters.
            </p>

          </div>


          {/* RIGHT */}

          <div className="p-6 sm:p-10 lg:p-14">

            <div className="mx-auto max-w-md">

              <Link
                href="/login"
                className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>


              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Account recovery
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Forgot your password?
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {otpSent
                  ? "Enter the OTP from your email and choose a new password."
                  : "Enter your registered email address and we'll send you a verification code."}
              </p>


              <div className="mt-8">

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
                    disabled={otpSent}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:opacity-60"
                  />

                </div>


                {!otpSent && (
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {loading
                      ? "Sending..."
                      : "Send OTP"}

                    {!loading && (
                      <ArrowRight size={18} />
                    )}
                  </button>
                )}


                {otpSent && (
                  <div className="mt-5 space-y-5">

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Verification Code
                      </label>

                      <div className="relative">

                        <ShieldCheck
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                          value={otp}
                          onChange={(e) =>
                            setOtp(e.target.value)
                          }
                          placeholder="Enter OTP"
                          maxLength={6}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-center tracking-[0.35em] outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />

                      </div>

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        New Password
                      </label>

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
                          placeholder="Create a new password"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                        />

                      </div>

                    </div>


                    <button
                      onClick={resetPassword}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60"
                    >
                      {loading
                        ? "Resetting..."
                        : "Reset Password"}

                      {!loading && (
                        <ArrowRight size={18} />
                      )}
                    </button>

                  </div>
                )}

              </div>


              <p className="mt-8 text-center text-sm text-slate-500">

                Remember your password?{" "}

                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
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
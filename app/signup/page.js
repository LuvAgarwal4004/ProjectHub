"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  User,
  Lock,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

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

    if (data.success) {
      setOtpSent(true);
      setTimer(30);
      toast.success("OTP sent to your email");
    } else {
      toast.error(data.error);
    }
  };

  useEffect(() => {
    if (!otpSent || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleResendOtp = async () => {
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

    if (data.success) {
      setTimer(30);
      toast.success("OTP resent");
    } else {
      toast.error(data.error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error("Enter the OTP");
      return;
    }

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    const data = await res.json();

    if (data.success) {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      toast.success("Account created!");

      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error(data.error);
    }
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
                Build your
                <br />
                project workspace.
              </h1>

              <p className="mt-6 max-w-md leading-7 text-slate-300">
                Create projects, organize resources and bring your
                team together in one simple workspace.
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


              <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Start organizing your projects and collaborating with
                your team.
              </p>


              <form
                onSubmit={handleSignup}
                className="mt-8 space-y-5"
              >

                <Input
                  icon={<User size={18} />}
                  label="Name"
                  value={name}
                  onChange={setName}
                  placeholder="Your name"
                  type="text"
                />

                <Input
                  icon={<Mail size={18} />}
                  label="Email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  type="email"
                />

                <Input
                  icon={<Lock size={18} />}
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  placeholder="Create a password"
                  type="password"
                />

                <Input
                  icon={<Lock size={18} />}
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repeat your password"
                  type="password"
                />


                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading
                    ? "Sending OTP..."
                    : "Create Account"}

                  {!loading && (
                    <ArrowRight size={18} />
                  )}
                </button>

              </form>


              {otpSent && (
                <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Verify your email
                      </h3>

                      <p className="text-xs text-slate-500">
                        OTP sent to {email}
                      </p>
                    </div>

                  </div>


                  <input
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value)
                    }
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="mt-5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />


                  <button
                    onClick={handleVerifyOtp}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Verify Email
                    <ArrowRight size={17} />
                  </button>


                  <button
                    disabled={timer > 0}
                    onClick={handleResendOtp}
                    className="mt-4 w-full text-sm font-semibold text-blue-600 disabled:text-slate-400"
                  >
                    {timer > 0
                      ? `Resend OTP in ${timer}s`
                      : "Resend OTP"}
                  </button>

                </div>
              )}


              <div className="my-7 flex items-center gap-4">

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs text-slate-400">
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

                Already have an account?{" "}

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


function Input({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

      </div>

    </div>
  );
}
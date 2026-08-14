"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Don't show anything while session is loading
  if (status === "loading") {
    return (
      <nav className="sticky top-0 z-50 h-16 border-b border-white/10 bg-[#07091d]/95 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
        </div>
      </nav>
    );
  }

  // If user isn't logged in, don't show anything
  if (!session) {
    return null;
  }

  const userImage =
    session.user?.image ||
    `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
      session.user?.name || "User"
    )}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07091d]/95 shadow-xl backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-end px-4 sm:px-6 lg:px-8">
        <div ref={dropdownRef} className="relative">
          {/* Profile Button */}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Open profile menu"
            aria-expanded={open}
            className="group flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 focus:outline-none"
          >
            <img
              src={userImage}
              alt="Profile"
              className="h-10 w-10 rounded-full border-2 border-white/20 object-cover shadow-lg transition-all duration-200 group-hover:border-cyan-400/60 group-hover:shadow-cyan-500/20 sm:h-11 sm:w-11"
            />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#101329] shadow-2xl shadow-black/40 backdrop-blur-xl">
              {/* User Information */}
              <div className="border-b border-white/10 px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={userImage}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-white/20 object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {session.user?.name || "User"}
                    </p>

                    <p className="truncate text-sm text-gray-400">
                      {session.user?.email || ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
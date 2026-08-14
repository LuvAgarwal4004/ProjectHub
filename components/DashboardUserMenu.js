"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function DashboardUserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const image =
    user?.image ||
    `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
      user?.name || "User"
    )}`;

  return (
    <div ref={menuRef} className="relative">
      {/* PROFILE PICTURE */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open user menu"
        aria-expanded={open}
        className="group flex h-11 w-11 items-center justify-center rounded-full focus:outline-none"
      >
        <img
          src={image}
          alt="Profile"
          className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-md transition duration-200 group-hover:scale-105 group-hover:border-blue-400 sm:h-12 sm:w-12"
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute
            right-0
            top-14
            z-50
            w-64
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-2xl
          "
        >
          {/* USER INFO */}
          <div className="border-b border-slate-100 px-4 py-4">
            <div className="flex items-center gap-3">
              <img
                src={image}
                alt="Profile"
                className="h-10 w-10 rounded-full border border-slate-200 object-cover"
              />

              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">
                  {user?.name || "User"}
                </p>

                <p className="truncate text-sm text-slate-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/login",
              })
            }
            className="
              flex
              w-full
              items-center
              gap-3
              px-4
              py-3
              text-left
              text-red-600
              transition
              hover:bg-red-50
            "
          >
            <LogOut size={18} />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
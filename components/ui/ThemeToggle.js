"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "", size = "md" }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark =
      document.documentElement.classList.contains("dark") ||
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-accent-deep)] shadow-2xs transition-all duration-200 ${
        size === "sm" ? "w-8 h-8" : "w-9 h-9"
      } ${className}`}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme mode"
    >
      {theme === "dark" ? (
        <Sun size={17} className="text-[var(--color-accent)] animate-spin-once" />
      ) : (
        <Moon size={17} className="text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]" />
      )}
    </button>
  );
}

export default ThemeToggle;

"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Search, X, ArrowRight, Trophy } from "lucide-react";

export function Topbar({
  title = "Dashboard",
  projects = [],
  currentProjectId,
  onOpenMobileSidebar,
  actions,
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const currentProject = projects.find((p) => String(p._id) === String(currentProjectId));

  const query = searchQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((p) => {
    if (!query) return false;
    return (
      p.name?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.event?.toLowerCase().includes(query) ||
      p.institution?.toLowerCase().includes(query)
    );
  });

  return (
    <header className="sticky top-0 z-30 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] h-16 px-4 lg:px-8 flex items-center justify-between gap-4 font-body">
      {/* Left section: Hamburger (mobile) + Page/Project title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition"
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h1 className="font-heading font-bold text-lg text-[var(--color-ink)] truncate tracking-tight">
            {currentProject ? currentProject.name : title}
          </h1>

          {currentProject && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-heading font-medium bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30">
              Workspace
            </span>
          )}
        </div>
      </div>

      {/* Middle section: Quick Search in Topbar */}
      {projects.length > 0 && (
        <div className="hidden md:block relative max-w-xs w-full">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none" />
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filteredProjects.length > 0) {
                  router.push(`/project/${filteredProjects[0]._id}`);
                  setSearchFocused(false);
                }
              }}
              placeholder="Search workspaces..."
              className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] rounded-full pl-8 pr-7 py-1.5 outline-none focus:border-[var(--color-accent-deep)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition placeholder:text-[var(--color-ink-soft)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  searchRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Search Results Dropdown */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] shadow-xl p-2 max-h-56 overflow-y-auto space-y-1">
              <p className="px-2 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                Projects ({filteredProjects.length})
              </p>
              {filteredProjects.length === 0 ? (
                <p className="px-2 py-2 text-xs text-[var(--color-ink-muted)]">
                  No matching projects found
                </p>
              ) : (
                filteredProjects.map((p) => (
                  <Link
                    key={p._id}
                    href={`/project/${p._id}`}
                    onClick={() => setSearchFocused(false)}
                    className="flex items-center justify-between p-2 rounded-[8px] hover:bg-[var(--color-surface-muted)] transition group"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-heading font-semibold text-xs text-[var(--color-ink)] truncate group-hover:text-[var(--color-accent-deep)]">
                        {p.name}
                      </p>
                          {p.event && (
                            <p className="text-[10px] text-[var(--color-ink-muted)] truncate flex items-center gap-1">
                              <Trophy size={11} className="text-[var(--color-accent-deep)] shrink-0" />
                              {p.event}
                            </p>
                          )}
                    </div>
                    <ArrowRight size={13} className="text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] shrink-0" />
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Right section: Theme Toggle + Pricing + Contextual actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ThemeToggle size="md" />

        <Link href="/pricing">
          <Button size="sm" variant="ghost" className="font-heading text-xs font-semibold">
            Pricing
          </Button>
        </Link>

        {actions ? (
          actions
        ) : (
          <Link href="/dashboard/create">
            <Button size="sm" variant="primary" className="shadow-2xs">
              <span className="text-base leading-none">+</span>
              <span className="hidden sm:inline">New Project</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Topbar;

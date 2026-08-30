"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Badge } from "@/components/ui/Badge";
import {
  LayoutDashboard,
  FolderKanban,
  Plus,
  ChevronRight,
  Search,
  LogOut,
  X,
  ChevronLeft,
  ArrowRight,
  Trophy,
  FileText,
  Link2,
  Users,
  Menu,
  Settings,
} from "lucide-react";

export function Sidebar({
  projects = [],
  currentProjectId,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const searchInputRef = useRef(null);

  // Control whether the projects list is expanded / shown
  const [showProjects, setShowProjects] = useState(Boolean(currentProjectId));
  const [expandedProjects, setExpandedProjects] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0 });

  const toggleProjectExpand = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMouseEnterTooltip = (label, e) => {
    if (!collapsed || mobileOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ top: rect.top + rect.height / 2 - 14 });
    setHoveredTooltip(label);
  };

  const handleMouseLeaveTooltip = () => {
    setHoveredTooltip(null);
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredProjects = projects.filter((p) => {
    if (!query) return true;
    const matchName = p.name?.toLowerCase().includes(query);
    const matchDesc = p.description?.toLowerCase().includes(query);
    const matchEvent = p.event?.toLowerCase().includes(query);
    const matchInst = p.institution?.toLowerCase().includes(query);
    return matchName || matchDesc || matchEvent || matchInst;
  });

  const isDashboardActive = pathname === "/dashboard";

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      setShowProjects(true);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && filteredProjects.length > 0) {
      e.preventDefault();
      router.push(`/project/${filteredProjects[0]._id}`);
      onCloseMobile?.();
      setSearchFocused(false);
    } else if (e.key === "Escape") {
      setSearchQuery("");
      setSearchFocused(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Hover Tooltip for Collapsed Rail */}
      {collapsed && !mobileOpen && hoveredTooltip && (
        <div
          style={{ top: `${tooltipPos.top}px` }}
          className="fixed left-[80px] z-[99] px-3 py-1.5 rounded-[8px] bg-[var(--color-ink)] text-white text-xs font-heading font-medium shadow-md whitespace-nowrap pointer-events-none animate-fadeIn transition-all duration-150"
        >
          {hoveredTooltip}
        </div>
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-200 ease-in-out ${
          collapsed ? "lg:w-[72px]" : "lg:w-[260px]"
        } ${
          mobileOpen ? "translate-x-0 w-[270px]" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* 1. Header Row */}
        <div
          className={`flex items-center h-16 border-b border-[var(--color-border)] shrink-0 transition-all duration-200 ${
            collapsed && !mobileOpen ? "justify-center px-0" : "justify-between px-4"
          }`}
        >
          {(!collapsed || mobileOpen) ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 min-w-0"
              >
                <img
                  src="/logo.png"
                  alt="DEVHOUSE"
                  className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-[#171915] p-0.5 border border-[var(--color-border)] shrink-0 shadow-2xs"
                />
                <span className="font-heading font-extrabold text-base uppercase text-[var(--color-ink)] tracking-tight whitespace-nowrap">
                  DEV<span className="text-[var(--color-accent-deep)]">HOUSE</span>
                </span>
              </Link>

              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition shrink-0"
              >
                <Menu size={20} />
              </button>
            </>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={onToggleCollapse}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition"
              >
                <Menu size={20} />
              </button>
            </div>
          )}
        </div>

        {/* 2. Search Bar */}
        <div className="px-3 pt-3 pb-1 shrink-0 relative">
          {(!collapsed || mobileOpen) ? (
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search projects..."
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-ink)] font-body placeholder:text-[var(--color-ink-soft)] rounded-full pl-8 pr-7 py-2 outline-none focus:border-[var(--color-accent-deep)] focus:ring-1 focus:ring-[var(--color-accent)]/30 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] p-0.5 rounded-full"
                >
                  <X size={13} />
                </button>
              )}

              {/* Instant Search Dropdown Preview */}
              {searchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] shadow-xl p-2 max-h-56 overflow-y-auto space-y-1">
                  <p className="px-2 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
                    Search Results ({filteredProjects.length})
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
                        onClick={() => {
                          onCloseMobile?.();
                          setSearchFocused(false);
                        }}
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
          ) : (
            <div
              className="flex justify-center"
              onMouseEnter={(e) => handleMouseEnterTooltip("Search", e)}
              onMouseLeave={handleMouseLeaveTooltip}
            >
              <button
                onClick={() => {
                  onToggleCollapse?.();
                  setTimeout(() => searchInputRef.current?.focus(), 150);
                }}
                className="w-10 h-10 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)] transition"
              >
                <Search size={18} />
              </button>
            </div>
          )}
        </div>

        {/* 3. Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 font-body">
          {/* NAVIGATION SECTION */}
          <div>
            {(!collapsed || mobileOpen) ? (
              <p className="px-3 pb-2 text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                Navigation
              </p>
            ) : (
              <div className="h-px bg-[var(--color-border)] my-2.5 mx-2" />
            )}

            <nav className="space-y-1.5">
              {/* Dashboard Link */}
              <Link
                href="/dashboard"
                onClick={() => onCloseMobile?.()}
                onMouseEnter={(e) => handleMouseEnterTooltip("Dashboard", e)}
                onMouseLeave={handleMouseLeaveTooltip}
                className={`flex items-center gap-3 h-10 px-3 rounded-full text-xs font-heading font-medium transition-all duration-150 ${
                  isDashboardActive
                    ? "bg-[var(--color-accent)] text-[#0B0B0A] font-bold shadow-xs"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
                } ${collapsed && !mobileOpen ? "justify-center px-0 w-10 h-10 mx-auto" : ""}`}
              >
                <LayoutDashboard size={18} className="shrink-0" />
                {(!collapsed || mobileOpen) && <span className="truncate">Dashboard</span>}
              </Link>

              {/* My Projects Button (Toggles project list visibility) */}
              <button
                type="button"
                onClick={() => {
                  if (collapsed && !mobileOpen) {
                    onToggleCollapse?.();
                  }
                  setShowProjects((prev) => !prev);
                }}
                onMouseEnter={(e) => handleMouseEnterTooltip("My Projects", e)}
                onMouseLeave={handleMouseLeaveTooltip}
                className={`flex items-center justify-between w-full h-10 px-3 rounded-full text-xs font-heading font-medium transition-all duration-150 ${
                  showProjects
                    ? "bg-[var(--color-surface-muted)] text-[var(--color-ink)] border border-[var(--color-border)] font-semibold shadow-2xs"
                    : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
                } ${collapsed && !mobileOpen ? "justify-center px-0 w-10 h-10 mx-auto" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FolderKanban size={18} className={`shrink-0 ${showProjects ? "text-[var(--color-accent-deep)]" : ""}`} />
                  {(!collapsed || mobileOpen) && (
                    <span className="truncate">My Projects</span>
                  )}
                </div>

                {(!collapsed || mobileOpen) && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[var(--color-accent)]/20 text-[var(--color-accent-deep)]">
                      {filteredProjects.length}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`text-[var(--color-ink-muted)] transition-transform duration-200 ${
                        showProjects ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                )}
              </button>
            </nav>
          </div>

          {/* PROJECTS LIST (ONLY SHOWN WHEN "MY PROJECTS" IS CLICKED / OPENED OR SEARCHED) */}
          {showProjects && (
            <div className="pt-2 animate-fadeIn space-y-1.5">
              {(!collapsed || mobileOpen) && (
                <div className="flex items-center justify-between px-3 pb-1">
                  <p className="text-[10px] font-heading font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
                    {searchQuery ? `Matching (${filteredProjects.length})` : "Workspaces"}
                  </p>
                  <Link
                    href="/dashboard/create"
                    onClick={() => onCloseMobile?.()}
                    className="text-xs font-heading font-semibold text-[var(--color-accent-deep)] hover:underline flex items-center gap-0.5"
                  >
                    <Plus size={14} /> New
                  </Link>
                </div>
              )}

              <div className="space-y-1">
                {filteredProjects.length === 0 ? (
                  <div className="px-3 py-2 text-[11px] text-[var(--color-ink-muted)]">
                    No projects found for "{searchQuery}"
                  </div>
                ) : (
                  filteredProjects.map((p) => {
                    const isCurrent = String(p._id) === String(currentProjectId);
                    const isExpanded = expandedProjects[p._id];

                    return (
                      <div key={p._id} className="space-y-1">
                        <div
                          onMouseEnter={(e) => handleMouseEnterTooltip(p.name, e)}
                          onMouseLeave={handleMouseLeaveTooltip}
                          className={`group flex items-center justify-between h-9 px-3 rounded-full text-xs font-heading transition-all duration-150 ${
                            isCurrent
                              ? "bg-[var(--color-accent)]/25 text-[var(--color-ink)] font-bold border border-[var(--color-accent)]"
                              : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-muted)]"
                          } ${collapsed && !mobileOpen ? "justify-center px-0 w-9 h-9 mx-auto" : ""}`}
                        >
                          <Link
                            href={`/project/${p._id}`}
                            onClick={() => onCloseMobile?.()}
                            className="flex items-center gap-2.5 truncate flex-1 min-w-0"
                          >
                            <span className="w-2 h-2 rounded-full bg-[var(--color-accent-deep)] shrink-0" />
                            {(!collapsed || mobileOpen) && <span className="truncate">{p.name}</span>}
                          </Link>

                          {(!collapsed || mobileOpen) && (
                            <button
                              onClick={(e) => toggleProjectExpand(p._id, e)}
                              className="p-1 rounded text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] shrink-0"
                            >
                              <ChevronRight
                                size={14}
                                className={`transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Expandable Project Sub-items */}
                        {isExpanded && (!collapsed || mobileOpen) && (
                          <div className="ml-4 pl-3.5 border-l border-[var(--color-border)] space-y-1 py-1">
                            <Link
                              href={`/project/${p._id}?tab=files`}
                              onClick={() => onCloseMobile?.()}
                              className="flex items-center gap-1.5 text-[11px] font-body text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] py-1 truncate"
                            >
                              <FileText size={12} className="opacity-70 shrink-0" />
                              <span>Files</span>
                            </Link>
                            <Link
                              href={`/project/${p._id}?tab=links`}
                              onClick={() => onCloseMobile?.()}
                              className="flex items-center gap-1.5 text-[11px] font-body text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] py-1 truncate"
                            >
                              <Link2 size={12} className="opacity-70 shrink-0" />
                              <span>Links</span>
                            </Link>
                            <Link
                              href={`/project/${p._id}?tab=members`}
                              onClick={() => onCloseMobile?.()}
                              className="flex items-center gap-1.5 text-[11px] font-body text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] py-1 truncate"
                            >
                              <Users size={12} className="opacity-70 shrink-0" />
                              <span>Members</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Footer Profile Card */}
        <div className="p-3 pt-4 border-t border-[var(--color-border)] shrink-0 bg-[var(--color-surface)]">
          {(!collapsed || mobileOpen) ? (
            <div className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-[12px] p-2.5 shadow-2xs flex items-center justify-between gap-2">
              <Link
                href="/settings"
                onClick={() => onCloseMobile?.()}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85 transition group cursor-pointer"
                title="Account Settings"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full border border-[var(--color-border)] object-cover shrink-0 group-hover:border-[var(--color-accent-deep)] transition"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-[#0B0B0A] font-heading font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    {(user?.name || "U")[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-heading font-semibold text-xs text-[var(--color-ink)] truncate group-hover:text-[var(--color-accent-deep)] transition">
                    {user?.name || "User"}
                  </p>
                  <p className="font-body text-[10px] text-[var(--color-ink-muted)] truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href="/settings"
                  onClick={() => onCloseMobile?.()}
                  className="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] rounded-lg transition cursor-pointer"
                  title="Account Settings"
                >
                  <Settings size={14} />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface)] rounded-lg transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex justify-center relative group"
              onMouseEnter={(e) => handleMouseEnterTooltip("Account Settings", e)}
              onMouseLeave={handleMouseLeaveTooltip}
            >
              <Link
                href="/settings"
                className="w-10 h-10 rounded-full overflow-hidden border border-[var(--color-border)] flex items-center justify-center transition-transform hover:scale-105 shadow-2xs focus:outline-none hover:border-[var(--color-accent-deep)]"
                title="Account Settings"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-accent)] text-[#0B0B0A] font-heading font-extrabold text-xs flex items-center justify-center">
                    {(user?.name || "U")[0].toUpperCase()}
                  </div>
                )}
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

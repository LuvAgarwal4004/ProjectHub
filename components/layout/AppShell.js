"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export function AppShell({
  children,
  projects = [],
  currentProjectId,
  title = "Dashboard",
  topbarActions,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("devhouse_sidebar_collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextState = !collapsed;
    setCollapsed(nextState);
    localStorage.setItem("devhouse_sidebar_collapsed", String(nextState));
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Sidebar Component */}
      <Sidebar
        projects={projects}
        currentProjectId={currentProjectId}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        {/* Topbar Component */}
        <Topbar
          title={title}
          projects={projects}
          currentProjectId={currentProjectId}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          actions={topbarActions}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;

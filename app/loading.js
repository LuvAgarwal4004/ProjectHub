"use client";

import { Skeleton, SidebarSkeleton, TopbarSkeleton, CardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--color-bg)]/75 backdrop-blur-md flex overflow-hidden pointer-events-none select-none">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:block">
        <SidebarSkeleton />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopbarSkeleton />

        <div className="p-6 max-w-7xl w-full mx-auto space-y-6 overflow-hidden">
          {/* Header Banner Skeleton */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[16px] p-6 space-y-3">
            <Skeleton className="w-32 h-4 rounded-md" />
            <Skeleton className="w-64 h-8 rounded-md" />
            <Skeleton className="w-96 h-4 rounded-md" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
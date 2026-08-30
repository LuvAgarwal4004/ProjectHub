import React from "react";

export function Skeleton({ className = "", rounded = "rounded-lg" }) {
  return (
    <div
      className={`bg-[var(--color-surface-muted)] animate-shimmer ${rounded} ${className}`}
    />
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="w-[260px] h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Logo Header */}
        <div className="flex items-center gap-2.5 pb-2">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-32 h-5 rounded-md" />
        </div>

        {/* Search */}
        <Skeleton className="w-full h-9 rounded-full" />

        {/* Navigation Section */}
        <div className="space-y-3 pt-2">
          <Skeleton className="w-20 h-3 rounded-xs mb-3" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
        </div>

        {/* Projects Section */}
        <div className="space-y-3 pt-4">
          <Skeleton className="w-24 h-3 rounded-xs mb-3" />
          <Skeleton className="w-full h-9 rounded-full" />
          <Skeleton className="w-full h-9 rounded-full" />
          <Skeleton className="w-full h-9 rounded-full" />
        </div>
      </div>

      {/* Footer Profile Card */}
      <Skeleton className="w-full h-14 rounded-[12px]" />
    </aside>
  );
}

export function TopbarSkeleton() {
  return (
    <div className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 flex items-center justify-between">
      <Skeleton className="w-48 h-6 rounded-md" />
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-28 h-9 rounded-full" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-5 rounded-md" />
      <Skeleton className="w-full h-4 rounded-md" />
      <Skeleton className="w-2/3 h-4 rounded-md" />
      <div className="pt-4 border-t border-[var(--color-border)] flex justify-between">
        <Skeleton className="w-20 h-3 rounded-sm" />
        <Skeleton className="w-12 h-3 rounded-sm" />
      </div>
    </div>
  );
}

export default Skeleton;

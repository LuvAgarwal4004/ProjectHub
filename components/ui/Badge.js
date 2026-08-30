import React from "react";

export function Badge({
  children,
  role,
  variant = "default",
  className = "",
}) {
  // Normalize role to variant if provided
  let activeVariant = variant;
  if (role) {
    const normalizedRole = String(role).toLowerCase();
    if (normalizedRole === "admin" || normalizedRole === "owner") {
      activeVariant = "admin";
    } else if (normalizedRole === "editor") {
      activeVariant = "editor";
    } else if (normalizedRole === "viewer") {
      activeVariant = "viewer";
    }
  }

  const variants = {
    admin:
      "bg-[var(--color-accent)]/15 dark:bg-[var(--color-surface-muted)] text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 dark:border-[var(--color-border)] font-bold",
    editor:
      "bg-[var(--color-accent)]/15 dark:bg-[var(--color-surface-muted)] text-[var(--color-accent-deep)] border border-[var(--color-accent)]/30 dark:border-[var(--color-border)] font-semibold",
    viewer:
      "bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)]",
    default:
      "bg-[var(--color-surface-muted)] text-[var(--color-ink)] border border-[var(--color-border)]",
    accent:
      "bg-[var(--color-accent)] text-[#0B0B0A] font-bold",
    danger:
      "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-heading font-medium tracking-wider uppercase select-none ${
        variants[activeVariant] || variants.default
      } ${className}`}
    >
      {role ? role : children}
    </span>
  );
}

export default Badge;

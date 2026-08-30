import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-heading font-semibold tracking-tight transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[#0B0B0A] rounded-full shadow-xs active:scale-[0.98]",
    secondary:
      "bg-[var(--color-surface)] hover:bg-[var(--color-surface-muted)] text-[var(--color-ink)] border border-[var(--color-border)] rounded-full shadow-2xs active:scale-[0.98]",
    dark:
      "bg-[#0B0B0A] dark:bg-[var(--color-surface-muted)] hover:bg-black dark:hover:bg-[var(--color-border)] text-[var(--color-accent)] border border-transparent dark:border-[var(--color-border)] rounded-full shadow-xs active:scale-[0.98]",
    outline:
      "bg-transparent border border-[var(--color-border)] hover:border-[var(--color-accent-deep)] text-[var(--color-ink)] rounded-full",
    ghost:
      "bg-transparent hover:bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] rounded-full",
    danger:
      "bg-[var(--color-danger)] hover:opacity-90 text-white rounded-full shadow-xs active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
    icon: "p-2 text-sm rounded-full aspect-square",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

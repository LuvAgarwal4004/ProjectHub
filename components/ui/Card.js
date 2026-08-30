import React from "react";

export function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-150 ${
        hoverable ? "hover:border-[var(--color-ink-muted)] hover:shadow-md cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  description,
  badgeText,
  className = "",
}) {
  return (
    <Card className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-deep)] font-heading text-lg">
          {icon}
        </div>
        {badgeText && (
          <span className="text-[10px] font-heading uppercase px-2 py-0.5 rounded-full bg-[var(--color-surface-muted)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-heading font-semibold text-[var(--color-ink)] text-base tracking-tight">
          {title}
        </h3>
        <p className="font-body text-[var(--color-ink-muted)] text-sm mt-1 leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}

export default Card;

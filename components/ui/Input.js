import React from "react";

export function Input({
  label,
  error,
  helperText,
  className = "",
  containerClassName = "",
  id,
  type = "text",
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-heading font-medium tracking-wide uppercase text-[var(--color-ink-muted)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-sm rounded-[12px] border border-[var(--color-border)] px-3.5 py-2.5 outline-none transition-all placeholder:text-[var(--color-ink-soft)] focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 ${
          error ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20" : ""
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs font-body text-[var(--color-danger)]">{error}</span>
      ) : helperText ? (
        <span className="text-xs font-body text-[var(--color-ink-muted)]">{helperText}</span>
      ) : null}
    </div>
  );
}

export function Textarea({
  label,
  error,
  helperText,
  className = "",
  containerClassName = "",
  id,
  rows = 4,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-heading font-medium tracking-wide uppercase text-[var(--color-ink-muted)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full bg-[var(--color-surface)] text-[var(--color-ink)] font-body text-sm rounded-[12px] border border-[var(--color-border)] px-3.5 py-2.5 outline-none transition-all placeholder:text-[var(--color-ink-soft)] focus:border-[var(--color-accent-deep)] focus:ring-2 focus:ring-[var(--color-accent)]/40 ${
          error ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20" : ""
        } ${className}`}
        {...props}
      />
      {error ? (
        <span className="text-xs font-body text-[var(--color-danger)]">{error}</span>
      ) : helperText ? (
        <span className="text-xs font-body text-[var(--color-ink-muted)]">{helperText}</span>
      ) : null}
    </div>
  );
}

export default Input;

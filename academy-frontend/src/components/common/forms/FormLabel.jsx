"use client";

export default function FormLabel({
  htmlFor,
  required = false,
  children,
  className = "",
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`
        inline-flex
        items-center
        gap-1
        text-sm
        font-medium
        text-[var(--foreground)]
        transition-colors
        ${className}
      `}
    >
      {children}
      {required && (
        <span
          className="text-[var(--destructive)]"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  );
}
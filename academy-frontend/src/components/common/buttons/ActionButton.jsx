"use client";

import clsx from "clsx";

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700",

  secondary:
    "bg-gray-100 text-gray-700 hover:bg-gray-200",

  success:
    "bg-green-600 text-white hover:bg-green-700",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  warning:
    "bg-yellow-500 text-white hover:bg-yellow-600",

  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",

  ghost:
    "text-gray-600 hover:bg-gray-100",
};

const sizes = {
  xs: "px-2 py-1 text-xs",

  sm: "px-3 py-1.5 text-sm",

  md: "px-4 py-2 text-sm",

  lg: "px-5 py-2.5 text-base",
};

export default function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  title = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            opacity=".25"
          />

          <path
            d="M22 12a10 10 0 00-10-10"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>
      ) : (
        Icon && <Icon size={18} />
      )}

      {label && <span>{label}</span>}
    </button>
  );
}
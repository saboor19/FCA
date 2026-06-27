"use client";

import React from "react";

export default function TableCell({
  row,
  column,
  compact = false,
  isFirst = false,
  isLast = false,
}) {
  const {
    key,
    render,
    align = "left",
    className = "",
    cellClassName,
  } = column;

  const value = row[key];
  const content = typeof render === "function" ? render(row) : (value ?? "—");

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align] || "text-left";

  return (
    <td
      className={`
        whitespace-nowrap
        px-6
        ${compact ? "py-2.5" : "py-4"}
        text-sm
        text-[var(--foreground)]
        ${alignClass}
        transition-colors
        group-hover/row:text-[var(--foreground)]
        ${isFirst ? "rounded-l-lg" : ""}
        ${isLast ? "rounded-r-lg" : ""}
        ${cellClassName ?? className}
      `}
    >
      {content}
    </td>
  );
}
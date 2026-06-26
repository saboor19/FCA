"use client";

import clsx from "clsx";

const STATUS_STYLES = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  PUBLISHED: "bg-blue-100 text-blue-700",
  DRAFT: "bg-gray-100 text-gray-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  UPCOMING: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function StatusBadge({
  status,
  className = "",
}) {
  const normalizedStatus = String(status || "").toUpperCase();

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize",
        STATUS_STYLES[normalizedStatus] ||
          "bg-gray-100 text-gray-700",
        className
      )}
    >
      {status}
    </span>
  );
}
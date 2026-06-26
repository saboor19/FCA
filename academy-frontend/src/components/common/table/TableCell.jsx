"use client";

import React from "react";

export default function TableCell({
  row,
  column,
}) {
  const {
    key,
    render,
    className = "",
  } = column;

  return (
    <td
      className={`px-6 py-4 text-sm text-gray-700 whitespace-nowrap ${className}`}
    >
      {typeof render === "function"
        ? render(row)
        : row[key] ?? "-"}
    </td>
  );
}
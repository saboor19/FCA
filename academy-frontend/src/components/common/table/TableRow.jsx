"use client";

import TableCell from "./TableCell";

export default function TableRow({
  row,
  columns,
  onRowClick,
  className = "",
  compact = false,
  index,
}) {
  const handleClick = () => {
    onRowClick?.(row);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick?.(row);
    }
  };

  const isClickable = !!onRowClick;

  return (
    <tr
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? "button" : undefined}
      aria-label={isClickable ? `View details for ${row.title || row.name || "item"}` : undefined}
      className={`
        group/row
        border-b
        border-[var(--border)]
        outline-none
        transition-all
        duration-200
        ${isClickable ? "cursor-pointer hover:bg-[var(--muted)]/60" : "hover:bg-[var(--muted)]/40"}
        focus-visible:bg-[var(--muted)]
        focus-visible:ring-2
        focus-visible:ring-inset
        focus-visible:ring-[var(--primary)]/20
        ${className}
      `}
    >
      {columns.map((column, colIndex) => (
        <TableCell
          key={column.key ?? colIndex}
          row={row}
          column={column}
          compact={compact}
          isFirst={colIndex === 0}
          isLast={colIndex === columns.length - 1}
        />
      ))}
    </tr>
  );
}
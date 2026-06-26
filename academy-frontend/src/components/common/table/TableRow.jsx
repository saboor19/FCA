"use client";

import TableCell from "./TableCell";

export default function TableRow({
  row,
  columns,
  onRowClick,
  className = "",
}) {
  return (
    <tr
      onClick={() => onRowClick?.(row)}
      className={`
        border-b border-gray-200
        hover:bg-gray-50
        transition-colors
        ${onRowClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {columns.map((column) => (
        <TableCell
          key={column.key}
          row={row}
          column={column}
        />
      ))}
    </tr>
  );
}
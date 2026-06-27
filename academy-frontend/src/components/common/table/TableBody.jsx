"use client";

import TableRow from "./TableRow";

export default function TableBody({
  columns = [],
  data = [],
  keyField = "_id",
  onRowClick,
  rowClassName = "",
  compact = false,
}) {
  return (
    <tbody className="divide-y divide-[var(--border)]">
      {data.map((row, index) => (
        <TableRow
          key={row[keyField] ?? index}
          row={row}
          columns={columns}
          onRowClick={onRowClick}
          className={rowClassName}
          compact={compact}
          index={index}
        />
      ))}
    </tbody>
  );
}
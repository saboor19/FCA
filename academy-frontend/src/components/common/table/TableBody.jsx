"use client";

import TableRow from "./TableRow";

export default function TableBody({
  columns = [],
  data = [],
  keyField = "_id",
  onRowClick,
  rowClassName = "",
}) {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {data.map((row, index) => (
        <TableRow
          key={row[keyField] ?? index}
          row={row}
          columns={columns}
          onRowClick={onRowClick}
          className={rowClassName}
        />
      ))}
    </tbody>
  );
}
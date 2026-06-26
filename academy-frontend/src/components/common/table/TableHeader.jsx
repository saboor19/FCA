"use client";

export default function TableHeader({
  columns = [],
  className = "",
}) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`
              px-6 py-3
              text-left
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-gray-600
              whitespace-nowrap
              ${column.headerClassName || ""}
            `}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
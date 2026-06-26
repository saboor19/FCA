"use client";

export default function TableLoader({
  rows = 5,
  columns = 5,
}) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="animate-pulse border-b border-gray-200"
        >
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <td
              key={columnIndex}
              className="px-6 py-4"
            >
              <div className="h-4 w-full rounded bg-gray-200" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
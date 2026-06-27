"use client";

export default function TableLoader({
  rows = 5,
  columns = 5,
  compact = false,
}) {
  return (
    <tbody className="divide-y divide-[var(--border)]">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="transition-opacity"
          style={{
            opacity: 1 - rowIndex * 0.15, // Fade out deeper rows
          }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td
              key={colIndex}
              className={`
                px-6
                ${compact ? "py-2.5" : "py-4"}
              `}
            >
              <div
                className={`
                  h-4
                  rounded-md
                  bg-[var(--muted)]
                  animate-pulse
                  ${colIndex === 0 ? "w-3/4" : colIndex === columns - 1 ? "w-2/3 ml-auto" : "w-full"}
                `}
                style={{
                  animationDelay: `${(rowIndex * 0.12) + (colIndex * 0.06)}s`,
                  animationDuration: "1.5s",
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
"use client";

export default function TableHeader({ columns = [], compact = false }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr
        className={`
          border-b
          border-[var(--border)]
          bg-[var(--muted)]/80
          backdrop-blur-sm
        `}
      >
        {columns.map((column, index) => (
          <th
            key={column.key ?? index}
            scope="col"
            className={`
              whitespace-nowrap
              px-6
              ${compact ? "py-2.5" : "py-3.5"}
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-[var(--muted-foreground)]
              transition-colors
              first:rounded-tl-2xl
              last:rounded-tr-2xl
              ${column.headerClassName ?? ""}
            `}
            style={{ width: column.width, minWidth: column.minWidth }}
          >
            <div className="flex items-center gap-1.5">
              {column.headerIcon && (
                <column.headerIcon className="h-3.5 w-3.5 opacity-60" />
              )}
              <span>{column.header}</span>
              {column.sortable && (
                <button
                  className="ml-1 rounded p-0.5 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  aria-label={`Sort by ${column.header}`}
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                </button>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
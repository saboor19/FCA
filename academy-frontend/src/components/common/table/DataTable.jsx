"use client";

import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import EmptyTable from "./EmptyTable";
import TableLoader from "./TableLoader";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  keyField = "_id",

  emptyTitle = "No Data Found",
  emptyDescription = "There is nothing to display.",

  onRowClick,

  className = "",
  tableClassName = "",
  rowClassName = "",

  striped = false,
  hover = true,
  compact = false,
}) {
  return (
    <div
      className={`
        group
        overflow-hidden
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        shadow-sm
        transition-all
        duration-300
        hover:shadow-md
        ${className}
      `}
    >
      <div className="overflow-x-auto">
        <table
          className={`
            w-full
            border-collapse
            text-left
            ${tableClassName}
          `}
        >
          <TableHeader columns={columns} compact={compact} />

          {loading ? (
            <TableLoader
              rows={Math.min(data.length || 5, 8)}
              columns={columns.length}
              compact={compact}
            />
          ) : data.length === 0 ? (
            <EmptyTable
              colSpan={columns.length}
              title={emptyTitle}
              description={emptyDescription}
            />
          ) : (
            <TableBody
              columns={columns}
              data={data}
              keyField={keyField}
              onRowClick={onRowClick}
              rowClassName={`
                transition-colors
                duration-200
                ${hover ? "hover:bg-[var(--muted)]/60" : ""}
                ${
                  striped
                    ? "odd:bg-[var(--card)] even:bg-[var(--muted)]/30"
                    : ""
                }
                ${onRowClick ? "cursor-pointer" : ""}
                ${rowClassName}
              `}
              compact={compact}
            />
          )}
        </table>
      </div>

      {/* Bottom gradient fade for overflow hint */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--card)] to-transparent opacity-0 transition-opacity group-hover:opacity-100 sm:hidden"
        aria-hidden="true"
      />
    </div>
  );
}
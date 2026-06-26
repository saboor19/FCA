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
}) {
  return (
    <div
      className={`
        overflow-x-auto
        rounded-lg
        border
        border-gray-200
        bg-white
        shadow-sm
        ${className}
      `}
    >
      <table
        className={`
          min-w-full
          border-collapse
          ${tableClassName}
        `}
      >
        <TableHeader columns={columns} />

        {loading ? (
          <TableLoader
            rows={5}
            columns={columns.length}
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
              ${hover ? "hover:bg-gray-50" : ""}
              ${
                striped
                  ? "odd:bg-white even:bg-gray-50/40"
                  : ""
              }
              ${rowClassName}
            `}
          />
        )}
      </table>
    </div>
  );
}
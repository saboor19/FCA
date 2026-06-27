"use client";

import { FileSearch } from "lucide-react";

export default function EmptyTable({
  colSpan = 1,
  title = "No Data Found",
  description = "There is nothing to display.",
}) {
  return (
    <tbody>
      <tr>
        <td colSpan={colSpan} className="px-6 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)]">
              <FileSearch className="h-8 w-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
              {title}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-[var(--muted-foreground)]">
              {description}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
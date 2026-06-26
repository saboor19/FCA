"use client";

import { Inbox } from "lucide-react";

export default function EmptyTable({
  title = "No Data Found",
  description = "There is nothing to display.",
  icon: Icon = Inbox,
  colSpan = 1,
}) {
  return (
    <tbody>
      <tr>
        <td
          colSpan={colSpan}
          className="px-6 py-16"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Icon
              size={48}
              className="mb-4 text-gray-400"
            />

            <h3 className="text-lg font-semibold text-gray-800">
              {title}
            </h3>

            <p className="mt-2 max-w-md text-sm text-gray-500">
              {description}
            </p>
          </div>
        </td>
      </tr>
    </tbody>
  );
}
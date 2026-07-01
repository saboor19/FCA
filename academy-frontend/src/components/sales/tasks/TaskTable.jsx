"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  CheckCircle2,
  LoaderCircle,
  Clock3,
  XCircle,
} from "lucide-react";
import { TASK_STATUS } from "@/constants/salesConstants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskStatusBadge from "./TaskStatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TaskTable({
  tasks = [],

  loading,

  onEdit,

  onDelete,

  onStatusChange,
}) {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "LOW":
        return "secondary";

      case "MEDIUM":
        return "default";

      case "HIGH":
        return "destructive";

      case "URGENT":
        return "destructive";

      default:
        return "outline";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "COMPLETED":
        return "default";

      case "IN_PROGRESS":
        return "secondary";

      case "PENDING":
        return "outline";

      case "CANCELLED":
        return "destructive";

      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Loading tasks...
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="border rounded-lg p-10 text-center">
        <h3 className="text-lg font-semibold">No Tasks Found</h3>

        <p className="text-muted-foreground mt-2">
          Create your first task for this lead.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[var(--border)] bg-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Title
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Assigned To
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Priority
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Status
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Due Date
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task._id}
                className="border-b border-[var(--border)] transition-colors hover:bg-[var(--muted)]/40"
              >
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">{task.title}</p>

                    {task.description && (
                      <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium">
                      {task.assignedTo?.userId?.fullName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {task.assignedTo?.employeeId}
                    </p>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <TaskPriorityBadge priority={task.priority} />
                </td>

                <td className="px-4 py-4">
                  <TaskStatusBadge status={task.status} />
                </td>

                <td className="px-4 py-4">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>

                <td className="px-4 py-4">
                  <td className="px-4 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => onStatusChange(task, "PENDING")}
                        >
                          <Clock3 className="mr-2 h-4 w-4" />
                          Mark Pending
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onStatusChange(task, "IN_PROGRESS")}
                        >
                          <LoaderCircle className="mr-2 h-4 w-4" />
                          Mark In Progress
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onStatusChange(task, "COMPLETED")}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Completed
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onStatusChange(task, "CANCELLED")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Task
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDelete(task._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

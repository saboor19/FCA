"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TASK_STATUS, TASK_PRIORITY } from "@/constants/salesConstants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TaskFilters({
  filters,

  setFilters,
}) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {/* Search */}

      <Input
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            search: e.target.value,
          }))
        }
      />

      {/* Status */}

      <Select
        value={filters.status || "ALL"}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            status: value === "ALL" ? "" : value,
          }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Status</SelectItem>

          {TASK_STATUS.map((status) => (
            <SelectItem key={status} value={status}>
              {status.replace("_", " ")}
            </SelectItem>
          ))}

          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority */}

      <Select
        value={filters.priority || "ALL"}
        onValueChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            priority: value === "ALL" ? "" : value,
          }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">All Priority</SelectItem>

          {TASK_PRIORITY.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {priority.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}

      <Button
        variant="outline"
        onClick={() =>
          setFilters({
            search: "",

            status: "",

            priority: "",

            assignedTo: "",
          })
        }
      >
        Reset Filters
      </Button>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";

export default function TaskStatusBadge({ status }) {
  const variants = {
    PENDING: "outline",

    IN_PROGRESS: "secondary",

    COMPLETED: "default",

    CANCELLED: "destructive",
  };

  return (
    <Badge variant={variants[status] || "outline"}>
      {status.replace("_", " ")}
    </Badge>
  );
}

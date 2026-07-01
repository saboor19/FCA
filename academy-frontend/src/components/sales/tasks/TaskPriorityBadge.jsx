"use client";

import { Badge } from "@/components/ui/badge";

export default function TaskPriorityBadge({ priority }) {
  const variants = {
    LOW: "secondary",

    MEDIUM: "default",

    HIGH: "destructive",

    URGENT: "destructive",
  };

  return <Badge variant={variants[priority] || "outline"}>{priority}</Badge>;
}

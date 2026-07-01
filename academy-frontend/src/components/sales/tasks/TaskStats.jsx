"use client";

import { CheckCircle2, Clock3, ListTodo, Timer } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function TaskStats({ tasks = [] }) {
  const total = tasks.length;

  const pending = tasks.filter((task) => task.status === "PENDING").length;

  const inProgress = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;

  const completed = tasks.filter((task) => task.status === "COMPLETED").length;

  const stats = [
    {
      title: "Total Tasks",
      value: total,
      icon: ListTodo,
    },

    {
      title: "Pending",
      value: pending,
      icon: Clock3,
    },

    {
      title: "In Progress",
      value: inProgress,
      icon: Timer,
    },

    {
      title: "Completed",
      value: completed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>

                <h2 className="text-3xl font-bold mt-1">{item.value}</h2>
              </div>

              <Icon className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import TaskForm from "./TaskForm";

export default function TaskDialog({
  open,

  onOpenChange,

  leadId,

  task,

  onSuccess,
}) {
  const handleSuccess = () => {
    onOpenChange(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>

          <DialogDescription>
            {task
              ? "Update the task details."
              : "Create a new task for this lead."}
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          leadId={leadId}
          task={task}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

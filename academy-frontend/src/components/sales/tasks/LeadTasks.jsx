"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { updateLeadTask } from "@/services/sales/taskService";
import { Button } from "@/components/ui/button";

import { getLeadTasks, deleteLeadTask } from "@/services/sales/taskService";
import TaskStats from "./TaskStats";
import TaskTable from "./TaskTable";
import TaskDialog from "./TaskDialog";
import TaskFilters from "./TaskFilters";
export default function LeadTasks({ leadId }) {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const [filters, setFilters] = useState({
    search: "",

    status: "",

    priority: "",

    assignedTo: "",
  });

  const loadTasks = async () => {
    try {
      setLoading(true);

      const res = await getLeadTasks(
        leadId,

        filters,
      );

      setTasks(res.tasks || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await updateLeadTask(task._id, {
        status,
      });

      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (leadId) {
      loadTasks();
    }
  }, [leadId, filters]);
  const handleCreate = () => {
    setSelectedTask(null);

    setOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);

    setOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (!confirm("Delete this task?")) {
      return;
    }

    try {
      await deleteLeadTask(taskId);

      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">...</div>
        <TaskStats tasks={tasks} />
        {/* Filters */}
        ...
      </div>

      <TaskFilters filters={filters} setFilters={setFilters} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Lead Tasks</h2>

          <p className="text-sm text-muted-foreground">
            Manage all tasks assigned to this lead.
          </p>
        </div>

        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <TaskTable
        tasks={tasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <TaskDialog
        open={open}
        onOpenChange={setOpen}
        leadId={leadId}
        task={selectedTask}
        onSuccess={loadTasks}
      />
    </div>
  );
}

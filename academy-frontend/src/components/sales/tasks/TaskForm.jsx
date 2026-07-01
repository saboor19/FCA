"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUS, TASK_PRIORITY } from "@/constants/salesConstants";
import { createLeadTask, updateLeadTask } from "@/services/sales/taskService";

import { getSalesTeam } from "@/services/sales/salesTeamService";

export default function TaskForm({
  leadId,

  task,

  onSuccess,

  onCancel,
}) {
  const [salesTeam, setSalesTeam] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",

    description: "",

    assignedTo: "",

    priority: "MEDIUM",

    status: "PENDING",

    dueDate: "",

    remarks: "",
  });

  useEffect(() => {
    loadSalesTeam();
  }, []);

  useEffect(() => {
    if (!task) return;

    setFormData({
      title: task.title || "",

      description: task.description || "",

      assignedTo: task.assignedTo?._id || "",

      priority: task.priority || "MEDIUM",

      status: task.status || "PENDING",

      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",

      remarks: task.remarks || "",
    });
  }, [task]);

  const loadSalesTeam = async () => {
    try {
      const res = await getSalesTeam();

      setSalesTeam(res.salesTeam || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!formData.title.trim()) {
      validationErrors.title = "Title is required.";
    }

    if (!formData.assignedTo) {
      validationErrors.assignedTo = "Please select a salesperson.";
    }

    if (!formData.dueDate) {
      validationErrors.dueDate = "Due date is required.";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = { ...formData };

      // Don't send status while creating a task
      if (!task) {
        delete payload.status;

        await createLeadTask(leadId, payload);
      } else {
        await updateLeadTask(task._id, payload);
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {/* Title */}

        <div className="md:col-span-2 space-y-2">
          <Label>Title</Label>

          <Input
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter task title"
          />

          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Assigned To */}

        <div className="space-y-2">
          <Label>Assign To</Label>

          <Select
            value={formData.assignedTo}
            onValueChange={(value) => handleChange("assignedTo", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Sales Person" />
            </SelectTrigger>

            <SelectContent>
              {salesTeam.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {member.userId?.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.assignedTo && (
            <p className="text-sm text-red-500">{errors.assignedTo}</p>
          )}
        </div>

        {/* Priority */}

        <div className="space-y-2">
          <Label>Priority</Label>

          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange("priority", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {TASK_PRIORITY.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {task && (
          <div className="space-y-2">
            <Label>Status</Label>

            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {TASK_STATUS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Due Date */}

        <div className="space-y-2">
          <Label>Due Date</Label>

          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />

          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate}</p>
          )}
        </div>

        {/* Description */}

        <div className="md:col-span-2 space-y-2">
          <Label>Description</Label>

          <Textarea
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Task description"
          />
        </div>

        {/* Remarks */}

        <div className="md:col-span-2 space-y-2">
          <Label>Remarks</Label>

          <Textarea
            rows={3}
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            placeholder="Internal remarks"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}

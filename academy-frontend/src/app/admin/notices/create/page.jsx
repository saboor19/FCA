"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BellPlus,
  Loader2,
  ArrowLeft,
  Send,
  Save,
  Paperclip,
  Plus,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";

import RichTextEditor from "@/components/common/forms/RichTextEditor"; // <-- use this
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { createNotice } from "@/services/admin/noticeService";
import { getBatches } from "@/services/admin/batchService";

export default function CreateNoticePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [availableBatches, setAvailableBatches] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "GENERAL",
    priority: "MEDIUM",
    targetAudience: "ALL",
    batches: [],
    isPublished: true,
    publishDate: "",
    expiryDate: "",
    attachments: [],
  });

  const [newAttachment, setNewAttachment] = useState({ fileName: "", fileUrl: "" });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await getBatches();
        setAvailableBatches(res.data || []);
      } catch (err) {
        console.error("Failed to load batches", err);
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBatchSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData({
      ...formData,
      batches: selectedOptions,
    });
  };

  const handleAddAttachment = () => {
    if (newAttachment.fileName && newAttachment.fileUrl) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));
      setNewAttachment({ fileName: "", fileUrl: "" });
    }
  };

  const handleRemoveAttachment = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TipTap empty state can be <p></p> or empty string
    const isEmpty = !formData.description || formData.description === "<p></p>" || formData.description.trim() === "";
    if (isEmpty) {
      alert("Please enter a description.");
      return;
    }

    try {
      setLoading(true);
      await createNotice(formData);
      router.push("/admin/notices");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to publish notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="mx-auto max-w-4xl pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={16} />
          Back to Notices
        </button>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm md:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="mb-2 flex items-center gap-3 text-2xl font-bold text-[var(--foreground)]">
                <div className="rounded-xl bg-[var(--primary)]/10 p-2 text-[var(--primary)]">
                  <BellPlus size={24} />
                </div>
                Create Notice
              </h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Draft and publish a new announcement for the academy.
              </p>
            </div>

            {/* Publish Toggle */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3 transition-colors hover:bg-[var(--muted)]">
              <span className="text-sm font-medium text-[var(--foreground)]">
                {formData.isPublished ? "Publish Live" : "Save as Draft"}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`block h-6 w-10 rounded-full transition-colors ${
                    formData.isPublished ? "bg-emerald-500" : "bg-[var(--muted-foreground)]/30"
                  }`}
                />
                <div
                  className={`dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    formData.isPublished ? "translate-x-4" : ""
                  }`}
                />
              </div>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                Notice Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Upcoming Semester Examinations"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-all focus:border-[var(--primary)] focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            {/* Rich Text Editor — Using your existing component */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                Description / Content
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, description: html }))
                }
                placeholder="Write the full details of the notice here..."
                minHeight="200px"
              />
            </div>

            {/* Type + Priority */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                  Notice Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                >
                  <option value="GENERAL">General</option>
                  <option value="ACADEMIC">Academic</option>
                  <option value="EXAM">Exam</option>
                  <option value="HOLIDAY">Holiday</option>
                  <option value="EVENT">Event</option>
                  <option value="FEE">Fee</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            {/* Audience + Batches */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                  Target Audience
                </label>
                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                >
                  <option value="ALL">All Academy</option>
                  <option value="STUDENTS">All Students</option>
                  <option value="TEACHERS">All Teachers</option>
                  <option value="STAFF">All Staff</option>
                  <option value="BATCH">Specific Batch(es)</option>
                </select>
              </div>

              {formData.targetAudience === "BATCH" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                    Select Batches
                  </label>
                  <select
                    multiple
                    name="batches"
                    value={formData.batches}
                    onChange={handleBatchSelect}
                    className="h-32 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    required
                  >
                    {availableBatches.map((batch) => (
                      <option key={batch._id} value={batch._id} className="p-2">
                        {batch.name} ({batch.course?.title || "No Course"})
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                    Hold Ctrl (Windows) or Cmd (Mac) to select multiple batches.
                  </p>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                  Publish Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="publishDate"
                  value={formData.publishDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
                <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                  Leave blank to publish immediately.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--muted-foreground)]">
                  Expiry Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
                <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                  Notice will automatically hide after this date.
                </p>
              </div>
            </div>

            {/* Attachments */}
            <div className="rounded-xl border border-[var(--border)] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)]">
                  <Paperclip size={16} /> Attachments
                </label>
                <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs font-bold text-[var(--muted-foreground)]">
                  {formData.attachments.length} Files
                </span>
              </div>

              {formData.attachments.length > 0 && (
                <ul className="mb-4 space-y-2">
                  {formData.attachments.map((file, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-3 group"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <LinkIcon size={14} className="shrink-0 text-[var(--muted-foreground)]" />
                        <span className="truncate text-sm font-medium text-[var(--foreground)]">
                          {file.fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="rounded p-1.5 text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-500"
                        title="Remove Attachment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col gap-3 border-t border-dashed border-[var(--border)] pt-4 sm:flex-row">
                <input
                  type="text"
                  placeholder="Display Name (e.g., Syllabus PDF)"
                  value={newAttachment.fileName}
                  onChange={(e) => setNewAttachment({ ...newAttachment, fileName: e.target.value })}
                  className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-2 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 sm:w-1/3"
                />
                <input
                  type="url"
                  placeholder="File URL (https://...)"
                  value={newAttachment.fileUrl}
                  onChange={(e) => setNewAttachment({ ...newAttachment, fileUrl: e.target.value })}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-2 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  disabled={!newAttachment.fileName || !newAttachment.fileUrl}
                  className="inline-flex items-center justify-center gap-1 rounded-xl bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--primary)]/10 disabled:opacity-50"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="border-t border-[var(--border)] pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-medium text-white shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                  formData.isPublished
                    ? "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
                    : "bg-[var(--secondary)] hover:bg-[var(--foreground)]"
                }`}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : formData.isPublished ? (
                  <Send className="h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {loading ? "Processing..." : formData.isPublished ? "Publish Notice" : "Save as Draft"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
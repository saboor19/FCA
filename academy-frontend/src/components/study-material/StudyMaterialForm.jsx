"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, X, Check } from "lucide-react";
import RichTextEditor from "@/components/common/forms/RichTextEditor";
import {
  Input,
  Select,
  Textarea,
  FileUpload,
} from "@/components/common/forms";

import ActionButton from "@/components/common/buttons/ActionButton";

/* ═══════════════════════════════════════════════════════════════
   STUDY MATERIAL FORM
   Create/Edit • Shared batch selection • Theme-consistent
   ═══════════════════════════════════════════════════════════════ */

export default function StudyMaterialForm({
  initialValues = {},
  batches = [],
  loading = false,
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    sourceBatch: "",
    course: "",
    moduleId: "",
    visibility: "BATCH_ONLY",
    sharedBatches: [],
    file: null,
  });

  /* ── Sync with initialValues ── */
  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
        // Ensure sharedBatches is always an array
        sharedBatches: initialValues.sharedBatches || [],
      }));
    }
  }, [initialValues]);

  /* ── Derived options ── */
  const batchOptions = batches.map((batch) => ({
    label: batch.name,
    value: batch._id,
  }));

  const selectedBatch = batches.find(
    (batch) => batch._id === formData.sourceBatch
  );

  const courseOptions = selectedBatch
    ? [
        {
          label: selectedBatch.course.title,
          value: selectedBatch.course._id,
        },
      ]
    : [];

  const moduleOptions = selectedBatch
    ? selectedBatch.course.modules.map((module) => ({
        label: module.title,
        value: module._id,
      }))
    : [];

  /* ── Shareable batches = all assigned except source ── */
  const shareableBatches = batches.filter(
    (batch) => batch._id !== formData.sourceBatch
  );

  const isSharedVisibility = formData.visibility === "SHARED_BATCHES";

  /* ── Handlers ── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "sourceBatch") {
      const batch = batches.find((b) => b._id === value);

      setFormData((prev) => ({
        ...prev,
        sourceBatch: value,
        course: batch?.course._id || "",
        moduleId: "",
        // Clear shared batches when source batch changes
        sharedBatches: [],
      }));
      return;
    }

    if (name === "visibility") {
      setFormData((prev) => ({
        ...prev,
        visibility: value,
        // Reset shared batches when switching away from SHARED_BATCHES
        sharedBatches: value === "SHARED_BATCHES" ? prev.sharedBatches : [],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [batches]);

  const toggleSharedBatch = useCallback((batchId) => {
    setFormData((prev) => {
      const current = new Set(prev.sharedBatches);
      if (current.has(batchId)) {
        current.delete(batchId);
      } else {
        current.add(batchId);
      }
      return { ...prev, sharedBatches: Array.from(current) };
    });
  }, []);

  const selectAllShared = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      sharedBatches: shareableBatches.map((b) => b._id),
    }));
  }, [shareableBatches]);

  const clearAllShared = useCallback(() => {
    setFormData((prev) => ({ ...prev, sharedBatches: [] }));
  }, []);

  const handleFileChange = useCallback((file) => {
    setFormData((prev) => ({ ...prev, file }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  /* ── Render ── */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      {/* Summary */}
<RichTextEditor
  label="Summary"
  value={formData.summary}
  onChange={(html) => handleChange({ target: { name: "summary", value: html } })}
  placeholder="Brief description of the material..."
  rows={4}
/>

      {/* Batch & Course */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Select
          label="Batch"
          name="sourceBatch"
          value={formData.sourceBatch}
          onChange={handleChange}
          options={batchOptions}
          placeholder="Select a batch"
          required
        />

        <Select
          label="Course"
          name="course"
          value={formData.course}
          options={courseOptions}
          disabled
          placeholder="Auto-filled from batch"
        />
      </div>

      {/* Module & Visibility */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Select
          label="Module"
          name="moduleId"
          value={formData.moduleId}
          onChange={handleChange}
          options={moduleOptions}
          placeholder="Select a module"
          required
        />

        <Select
          label="Visibility"
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          options={[
            { label: "Batch Only", value: "BATCH_ONLY" },
            { label: "Shared Batches", value: "SHARED_BATCHES" },
          ]}
        />
      </div>

      {/* ═══════════════════════════════════════════════
          SHARED BATCHES SELECTOR
          ═══════════════════════════════════════════════ */}
      {isSharedVisibility && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-200">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-[var(--primary)]" />
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Share With Batches
              </h3>
              <span className="rounded-full bg-[var(--primary)]/10 px-2 py-0.5 text-xs font-medium text-[var(--primary)]">
                {formData.sharedBatches.length} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selectAllShared}
                className="text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
              >
                Select all
              </button>
              <span className="text-[var(--border)]">|</span>
              <button
                type="button"
                onClick={clearAllShared}
                className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {shareableBatches.length === 0 ? (
            <div className="rounded-xl bg-[var(--muted)]/50 py-8 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                No other batches available to share with.
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]/70">
                Select a source batch first.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {shareableBatches.map((batch) => {
                const isSelected = formData.sharedBatches.includes(batch._id);
                return (
                  <button
                    key={batch._id}
                    type="button"
                    onClick={() => toggleSharedBatch(batch._id)}
                    className={`
                      group relative flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-200
                      ${isSelected
                        ? "border-[var(--primary)]/30 bg-[var(--primary)]/5 shadow-sm"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/20 hover:bg-[var(--muted)]/50"
                      }
                    `}
                  >
                    <div
                      className={`
                        flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200
                        ${isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]"
                          : "border-[var(--border)] bg-[var(--card)] group-hover:border-[var(--primary)]/40"
                        }
                      `}
                    >
                      {isSelected && (
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--foreground)]">
                        {batch.name}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {batch.course?.title || selectedBatch?.course?.title}
                        {batch.studentsCount !== undefined && ` • ${batch.studentsCount} students`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected chips summary */}
          {formData.sharedBatches.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.sharedBatches.map((batchId) => {
                const batch = batches.find((b) => b._id === batchId);
                if (!batch) return null;
                return (
                  <span
                    key={batchId}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]"
                  >
                    {batch.name}
                    <button
                      type="button"
                      onClick={() => toggleSharedBatch(batchId)}
                      className="rounded-full p-0.5 hover:bg-[var(--primary)]/20 transition-colors"
                      aria-label={`Remove ${batch.name}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* File Upload */}
      <FileUpload
        label="Study Material"
        value={formData.file}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
        helperText="Supported: PDF, Word, PowerPoint, Excel, ZIP"
      />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <ActionButton
          label="Cancel"
          variant="secondary"
          onClick={onCancel}
          type="button"
        />
        <ActionButton
          label={loading ? "Saving..." : "Save Material"}
          loading={loading}
          type="submit"
        />
      </div>
    </form>
  );
}
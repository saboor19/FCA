"use client";

import { useEffect, useState } from "react";

import {
  Input,
  Select,
  Textarea,
  FileUpload,
} from "@/components/common/forms";

import ActionButton from "@/components/common/buttons/ActionButton";

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
  file: null,
});

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);





  const batchOptions = batches.map((batch) => ({
  label: batch.name,
  value: batch._id,
}));

const selectedBatch =
  batches.find(
    (batch) =>
      batch._id === formData.sourceBatch
  );

const courseOptions =
  selectedBatch
    ? [
        {
          label: selectedBatch.course.title,
          value: selectedBatch.course._id,
        },
      ]
    : [];

const moduleOptions =
  selectedBatch
    ? selectedBatch.course.modules.map(
        (module) => ({
          label: module.title,
          value: module._id,
        })
      )
    : [];

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "sourceBatch") {
    const batch =
      batches.find(
        (b) => b._id === value
      );

    setFormData((prev) => ({
      ...prev,

      sourceBatch: value,

      course: batch?.course._id || "",

      moduleId: "",
    }));

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

  const handleFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <Textarea
  label="Summary"
  name="summary"
  rows={4}
  value={formData.summary}
  onChange={handleChange}
/>

<div className="grid grid-cols-1 gap-5 md:grid-cols-2">

  <Select
    label="Batch"
    name="sourceBatch"
    value={formData.sourceBatch}
    onChange={handleChange}
    options={batchOptions}
    required
  />

  <Select
    label="Course"
    name="course"
    value={formData.course}
    options={courseOptions}
    disabled
    required
  />

</div>

     <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

  <Select
    label="Module"
    name="moduleId"
    value={formData.moduleId}
    onChange={handleChange}
    options={moduleOptions}
    required
  />

  <Select
    label="Visibility"
    name="visibility"
    value={formData.visibility}
    onChange={handleChange}
    options={[
      {
        label: "Batch Only",
        value: "BATCH_ONLY",
      },
      {
        label: "Shared Batches",
        value: "SHARED_BATCHES",
      },
    ]}
  />

</div>

      <FileUpload
        label="Study Material"
        value={formData.file}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
      />

      <div className="flex justify-end gap-3">
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
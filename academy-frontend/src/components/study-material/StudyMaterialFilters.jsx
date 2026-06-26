"use client";

import { Search, RotateCcw } from "lucide-react";

import {
  Input,
  Select,
  Textarea,
  FileUpload,
} from "@/components/common/forms";

import ActionButton from "@/components/common/buttons/ActionButton";

export default function StudyMaterialFilters({
  filters,
  onChange,
  onReset,

  courses = [],
  batches = [],
  subjects = [],
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    onChange?.({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        <Input
          name="search"
          placeholder="Search..."
          value={filters.search}
          onChange={handleChange}
          startIcon={Search}
        />

        <Select
          name="course"
          placeholder="All Courses"
          value={filters.course}
          onChange={handleChange}
          options={courses}
        />

        <Select
          name="batch"
          placeholder="All Batches"
          value={filters.batch}
          onChange={handleChange}
          options={batches}
        />

        <Select
          name="subject"
          placeholder="All Subjects"
          value={filters.subject}
          onChange={handleChange}
          options={subjects}
        />

        <Select
          name="visibility"
          value={filters.visibility}
          onChange={handleChange}
          options={[
            {
              label: "All Visibility",
              value: "",
            },
            {
              label: "Public",
              value: "PUBLIC",
            },
            {
              label: "Batch",
              value: "BATCH",
            },
            {
              label: "Private",
              value: "PRIVATE",
            },
          ]}
        />

        <Select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          options={[
            {
              label: "Newest First",
              value: "-createdAt",
            },
            {
              label: "Oldest First",
              value: "createdAt",
            },
            {
              label: "Title (A-Z)",
              value: "title",
            },
            {
              label: "Title (Z-A)",
              value: "-title",
            },
          ]}
        />

      </div>

      <div className="mt-5 flex justify-end">

        <ActionButton
          icon={RotateCcw}
          label="Reset Filters"
          variant="secondary"
          onClick={onReset}
        />

      </div>

    </div>
  );
}
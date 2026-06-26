"use client";

import { Modal } from "@/components/common/modal";
import StudyMaterialForm from "./StudyMaterialForm";

export default function StudyMaterialUploadModal({
  isOpen,
  onClose,

  title = "Upload Study Material",

  initialValues = {},

  courses = [],
  batches = [],
  subjects = [],

  loading = false,

  onSubmit,
}) {
  const handleSubmit = (formData) => {
    onSubmit?.(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <StudyMaterialForm
        initialValues={initialValues}
        courses={courses}
        batches={batches}
        subjects={subjects}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
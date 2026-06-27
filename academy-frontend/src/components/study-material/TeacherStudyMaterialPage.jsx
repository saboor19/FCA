"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "../dashboard/DashboardLayout";
import { DataTable } from "@/components/common/table";
import ActionButton from "@/components/common/buttons/ActionButton";
import { useRouter } from "next/navigation";
import studyMaterialService from "@/services/teacher/studyMaterialService";
import { getAssignedBatches } from "@/services/teacher/batchService";
import StudyMaterialFilters from "./StudyMaterialFilters";
import StudyMaterialUploadModal from "./StudyMaterialUploadModal";

export default function TeacherStudyMaterialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  
  /* ── Toast state ── */
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    course: "",
    batch: "",
    subject: "",
    visibility: "",
    sort: "-createdAt",
  });

  /* ── Toast helper ── */
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ── Filter options ── */
  const courseOptions = useMemo(() => {
    const uniqueCourses = new Map();
    assignedBatches.forEach((batch) => {
      if (!uniqueCourses.has(batch.course._id)) {
        uniqueCourses.set(batch.course._id, {
          label: batch.course.title,
          value: batch.course._id,
        });
      }
    });
    return [...uniqueCourses.values()];
  }, [assignedBatches]);

  const batchOptions = useMemo(
    () =>
      assignedBatches.map((batch) => ({
        label: batch.name,
        value: batch._id,
      })),
    [assignedBatches]
  );

  /* ── Columns ── */
  const columns = [
    { key: "title", header: "Title" },
    { key: "moduleName", header: "Module" },
    { key: "batchName", header: "Batch" },
    {
      key: "visibilityLabel",
      header: "Visibility",
      align: "center",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.visibility === "BATCH_ONLY"
              ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
              : "bg-[var(--primary)]/10 text-[var(--primary)]"
          }`}
        >
          {row.visibilityLabel}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.status === "PUBLISHED"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              : row.status === "ARCHIVED"
              ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <ActionButton
            icon={Eye}
            variant="ghost"
            size="sm"
            onClick={() => handleView(row)}
          />
          <ActionButton
            icon={Pencil}
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row)}
          />
          <ActionButton
            icon={Trash2}
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  /* ── Data fetching ── */
  useEffect(() => {
    fetchAssignedBatches();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  async function fetchAssignedBatches() {
    try {
      const response = await getAssignedBatches();
      setAssignedBatches(response.data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchMaterials() {
    try {
      setLoading(true);
      const response = await studyMaterialService.getStudyMaterials(filters);
      setMaterials(response.materials || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* ── Upload with error toast ── */
  async function handleUpload(data) {
    try {
      setLoading(true);
      const { file, ...payload } = data;

      const response = await studyMaterialService.createStudyMaterial(payload);

      if (file) {
        await studyMaterialService.uploadAttachment(response.material._id, file);
      }

      setOpenUploadModal(false);
      showToast("success", "Study material created successfully");
      fetchMaterials();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create study material.";
      showToast("error", message);
      console.error(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  }

  /* ── Actions ── */
  function handleView(row) {
    router.push(`/teacher/study-materials/${row._id}`);
  }

  function handleEdit(row) {
    router.push(`/teacher/study-materials/${row._id}/edit`);
  }

  async function handleDelete(row) {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
      await studyMaterialService.deleteStudyMaterial(row._id);
      showToast("success", "Material deleted successfully");
      fetchMaterials();
    } catch (error) {
      showToast("error", error.response?.data?.message || "Failed to delete material.");
    }
  }

  /* ── Render ── */
  return (
    <DashboardLayout role="TEACHER">
      <div className="relative space-y-6">
        {/* Toast Notifications */}
        {toast && (
          <div
            role="alert"
            aria-live="polite"
            className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg backdrop-blur-md animate-in slide-in-from-right-full duration-300 ${
              toast.type === "error"
                ? "border border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/80 dark:text-red-200"
                : "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertTriangle className="h-5 w-5 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              Study Materials
            </h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Upload and manage study materials.
            </p>
          </div>
          <ActionButton
            icon={Plus}
            label="Upload Material"
            onClick={() => setOpenUploadModal(true)}
          />
        </div>

        {/* Filters */}
        <StudyMaterialFilters
          filters={filters}
          onChange={setFilters}
          onReset={() =>
            setFilters({
              search: "",
              course: "",
              batch: "",
              subject: "",
              visibility: "",
              sort: "-createdAt",
            })
          }
          courses={courseOptions}
          batches={batchOptions}
          subjects={[]}
        />

        {/* Table */}
        <DataTable
          columns={columns}
          data={materials}
          loading={loading}
          emptyTitle="No Study Materials"
          emptyDescription="Upload your first study material."
        />

        {/* Modal */}
        <StudyMaterialUploadModal
          isOpen={openUploadModal}
          onClose={() => setOpenUploadModal(false)}
          loading={loading}
          courses={assignedBatches}
          batches={assignedBatches}
          subjects={assignedBatches}
          onSubmit={handleUpload}
        />
      </div>
    </DashboardLayout>
  );
}
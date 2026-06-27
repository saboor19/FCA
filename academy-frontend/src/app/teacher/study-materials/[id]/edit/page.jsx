"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
  FileArchive,
  Download,
  Eye,
  Trash2,
  X,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudyMaterialForm from "@/components/study-material/StudyMaterialForm";
import studyMaterialService from "@/services/teacher/studyMaterialService";
import { getAssignedBatches } from "@/services/teacher/batchService";

export default function TeacherStudyMaterialEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [material, setMaterial] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [materialRes, batchesRes] = await Promise.all([
        studyMaterialService.getStudyMaterial(id),
        getAssignedBatches(),
      ]);

      setMaterial(materialRes.material);
      setBatches(batchesRes.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.response?.data?.message || "Failed to load material.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const getInitialValues = useCallback(() => {
    if (!material) return {};

    return {
      title: material.title || "",
      summary: material.summary || "",
      sourceBatch: material.sourceBatch?._id || material.sourceBatch || "",
      course: material.course?._id || material.course || "",
      moduleId: material.moduleId || "",
      visibility: material.visibility || "BATCH_ONLY",
      sharedBatches: material.sharedBatches?.map((b) => b._id || b) || [],
      file: null,
    };
  }, [material]);

  /* ── Handle update + optional new file upload ── */
  const handleSubmit = useCallback(
    async (formData) => {
      try {
        setSaving(true);

        const payload = {
          title: formData.title,
          summary: formData.summary,
          visibility: formData.visibility,
          sharedBatches: formData.sharedBatches,
        };

        // Step 1: Update material fields
        await studyMaterialService.updateStudyMaterial(id, payload);

        // Step 2: Upload new attachment if provided
        if (formData.file) {
          await studyMaterialService.uploadAttachment(id, formData.file);
        }

        showToast("success", "Study material updated successfully");

        // Refresh material to show new attachments
        await fetchData();

        setTimeout(() => {
          router.push(`/teacher/study-materials/${id}`);
        }, 1200);
      } catch (err) {
        console.error("Update failed:", err);
        showToast(
          "error",
          err.response?.data?.message || "Failed to update material."
        );
      } finally {
        setSaving(false);
      }
    },
    [id, router, showToast, fetchData]
  );

  const handleCancel = useCallback(() => {
    router.push(`/teacher/study-materials/${id}`);
  }, [router, id]);

  const handleDeleteAttachment = useCallback(
    async (attachmentId) => {
      if (!window.confirm("Delete this attachment?")) return;
      try {
        await studyMaterialService.deleteAttachment(id, attachmentId);
        showToast("success", "Attachment deleted");
        fetchData();
      } catch (err) {
        showToast("error", "Failed to delete attachment");
      }
    },
    [id, showToast, fetchData]
  );

  const handlePreviewAttachment = useCallback(
    (attachment) => {
      studyMaterialService.previewAttachment(id, attachment._id);
    },
    [id]
  );

  const handleDownloadAttachment = useCallback(
    (attachment) => {
      studyMaterialService.downloadAttachment(id, attachment._id);
    },
    [id]
  );

  return (
    <DashboardLayout role="TEACHER">
      <div className="relative mx-auto max-w-4xl space-y-6">
        {/* Toast */}
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
        <header className="flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="group inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--muted-foreground)] shadow-sm transition-all hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            aria-label="Back to material"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Edit Study Material
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {material?.title || "Loading..."}
            </p>
          </div>
        </header>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchData} />
        ) : !material ? (
          <NotFoundState onBack={() => router.push("/teacher/study-materials")} />
        ) : (
          <div className="space-y-6">
            {/* Material meta card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex items-center gap-3 rounded-xl bg-[var(--muted)]/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                  <FileText className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    Material #{material.materialNumber}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Status: {material.status} • Version {material.version} •{" "}
                    {material.attachments?.length || 0} attachment(s)
                  </p>
                </div>
              </div>

              <StudyMaterialForm
                initialValues={getInitialValues()}
                batches={batches}
                loading={saving}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>

            {/* Existing Attachments */}
            {material.attachments?.length > 0 && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center gap-2">
                  <FileArchive className="h-5 w-5 text-[var(--primary)]" />
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Existing Attachments
                  </h2>
                  <span className="rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)]">
                    {material.attachments.length}
                  </span>
                </div>

                <ul className="divide-y divide-[var(--border)]" role="list">
                  {material.attachments.map((file, index) => (
                    <li
                      key={file._id}
                      className="group flex items-center gap-4 py-4 transition-colors first:pt-0 last:pb-0"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-sm">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[var(--foreground)]">
                          {file.originalName}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {file.extension?.toUpperCase()} • {(file.size / 1024).toFixed(1)} KB
                          {file.uploadedBy?.userId?.fullName && (
                            <> • Uploaded by {file.uploadedBy.userId.fullName}</>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100">
                        {file.isPreviewable && (
                          <button
                            onClick={() => handlePreviewAttachment(file)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
                            aria-label={`Preview ${file.originalName}`}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadAttachment(file)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)]"
                          aria-label={`Download ${file.originalName}`}
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAttachment(file._id)}
                          className="inline-flex items-center rounded-lg p-2 text-[var(--muted-foreground)] transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${file.originalName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ── States ── */
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] py-20">
      <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
      <p className="mt-4 text-sm font-medium text-[var(--muted-foreground)]">
        Loading material...
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-900/50 dark:bg-red-900/20">
      <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
      <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-300">
        Something went wrong
      </h3>
      <p className="mt-2 max-w-md text-sm text-red-600 dark:text-red-400">{message}</p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}

function NotFoundState({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)]">
        <FileText className="h-8 w-8 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
        Material Not Found
      </h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        The material you are trying to edit does not exist or has been removed.
      </p>
      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Materials
      </button>
    </div>
  );
}
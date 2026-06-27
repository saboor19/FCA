"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudyMaterialForm from "@/components/study-material/StudyMaterialForm";
import studyMaterialService from "@/services/teacher/studyMaterialService";
import { getAssignedBatches } from "@/services/teacher/batchService";

/* ═══════════════════════════════════════════════════════════════
   TEACHER STUDY MATERIAL EDIT PAGE
   Edit existing material • Reuse StudyMaterialForm • Toast UX
   ═══════════════════════════════════════════════════════════════ */

export default function TeacherStudyMaterialEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [material, setMaterial] = useState(null);
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  /* ── Fetch material + assigned batches ── */
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

  /* ── Toast helper ── */
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ── Map material to form initial values ── */
  const getInitialValues = useCallback(() => {
    if (!material) return {};

    return {
      title: material.title || "",
      summary: material.summary || "",
      sourceBatch: material.sourceBatch?._id || material.sourceBatch || "",
      course: material.course?._id || material.course || "",
      moduleId: material.moduleId || "",
      visibility: material.visibility || "BATCH_ONLY",
      // Note: file is not editable here (attachments managed separately)
      file: null,
    };
  }, [material]);

  /* ── Handle update ── */
  const handleSubmit = useCallback(
    async (formData) => {
      try {
        setSaving(true);

        // Only send editable fields (matches your controller's allowedFields)
        const payload = {
          title: formData.title,
          summary: formData.summary,
          visibility: formData.visibility,
          // Include these if your API allows changing them:
          // course: formData.course,
          // moduleId: formData.moduleId,
          // sharedBatches: formData.sharedBatches,
        };

        await studyMaterialService.updateStudyMaterial(id, payload);

        showToast("success", "Study material updated successfully");
        
        // Optional: redirect to details page after short delay
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
    [id, router, showToast]
  );

  const handleCancel = useCallback(() => {
    router.push(`/teacher/study-materials/${id}`);
  }, [router, id]);

  /* ── Render ── */
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
                  Status: {material.status} • Version {material.version}
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
        )}
      </div>
    </DashboardLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATES
   ═══════════════════════════════════════════════════════════════ */

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
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
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
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Materials
      </button>
    </div>
  );
}
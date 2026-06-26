"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileText, ArrowLeft } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudyMaterialDetails from "@/components/study-material/StudyMaterialDetails";
import studyMaterialService from "@/services/teacher/studyMaterialService";

/* ═══════════════════════════════════════════════════════════════
   TEACHER STUDY MATERIAL DETAILS PAGE
   Premium • Accessible • Fluid • Toast notifications
   ═══════════════════════════════════════════════════════════════ */

export default function TeacherStudyMaterialDetailsPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  /* ── Data Fetching ── */
  useEffect(() => {
    if (id) fetchMaterial();
  }, [id]);

  const fetchMaterial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studyMaterialService.getStudyMaterial(id);
      setMaterial(response.material);
    } catch (err) {
      console.error("Failed to fetch material:", err);
      setError("Failed to load study material. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* ── Toast helper ── */
  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ── Actions ── */
  const handleBack = useCallback(() => {
    router.push("/teacher/study-materials");
  }, [router]);

  const handleEdit = useCallback(() => {
    router.push(`/teacher/study-materials/${id}/edit`);
  }, [router, id]);

  const handlePublish = useCallback(async () => {
    try {
      const newStatus = material?.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      await studyMaterialService.updateStatus(id, newStatus);
      setMaterial((prev) => ({ ...prev, status: newStatus }));
      showToast("success", newStatus === "PUBLISHED" ? "Material published successfully" : "Material unpublished");
    } catch (err) {
      showToast("error", "Failed to update status. Please try again.");
    }
  }, [id, material?.status, showToast]);

  const handleDuplicate = useCallback(async () => {
    try {
      const response = await studyMaterialService.duplicate(id);
      showToast("success", "Material duplicated successfully");
      router.push(`/teacher/study-materials/${response.material._id}/edit`);
    } catch (err) {
      showToast("error", "Failed to duplicate material.");
    }
  }, [id, router, showToast]);

  const handleArchive = useCallback(async () => {
    try {
      await studyMaterialService.archive(id);
      setMaterial((prev) => ({ ...prev, status: "ARCHIVED" }));
      showToast("success", "Material archived successfully");
    } catch (err) {
      showToast("error", "Failed to archive material.");
    }
  }, [id, showToast]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm("Are you sure you want to delete this material? This action cannot be undone.")) {
      return;
    }
    try {
      await studyMaterialService.delete(id);
      showToast("success", "Material deleted successfully");
      router.push("/teacher/study-materials");
    } catch (err) {
      showToast("error", "Failed to delete material.");
    }
  }, [id, router, showToast]);

  const handlePreview = useCallback(async (file) => {
    try {
      const url = await studyMaterialService.getPreviewUrl(file._id);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      showToast("error", "Failed to generate preview.");
    }
  }, [showToast]);

  const handleDownload = useCallback(async (file) => {
    try {
      const blob = await studyMaterialService.download(file._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("success", "Download started");
    } catch (err) {
      showToast("error", "Failed to download file.");
    }
  }, [showToast]);

  /* ── Render ── */
  return (
    <DashboardLayout role="TEACHER">
      <div className="relative min-h-[60vh]">
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

        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMaterial} />
        ) : !material ? (
          <NotFoundState onBack={handleBack} />
        ) : (
          <StudyMaterialDetails
            material={material}
            role="TEACHER"
            onBack={handleBack}
            onEdit={handleEdit}
            onPublish={handlePublish}
            onDuplicate={handleDuplicate}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onPreview={handlePreview}
            onDownload={handleDownload}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOADING & ERROR STATES
   ═══════════════════════════════════════════════════════════════ */

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20" role="status" aria-live="polite">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--border)]" />
        <div className="absolute inset-0 rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-[var(--muted-foreground)]">Loading study material...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-900/50 dark:bg-red-900/20">
      <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
      <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-300">Something went wrong</h3>
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
      <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Study Material Not Found</h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        The material you are looking for does not exist or has been removed.
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
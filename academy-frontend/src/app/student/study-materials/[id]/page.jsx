"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  BarChart3,
  FileArchive,
  Download,
  Eye,
  Users,
  Layers,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import studentStudyMaterialService from "@/services/student/studyMaterialService";

/* ═══════════════════════════════════════════════════════════════
   STUDENT STUDY MATERIAL DETAIL
   ═══════════════════════════════════════════════════════════════ */

export default function StudentStudyMaterialDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (id) fetchMaterial();
  }, [id]);

  const fetchMaterial = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentStudyMaterialService.getStudentStudyMaterial(id);
      setMaterial(response.material);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load material.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handlePreview = useCallback(
    (file) => {
      if (!file.isPreviewable) {
        showToast("error", "This file cannot be previewed.");
        return;
      }
      studentStudyMaterialService.previewStudentAttachment(id, file._id);
    },
    [id, showToast]
  );

  const handleDownload = useCallback(
    (file) => {
      studentStudyMaterialService.downloadStudentAttachment(id, file._id);
      showToast("success", "Download started");
    },
    [id, showToast]
  );

  const handleBack = useCallback(() => {
    router.push("/student/study-materials");
  }, [router]);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} onRetry={fetchMaterial} />;
  if (!material) return <PageNotFound onBack={handleBack} />;

  return (
    <DashboardLayout role="STUDENT">
      <div className="relative mx-auto max-w-5xl space-y-6">
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

        {/* ═══════════════════════════════════════════════
            HERO HEADER — Clean: Title + Meta only
            ═══════════════════════════════════════════════ */}
        <header className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] opacity-80"
            aria-hidden="true"
          />

          <div className="relative p-6 sm:p-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <button
                onClick={handleBack}
                className="group/btn inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover/btn:-translate-x-0.5" />
                <span>Study Materials</span>
              </button>
            </nav>

            {/* Title */}
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
              {material.title}
            </h1>

            {/* Meta row */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <MetaBadge icon={Layers} text={material.moduleName} color="var(--primary)" />
              <MetaBadge icon={BookOpen} text={material.course?.title} />
              <MetaBadge icon={Calendar} text={formatDate(material.publishedAt || material.createdAt)} />
              <MetaBadge icon={Clock} text={`${material.estimatedReadTime || 0} min read`} />
              <MetaBadge icon={BarChart3} text={material.difficulty} />
              <MetaBadge icon={FileArchive} text={`${material.attachments?.length || 0} file${material.attachments?.length !== 1 ? "s" : ""}`} />
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════
            SUMMARY — Preserved HTML
            ═══════════════════════════════════════════════ */}
        {material.summary && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Summary
              </h2>
            </div>
            <div className="p-6">
              <RichTextContent html={material.summary} />
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════
            BODY CONTENT — Preserved HTML
            ═══════════════════════════════════════════════ */}
        {material.body && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                <FileText className="h-5 w-5 text-[var(--accent)]" />
                Content
              </h2>
            </div>
            <div className="p-6">
              <RichTextContent html={material.body} />
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════
            ATTACHMENTS
            ═══════════════════════════════════════════════ */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
              <FileArchive className="h-5 w-5 text-[var(--primary)]" />
              Attachments
              <span className="ml-1 rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-sm font-medium text-[var(--muted-foreground)]">
                {material.attachments?.length || 0}
              </span>
            </h2>
          </div>

          {material.attachments?.length ? (
            <ul className="divide-y divide-[var(--border)]" role="list">
              {material.attachments.map((file, index) => (
                <li
                  key={file._id}
                  className="group flex items-center gap-4 p-4 transition-colors hover:bg-[var(--muted)]/30 sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[var(--foreground)]">
                      {file.originalName}
                    </p>
                    <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                      {file.extension?.toUpperCase()} • {(file.size / 1024).toFixed(1)} KB
                      {file.uploadedBy && <> • {file.uploadedBy}</>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.isPreviewable && (
                      <button
                        onClick={() => handlePreview(file)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10"
                        aria-label={`Preview ${file.originalName}`}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDownload(file)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)]"
                      aria-label={`Download ${file.originalName}`}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyAttachments />
          )}
        </section>

        {/* Shared Batches */}
        {material.sharedBatches?.length > 0 && (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              <Users className="h-4 w-4" />
              Also Shared With
            </h3>
            <div className="flex flex-wrap gap-2">
              {material.sharedBatches.map((batch) => (
                <span
                  key={batch._id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3 py-1.5 text-sm font-medium text-[var(--primary)]"
                >
                  <Users className="h-3 w-3" />
                  {batch.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function MetaBadge({ icon: Icon, text, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
      style={
        color
          ? { backgroundColor: `${color}15`, color: color }
          : { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }
      }
    >
      <Icon className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}

function RichTextContent({ html }) {
  if (!html) return <p className="text-sm text-[var(--muted-foreground)]">No content available.</p>;

  return (
    <article
      className="prose prose-stone max-w-none dark:prose-invert
        /* Headings */
        prose-headings:font-semibold prose-headings:text-[var(--foreground)]
        prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
        /* Paragraphs */
        prose-p:text-[var(--foreground)] prose-p:leading-relaxed prose-p:mb-4
        /* Links */
        prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
        /* Bold/Strong */
        prose-strong:text-[var(--foreground)] prose-strong:font-semibold
        /* Lists */
        prose-ul:list-disc prose-ul:pl-5 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:pl-5 prose-ol:mb-4
        /* Blockquotes */
        prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)]
        prose-blockquote:bg-[var(--muted)]/50 prose-blockquote:pl-4 prose-blockquote:py-2
        prose-blockquote:italic prose-blockquote:text-[var(--foreground)]
        /* Code inline */
        prose-code:bg-[var(--muted)] prose-code:px-1.5 prose-code:py-0.5
        prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-[var(--foreground)]
        /* Code blocks */
        prose-pre:bg-[var(--muted)] prose-pre:rounded-xl prose-pre:p-4
        prose-pre:text-[var(--foreground)]
        /* Horizontal rule */
        prose-hr:border-[var(--border)]
        /* Images */
        prose-img:rounded-xl prose-img:shadow-sm
        /* Tables */
        prose-table:border-collapse prose-table:w-full
        prose-th:bg-[var(--muted)] prose-th:p-2 prose-th:text-left prose-th:font-semibold
        prose-td:p-2 prose-td:border-t prose-td:border-[var(--border)]
        prose-tr:border-[var(--border)]"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}

function EmptyAttachments() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)]">
        <FileArchive className="h-7 w-7 text-[var(--muted-foreground)]" />
      </div>
      <p className="mt-4 text-sm font-medium text-[var(--muted-foreground)]">
        No attachments available
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE STATES
   ═══════════════════════════════════════════════════════════════ */

function PageLoading() {
  return (
    <DashboardLayout role="STUDENT">
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
        <p className="mt-4 text-sm font-medium text-[var(--muted-foreground)]">Loading material...</p>
      </div>
    </DashboardLayout>
  );
}

function PageError({ message, onRetry }) {
  return (
    <DashboardLayout role="STUDENT">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center dark:border-red-900/50 dark:bg-red-900/20">
        <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400" />
        <h3 className="mt-4 text-lg font-semibold text-red-800 dark:text-red-300">Something went wrong</h3>
        <p className="mt-2 max-w-md text-sm text-red-600 dark:text-red-400">{message}</p>
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </DashboardLayout>
  );
}

function PageNotFound({ onBack }) {
  return (
    <DashboardLayout role="STUDENT">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)]">
          <FileText className="h-8 w-8 text-[var(--muted-foreground)]" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Material Not Found</h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          This material may have been removed or you don&apos;t have access.
        </p>
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Materials
        </button>
      </div>
    </DashboardLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════ */

function sanitizeHtml(html) {
  if (!html) return "";
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
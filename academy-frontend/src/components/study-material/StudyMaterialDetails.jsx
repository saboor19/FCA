"use client";

import { useState, useCallback } from "react";
import {
  ArrowLeft,
  Edit,
  CheckCircle2,
  XCircle,
  Copy,
  Archive,
  Trash2,
  Download,
  Eye,
  BookOpen,
  Layers,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Clock,
  FileArchive,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import ActionButton from "@/components/common/buttons/ActionButton";
import StatusBadge from "@/components/common/badges/StatusBadge";

/* ═══════════════════════════════════════════════════════════════
   PREMIUM STUDY MATERIAL DETAILS
   Fluid layout • Accessibility-first • Theme-consistent
   ═══════════════════════════════════════════════════════════════ */

export default function StudyMaterialDetails({
  material,
  role = "TEACHER",
  onBack,
  onEdit,
  onPublish,
  onDuplicate,
  onArchive,
  onDelete,
  onDownload,
  onPreview,
}) {
  if (!material) return null;

  const [activeTab, setActiveTab] = useState("overview");
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const module = material.course?.modules?.find(
    (m) =>
      m._id === material.moduleId ||
      m._id?.toString() === material.moduleId?.toString()
  );

  const isPublished = material.status === "PUBLISHED";

  const handleArchiveWithConfirm = useCallback(async () => {
    setIsArchiving(true);
    try { await onArchive(); } finally { setIsArchiving(false); }
  }, [onArchive]);

  const handleDeleteWithConfirm = useCallback(async () => {
    setIsDeleting(true);
    try { await onDelete(); } finally { setIsDeleting(false); }
  }, [onDelete]);

  

  /* ── Tabs ── */
  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "content", label: "Content", icon: BookOpen },
    { id: "attachments", label: "Attachments", icon: FileArchive, count: material.attachments?.length },
    { id: "sharing", label: "Sharing", icon: Users, count: material.sharedBatches?.length },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* ═══════════════════════════════════════════════
          HERO HEADER
          ═══════════════════════════════════════════════ */}
      <header className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 hover:shadow-md">
        <div 
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] opacity-80"
          aria-hidden="true"
        />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

            <div className="flex-1 min-w-0">
              <nav aria-label="Breadcrumb" className="mb-4">
                <button
                  onClick={onBack}
                  className="group/btn inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover/btn:-translate-x-0.5" />
                  <span>Study Materials</span>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                  <span className="text-[var(--foreground)] truncate max-w-[200px]">{material.title}</span>
                </button>
              </nav>

              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
                {material.title}
              </h1>

              {material.summary && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)]">
                  {stripHtml(material.summary).slice(0, 200)}
                  {stripHtml(material.summary).length > 200 ? "..." : ""}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {material.createdAt && new Date(material.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--muted-foreground)] opacity-40" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {material.estimatedReadTime || 0} min read
                </span>
                <span className="h-1 w-1 rounded-full bg-[var(--muted-foreground)] opacity-40" aria-hidden="true" />
                <span className="inline-flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" />
                  {material.difficulty}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 items-start gap-3">
              <StatusBadge status={material.status} className="shadow-sm" />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════
          ACTION BAR
          ═══════════════════════════════════════════════ */}
      {role === "TEACHER" && (
        <div className="sticky top-4 z-30 rounded-xl border border-[var(--border)] bg-[var(--card)]/80 p-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md">
          <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Material actions">

            <ActionButton
              icon={Edit}
              label="Edit"
              onClick={onEdit}
              className="hover:bg-[var(--primary)] hover:text-white"
            />

            <div className="mx-1 h-6 w-px bg-[var(--border)]" aria-hidden="true" />

            <ActionButton
              icon={isPublished ? XCircle : CheckCircle2}
              label={isPublished ? "Unpublish" : "Publish"}
              variant={isPublished ? "warning" : "success"}
              onClick={onPublish}
            />

            <ActionButton
              icon={Copy}
              label="Duplicate"
              variant="secondary"
              onClick={onDuplicate}
            />

            <div className="mx-1 h-6 w-px bg-[var(--border)]" aria-hidden="true" />

            <ActionButton
              icon={Archive}
              label={isArchiving ? "Archiving..." : "Archive"}
              variant="warning"
              onClick={handleArchiveWithConfirm}
              disabled={isArchiving}
            />

            <ActionButton
              icon={Trash2}
              label={isDeleting ? "Deleting..." : "Delete"}
              variant="danger"
              onClick={handleDeleteWithConfirm}
              disabled={isDeleting}
            />
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          TABS NAVIGATION
          ═══════════════════════════════════════════════ */}
      <nav 
        className="flex gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-sm"
        role="tablist"
        aria-label="Material sections"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-[var(--muted)] text-[var(--foreground)]"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ═══════════════════════════════════════════════
          TAB PANELS
          ═══════════════════════════════════════════════ */}

      {/* ── Overview Panel ── */}
      {activeTab === "overview" && (
        <section
          id="panel-overview"
          role="tabpanel"
          aria-labelledby="tab-overview"
          className="grid gap-6 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
              <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--foreground)]">
                  <Sparkles className="h-5 w-5 text-[var(--accent)]" />
                  Material Details
                </h2>
              </div>
              <div className="grid gap-px bg-[var(--border)]">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCell icon={BookOpen} label="Course" value={material.course?.title} />
                  <InfoCell icon={Layers} label="Module" value={module?.title} />
                  <InfoCell icon={Users} label="Batch" value={material.sourceBatch?.name} />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                  <InfoCell icon={FileText} label="Type" value={material.type} />
                  <InfoCell icon={BarChart3} label="Difficulty" value={material.difficulty} />
                  <InfoCell icon={Eye} label="Visibility" value={material.visibility} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard 
                label="Attachments" 
                value={material.attachments?.length || 0} 
                icon={FileArchive}
                color="var(--primary)"
              />
              <StatCard 
                label="Shared With" 
                value={material.sharedBatches?.length || 0} 
                icon={Users}
                color="var(--accent)"
              />
              <StatCard 
                label="Version" 
                value={material.version || "1.0"} 
                icon={CheckCircle2}
                color="var(--secondary)"
              />
            </div>
          </div>

          <aside className="space-y-6">
            {material.course && (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Course Context
                </h3>
                <div className="space-y-3">
                  <ContextItem label="Course" value={material.course.title} />
                  {module && <ContextItem label="Module" value={module.title} />}
                  <ContextItem label="Source Batch" value={material.sourceBatch?.name} />
                </div>
              </div>
            )}
          </aside>
        </section>
      )}

      {/* ── Content Panel ── */}
      {activeTab === "content" && (
        <section
          id="panel-content"
          role="tabpanel"
          aria-labelledby="tab-content"
          className="space-y-6"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Summary</h2>
            </div>
            <div className="p-6">
              {material.summary ? (
                <RichTextContent html={material.summary} />
              ) : (
                <EmptyState message="No summary available." />
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Body Content</h2>
            </div>
            <div className="p-6">
              {material.body ? (
                <RichTextContent html={material.body} />
              ) : (
                <EmptyState message="No content available." />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Attachments Panel ── */}
      {activeTab === "attachments" && (
        <section
          id="panel-attachments"
          role="tabpanel"
          aria-labelledby="tab-attachments"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Attachments
                <span className="ml-2 rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-sm font-medium text-[var(--muted-foreground)]">
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
                      </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100">
                      {file.isPreviewable && (
                        <button
                          onClick={() => onPreview(file)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                          aria-label={`Preview ${file.originalName}`}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>
                      )}
                      <button
                        onClick={() => onDownload(file)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
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
              <EmptyState message="No attachments uploaded." icon={FileArchive} />
            )}
          </div>
        </section>
      )}

      {/* ── Sharing Panel ── */}
      {activeTab === "sharing" && (
        <section
          id="panel-sharing"
          role="tabpanel"
          aria-labelledby="tab-sharing"
        >
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
            <div className="border-b border-[var(--border)] bg-[var(--muted)]/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Shared Batches
                <span className="ml-2 rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-sm font-medium text-[var(--muted-foreground)]">
                  {material.sharedBatches?.length || 0}
                </span>
              </h2>
            </div>

            <div className="p-6">
              {material.sharedBatches?.length ? (
                <div className="flex flex-wrap gap-3">
                  {material.sharedBatches.map((batch) => (
                    <span
                      key={batch._id}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/10 hover:shadow-sm"
                    >
                      <Users className="h-3.5 w-3.5" />
                      {batch.name}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyState message="This material is not shared with any other batch." icon={Users} />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function InfoCell({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 bg-[var(--card)] p-5 transition-colors hover:bg-[var(--muted)]/30">
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
          <Icon className="h-4.5 w-4.5 text-[var(--primary)]" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </p>
        <p className="mt-1 font-semibold text-[var(--foreground)] truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function ContextItem({ label, value }) {
  return (
    <div className="rounded-lg bg-[var(--muted)]/50 p-3">
      <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-0.5 font-medium text-[var(--foreground)]">{value || "—"}</p>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--foreground)]">{value}</p>
        </div>
        <div 
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function RichTextContent({ html }) {
  return (
    <article 
      className="prose prose-stone max-w-none dark:prose-invert
        prose-headings:font-semibold prose-headings:text-[var(--foreground)]
        prose-p:text-[var(--foreground)] prose-p:leading-relaxed
        prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
        prose-strong:text-[var(--foreground)] prose-strong:font-semibold
        prose-ul:list-disc prose-ul:pl-5
        prose-ol:list-decimal prose-ol:pl-5
        prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)] prose-blockquote:bg-[var(--muted)]/50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:italic
        prose-code:bg-[var(--muted)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-[var(--muted)] prose-pre:rounded-xl prose-pre:p-4"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}

function EmptyState({ message, icon: Icon = AlertTriangle }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)]">
        <Icon className="h-7 w-7 text-[var(--muted-foreground)]" />
      </div>
      <p className="mt-4 text-sm font-medium text-[var(--muted-foreground)]">{message}</p>
    </div>
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
    .replace(/javascript:/gi, "");
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  getTeacherAssignments,
  publishAssignment,
  closeAssignment,
  deleteAssignment,
} from "@/services/teacher/assignmentService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

/* ─── Icons (inline SVGs – no extra deps) ─── */
const Icons = {
  Plus: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  BookOpen: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Eye: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Pencil: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  Rocket: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Lock: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Trash: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  Loader: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  FileText: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  HelpCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Award: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Calendar: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Repeat: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  Search: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Filter: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

/* ─── Status config ─── */
const STATUS_CONFIG = {
  PUBLISHED: {
    label: "Published",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/20",
  },
  DRAFT: {
    label: "Draft",
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/20",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-500/20",
  },
};

/* ─── Skeleton Card ─── */
function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border-custom p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-3/5 rounded-lg bg-muted" />
          <div className="h-4 w-2/5 rounded-lg bg-muted" />
        </div>
        <div className="h-7 w-20 rounded-full bg-muted" />
      </div>
      <div className="mt-4 h-16 rounded-lg bg-muted" />
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-4 w-10 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-20 rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-custom bg-card px-8 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Icons.FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-foreground">
        No Assignments Yet
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Get started by creating your first assignment. Students will be able to view and submit once published.
      </p>
      <Link
        href="/teacher/assignments/create"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <Icons.Plus className="h-4 w-4" />
        Create Assignment
      </Link>
    </div>
  );
}

/* ─── Toast / Notification ─── */
function Toast({ message, type, onClose }) {
  const typeStyles = {
    success: "bg-emerald-500 text-white",
    error: "bg-destructive text-white",
    info: "bg-primary text-white",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl shadow-black/10 transition-all animate-in slide-in-from-bottom-2 ${typeStyles[type] || typeStyles.info}`}
      role="alert"
      aria-live="polite"
    >
      {type === "success" && (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {type === "error" && <Icons.AlertTriangle className="h-5 w-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 rounded-lg p-1 hover:bg-white/20 transition-colors"
        aria-label="Dismiss notification"
      >
        <Icons.X className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Delete Confirmation Modal ─── */
function DeleteModal({ assignment, onConfirm, onCancel, isDeleting }) {
  if (!assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border-custom">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
          <Icons.AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          Delete Assignment?
        </h3>
        <p className="mt-2 text-muted-foreground">
          Are you sure you want to delete <strong className="text-foreground">"{assignment.title}"</strong>? This action cannot be undone and all associated submissions will be permanently removed.
        </p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-border-custom px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border-custom"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
          >
            {isDeleting ? (
              <Icons.Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.Trash className="h-4 w-4" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Assignment Card ─── */
function AssignmentCard({ assignment, onPublish, onClose, onDelete, isProcessing }) {
  const status = STATUS_CONFIG[assignment.status] || STATUS_CONFIG.DRAFT;
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border-custom bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-primary/50">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-foreground leading-snug truncate">
            {assignment.title}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Icons.BookOpen className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{assignment.courseId?.title || "Unknown Course"}</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.bg} ${status.text} ${status.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">
        {assignment.description || "No description provided."}
      </p>

      {/* Meta Grid */}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Icons.HelpCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Questions</p>
            <p className="text-sm font-semibold text-foreground">{assignment.questions?.length || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Icons.Award className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Total Marks</p>
            <p className="text-sm font-semibold text-foreground">{assignment.totalMarks ?? "—"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Icons.Calendar className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Due Date</p>
            <p className={`text-sm font-semibold ${isOverdue ? "text-destructive" : "text-foreground"}`}>
              {assignment.dueDate
                ? new Date(assignment.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No due date"}
              {isOverdue && <span className="ml-1 text-[10px] font-bold uppercase">(Overdue)</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Icons.Repeat className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Max Attempts</p>
            <p className="text-sm font-semibold text-foreground">{assignment.maxAttempts ?? "Unlimited"}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto pt-6 flex flex-wrap items-center gap-2">
        <Link
          href={`/teacher/assignments/${assignment._id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-custom px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border-custom"
        >
          <Icons.Eye className="h-3.5 w-3.5" />
          View
        </Link>
        <Link href={`/teacher/assignments/${assignment._id}/submissions`}>
            View Submissions
        </Link>

        <Link
          href={`/teacher/assignments/${assignment._id}/edit`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border-custom px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border-custom"
        >
          <Icons.Pencil className="h-3.5 w-3.5" />
          Edit
        </Link>

        {assignment.status === "DRAFT" && (
          <button
            onClick={() => onPublish(assignment._id)}
            disabled={isProcessing === assignment._id}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
          >
            {isProcessing === assignment._id ? (
              <Icons.Loader className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Icons.Rocket className="h-3.5 w-3.5" />
            )}
            Publish
          </button>
        )}

        {assignment.status === "PUBLISHED" && (
          <button
            onClick={() => onClose(assignment._id)}
            disabled={isProcessing === assignment._id}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
          >
            {isProcessing === assignment._id ? (
              <Icons.Loader className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Icons.Lock className="h-3.5 w-3.5" />
            )}
            Close
          </button>
        )}

        <button
          onClick={() => onDelete(assignment)}
          disabled={isProcessing === assignment._id}
          className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
          aria-label={`Delete ${assignment.title}`}
        >
          {isProcessing === assignment._id ? (
            <Icons.Loader className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icons.Trash className="h-3.5 w-3.5" />
          )}
          Delete
        </button>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isProcessing, setIsProcessing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  /* ─── Toast helper ─── */
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ─── Fetch ─── */
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTeacherAssignments();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to load assignments. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  /* ─── Filtered list ─── */
  const filteredAssignments = assignments.filter((a) => {
    const matchesSearch =
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.courseId?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    ALL: assignments.length,
    PUBLISHED: assignments.filter((a) => a.status === "PUBLISHED").length,
    DRAFT: assignments.filter((a) => a.status === "DRAFT").length,
    CLOSED: assignments.filter((a) => a.status === "CLOSED").length,
  };

  /* ─── Handlers ─── */
  const handlePublish = async (id) => {
    setIsProcessing(id);
    try {
      await publishAssignment(id);
      showToast("Assignment published successfully!", "success");
      await fetchAssignments();
    } catch (error) {
      console.error(error);
      showToast("Failed to publish assignment.", "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleClose = async (id) => {
    setIsProcessing(id);
    try {
      await closeAssignment(id);
      showToast("Assignment closed successfully.", "success");
      await fetchAssignments();
    } catch (error) {
      console.error(error);
      showToast("Failed to close assignment.", "error");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteAssignment(deleteTarget._id);
      showToast("Assignment deleted successfully.", "success");
      await fetchAssignments();
    } catch (error) {
      console.error(error);
      showToast("Failed to delete assignment.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  /* ─── Loading skeletons ─── */
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mb-6 h-4 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout role="TEACHER">
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Assignments
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage assignments, quizzes, and track student submissions.
          </p>
        </div>
        <Link
          href="/teacher/assignments/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98]"
        >
          <Icons.Plus className="h-4 w-4" />
          Create Assignment
        </Link>
      </div>

      {/* ── Stats Bar ── */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { key: "ALL", label: "Total", color: "bg-primary/10 text-primary" },
          { key: "PUBLISHED", label: "Published", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
          { key: "DRAFT", label: "Drafts", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
          { key: "CLOSED", label: "Closed", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(stat.key)}
            className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-all ${
              statusFilter === stat.key
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border-custom bg-card hover:bg-muted/50"
            }`}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </span>
            <span className={`mt-1 text-2xl font-bold ${statusFilter === stat.key ? "text-primary" : "text-foreground"}`}>
              {counts[stat.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assignments or courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border-custom bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Icons.Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border-custom bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* ── Results Count ── */}
      {assignments.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredAssignments.length}</span> of{" "}
          <span className="font-semibold text-foreground">{assignments.length}</span> assignments
          {searchQuery && ` matching "${searchQuery}"`}
          {statusFilter !== "ALL" && ` with status "${statusFilter}"`}
        </p>
      )}

      {/* ── Content ── */}
      {assignments.length === 0 ? (
        <div className="mt-8">
          <EmptyState />
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-custom bg-card px-8 py-16 text-center">
          <Icons.Search className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No matches found</h3>
          <p className="mt-1 text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
          <button
            onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
            className="mt-4 rounded-lg border border-border-custom px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
              onPublish={handlePublish}
              onClose={handleClose}
              onDelete={setDeleteTarget}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteTarget && (
        <DeleteModal
          assignment={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
    </DashboardLayout>
  );
}
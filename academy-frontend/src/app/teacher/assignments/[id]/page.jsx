"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  getSingleAssignment,
  publishAssignment,
  closeAssignment,
} from "@/services/teacher/assignmentService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

/* ─── Inline Icons ─── */
const Icons = {
  Loader: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  ArrowLeft: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
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
  Repeat: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
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
  Clock: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Settings: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.67 15 1.65 1.65 0 0 0 3 15.09V15a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  XCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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
  BookOpen: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  ListChecks: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Hash: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Shuffle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  ),
  Eye: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Info: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

/* ─── Status Config ─── */
const STATUS_CONFIG = {
  PUBLISHED: {
    label: "Published",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/20",
    icon: Icons.CheckCircle,
  },
  DRAFT: {
    label: "Draft",
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/20",
    icon: Icons.AlertTriangle,
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-rose-500",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-500/20",
    icon: Icons.Lock,
  },
};

/* ─── Question Type Config ─── */
const TYPE_CONFIG = {
  MCQ: { label: "Multiple Choice", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", icon: Icons.ListChecks },
  TEXT: { label: "Text Answer", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20", icon: Icons.FileText },
  FILE: { label: "File Upload", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20", icon: Icons.BookOpen },
};

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, subtext, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  };
  return (
    <div className="rounded-2xl border border-border-custom bg-card p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[color] || colorMap.primary}`}>
          <Icon className="h-5 w-5" />
        </div>
        {subtext && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {subtext}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

/* ─── Setting Item ─── */
function SettingItem({ icon: Icon, label, value, active }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-custom bg-card p-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
      {active !== undefined && (
        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}>
          {active ? (
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Question Card ─── */
function QuestionCard({ question, index }) {
  const typeConfig = TYPE_CONFIG[question.type] || TYPE_CONFIG.TEXT;
  const TypeIcon = typeConfig.icon;
  const isCorrect = (opt) => question.type === "MCQ" && opt === question.correctAnswer;

  return (
    <div className="rounded-2xl border border-border-custom bg-card p-5 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {index + 1}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{question.question || "Untitled Question"}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeConfig.color}`}>
                <TypeIcon className="h-3 w-3" />
                {typeConfig.label}
              </span>
              {question.required && (
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                  Required
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="shrink-0 rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
          {question.marks || 0} marks
        </span>
      </div>

      {/* MCQ Options */}
      {question.type === "MCQ" && question.options && (
        <div className="mt-4 space-y-2">
          {question.options.map((option, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                isCorrect(option)
                  ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/5"
                  : "border-border-custom bg-card"
              }`}
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isCorrect(option)
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-border-custom"
                }`}
              >
                {isCorrect(option) && (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className={isCorrect(option) ? "font-medium text-emerald-700 dark:text-emerald-400" : "text-foreground"}>
                {option || `[Option ${String.fromCharCode(65 + idx)}]`}
              </span>
              {isCorrect(option) && (
                <span className="ml-auto shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Correct
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Guidelines */}
      {question.guidelines && (
        <div className="mt-4 rounded-xl border border-border-custom bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <Icons.Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guidelines</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{question.guidelines}</p>
        </div>
      )}

      {/* File-specific info */}
      {question.type === "FILE" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {question.allowedFileTypes && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              <Icons.FileText className="h-3 w-3" />
              {question.allowedFileTypes}
            </span>
          )}
          {question.maxFileSize && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              Max {question.maxFileSize}MB
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton Loader ─── */
function SkeletonLoader() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="rounded-2xl border border-border-custom bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-border-custom bg-card p-5">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
            <div className="mt-3 h-7 w-16 animate-pulse rounded-lg bg-muted" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Toast ─── */
function Toast({ message, type, onClose }) {
  const typeStyles = {
    success: "bg-emerald-500 text-white",
    error: "bg-destructive text-white",
    info: "bg-primary text-white",
  };
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-xl transition-all animate-in slide-in-from-bottom-2 ${typeStyles[type] || typeStyles.info}`} role="alert" aria-live="polite">
      {type === "success" && (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      )}
      {type === "error" && <Icons.AlertTriangle className="h-5 w-5" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 rounded-lg p-1 hover:bg-white/20 transition-colors" aria-label="Dismiss notification">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function AssignmentDetailsPage() {
  const params = useParams();
  const id = params.id;

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchAssignment = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSingleAssignment(id);
      setAssignment(data.assignment);
    } catch (error) {
      console.error(error);
      showToast("Failed to load assignment details.", "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    if (id) fetchAssignment();
  }, [id, fetchAssignment]);

  const handlePublish = useCallback(async () => {
    setIsProcessing(true);
    try {
      await publishAssignment(id);
      showToast("Assignment published successfully!", "success");
      await fetchAssignment();
    } catch (error) {
      console.error(error);
      showToast("Failed to publish assignment.", "error");
    } finally {
      setIsProcessing(false);
    }
  }, [id, fetchAssignment, showToast]);

  const handleClose = useCallback(async () => {
    setIsProcessing(true);
    try {
      await closeAssignment(id);
      showToast("Assignment closed successfully.", "success");
      await fetchAssignment();
    } catch (error) {
      console.error(error);
      showToast("Failed to close assignment.", "error");
    } finally {
      setIsProcessing(false);
    }
  }, [id, fetchAssignment, showToast]);

  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <SkeletonLoader />
      </DashboardLayout>
    );
  }

  if (!assignment) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-custom bg-card px-8 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Icons.AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-foreground">Assignment Not Found</h2>
          <p className="mt-2 text-muted-foreground">The assignment you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/teacher/assignments"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover"
          >
            <Icons.ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const status = STATUS_CONFIG[assignment.status] || STATUS_CONFIG.DRAFT;
  const StatusIcon = status.icon;
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  const questionTypes = assignment.questions?.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {}) || {};

  return (
    <DashboardLayout role="TEACHER">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/teacher/assignments" className="transition-colors hover:text-foreground">Assignments</Link>
          <span>/</span>
          <span className="font-medium text-foreground truncate max-w-[200px]">{assignment.title}</span>
        </nav>

        {/* ── Header Card ── */}
        <div className="rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{assignment.title}</h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${status.bg} ${status.text} ${status.border}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                    Overdue
                  </span>
                )}
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{assignment.description || "No description provided."}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Icons.BookOpen className="h-3.5 w-3.5" />
                  {assignment.courseId?.title || "Unknown Course"}
                </span>
                <span className="h-3 w-px bg-border-custom" />
                <span className="inline-flex items-center gap-1">
                  <Icons.Calendar className="h-3.5 w-3.5" />
                  Due {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/teacher/assignments/${assignment._id}/edit`}
                className="inline-flex items-center gap-2 rounded-xl border border-border-custom px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-border-custom"
              >
                <Icons.Pencil className="h-4 w-4" />
                Edit
              </Link>
              {assignment.status === "DRAFT" && (
                <button
                  onClick={handlePublish}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 active:scale-[0.98]"
                >
                  {isProcessing ? <Icons.Loader className="h-4 w-4 animate-spin" /> : <Icons.Rocket className="h-4 w-4" />}
                  {isProcessing ? "Publishing..." : "Publish"}
                </button>
              )}
              {assignment.status === "PUBLISHED" && (
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 active:scale-[0.98]"
                >
                  {isProcessing ? <Icons.Loader className="h-4 w-4 animate-spin" /> : <Icons.Lock className="h-4 w-4" />}
                  {isProcessing ? "Closing..." : "Close"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Icons.HelpCircle}
            label="Total Questions"
            value={assignment.questions?.length || 0}
            subtext={Object.entries(questionTypes).map(([t, c]) => `${c} ${t}`).join(" · ")}
            color="primary"
          />
          <StatCard
            icon={Icons.Award}
            label="Total Marks"
            value={assignment.totalMarks || 0}
            color="emerald"
          />
          <StatCard
            icon={Icons.Repeat}
            label="Max Attempts"
            value={assignment.maxAttempts || 1}
            color="amber"
          />
          <StatCard
            icon={Icons.Calendar}
            label="Due Date"
            value={new Date(assignment.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            subtext={isOverdue ? "Overdue" : `${Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left`}
            color={isOverdue ? "rose" : "primary"}
          />
        </div>

        {/* ── Settings Section ── */}
        <section className="rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icons.Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Assignment Settings</h2>
              <p className="text-xs text-muted-foreground">Configuration and restrictions for this assignment</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <SettingItem
              icon={Icons.ListChecks}
              label="Assignment Type"
              value={assignment.type || "MIXED"}
            />
            <SettingItem
              icon={Icons.Clock}
              label="Time Limit"
              value={assignment.timeLimit ? `${assignment.timeLimit} minutes` : "No limit"}
            />
            <SettingItem
              icon={Icons.Repeat}
              label="Retry Delay"
              value={`${assignment.retryDelay || 0} minutes`}
            />
            <SettingItem
              icon={Icons.Calendar}
              label="Late Submission"
              value={assignment.allowLateSubmission ? "Allowed" : "Not allowed"}
              active={assignment.allowLateSubmission}
            />
            <SettingItem
              icon={Icons.Shuffle}
              label="Shuffle Questions"
              value={assignment.shuffleQuestions ? "Enabled" : "Disabled"}
              active={assignment.shuffleQuestions}
            />
            <SettingItem
              icon={Icons.Eye}
              label="Show Results"
              value={assignment.showResultImmediately ? "Immediately" : "After evaluation"}
              active={assignment.showResultImmediately}
            />
            <SettingItem
              icon={Icons.CheckCircle}
              label="Show Correct Answers"
              value={assignment.showCorrectAnswers ? "Enabled" : "Disabled"}
              active={assignment.showCorrectAnswers}
            />
            <SettingItem
              icon={Icons.Repeat}
              label="Auto Submit"
              value={assignment.autoSubmit ? "Enabled" : "Disabled"}
              active={assignment.autoSubmit}
            />
            <SettingItem
              icon={Icons.Repeat}
              label="Allow Resubmission"
              value={assignment.allowResubmission ? "Enabled" : "Disabled"}
              active={assignment.allowResubmission}
            />
          </div>
        </section>

        {/* ── Questions Section ── */}
        <section className="rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icons.HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Questions</h2>
                <p className="text-xs text-muted-foreground">{assignment.questions?.length || 0} questions · {assignment.totalMarks || 0} total marks</p>
              </div>
            </div>
            <Link
              href={`/teacher/assignments/${assignment._id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl border border-border-custom px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Icons.Pencil className="h-3.5 w-3.5" />
              Edit Questions
            </Link>
          </div>

          {assignment.questions?.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-custom py-12 text-center">
              <Icons.HelpCircle className="h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium text-foreground">No questions added yet</p>
              <p className="text-xs text-muted-foreground">Edit this assignment to add questions.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignment.questions.map((question, index) => (
                <QuestionCard key={question._id || index} question={question} index={index} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
}
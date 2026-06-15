"use client";

import { useEffect, useState, useCallback } from "react";
import { getMyProfile } from "@/services/teacher/profileService";
import TeacherProfileCard from "@/components/teachers/profile/TeacherProfileCard";
import TeacherProfileInfo from "@/components/teachers/profile/TeacherProfileInfo";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

/* ─── Inline Icons ─── */
const Icons = {
  Loader: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  User: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  RefreshCw: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 12 15 16 10" />
    </svg>
  ),
};

/* ─── Skeleton Card (matches TeacherProfileCard dimensions) ─── */
function ProfileCardSkeleton() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border-custom bg-card shadow-sm">
      <div className="h-28 w-full animate-pulse bg-muted" />
      <div className="flex flex-col items-center px-6 pb-6 -mt-12">
        <div className="h-28 w-28 animate-pulse rounded-full border-4 border-card bg-muted" />
        <div className="mt-4 h-6 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-2 h-5 w-32 animate-pulse rounded-full bg-muted" />
        <div className="mt-4 w-full space-y-2">
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
        <div className="mt-5 h-10 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

/* ─── Info Skeleton ─── */
function InfoSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-3 w-64 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-muted" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded-lg bg-muted" />
            <div className="h-3 w-48 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}

/* ─── Error State ─── */
function ErrorState({ onRetry }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-border-custom bg-card px-8 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <Icons.AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-foreground">Failed to Load Profile</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        We couldn't retrieve your profile information. This might be a temporary issue.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover active:scale-[0.98]"
      >
        <Icons.RefreshCw className="h-4 w-4" />
        Try Again
      </button>
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
export default function TeacherProfilePage() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getMyProfile();
      setTeacher(data.teacher);
    } catch (err) {
      console.error(err);
      setError(true);
      showToast("Failed to load profile. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ── Loading State ── */
  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header Skeleton */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
              <div className="h-3 w-64 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ProfileCardSkeleton />
            <div className="lg:col-span-2">
              <InfoSkeleton />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── Error State ── */
  if (error) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <ErrorState onRetry={fetchProfile} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="TEACHER">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icons.User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  My Profile
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  View and manage your professional information
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Icons.ShieldCheck className="h-3.5 w-3.5" />
              Verified Teacher
            </span>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Profile Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <TeacherProfileCard teacher={teacher} />
            </div>
          </div>

          {/* Right: Profile Info */}
          <div className="lg:col-span-2">
            <TeacherProfileInfo teacher={teacher} />
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
}
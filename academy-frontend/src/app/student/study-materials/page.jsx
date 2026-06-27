"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  FileArchive,
  Users,
  Clock,
  BarChart3,
  ChevronRight,
  Loader2,
  AlertTriangle,
  FileText,
  Calendar,
  Eye,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import studentStudyMaterialService from "@/services/student/studyMaterialService";

/* ═══════════════════════════════════════════════════════════════
   STUDENT STUDY MATERIALS LIST
   Premium • Accessible • Filterable • Theme-consistent
   ═══════════════════════════════════════════════════════════════ */

export default function StudentStudyMaterialsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  /* ── Fetch data ── */
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentStudyMaterialService.getStudentStudyMaterials();
      setMaterials(response.materials || []);
      setFilteredMaterials(response.materials || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load study materials.");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Filter & sort ── */
  useEffect(() => {
    let result = [...materials];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.summary?.toLowerCase().includes(q) ||
          m.materialNumber?.toLowerCase().includes(q)
      );
    }

    if (typeFilter) {
      result = result.filter((m) => m.type === typeFilter);
    }

    if (difficultyFilter) {
      result = result.filter((m) => m.difficulty === difficultyFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "title-asc":
          return a.title?.localeCompare(b.title);
        case "title-desc":
          return b.title?.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredMaterials(result);
  }, [materials, searchQuery, typeFilter, difficultyFilter, sortBy]);

  /* ── Unique filter options ── */
  const typeOptions = useCallback(() => {
    const types = new Set(materials.map((m) => m.type).filter(Boolean));
    return Array.from(types);
  }, [materials])();

  const difficultyOptions = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

  /* ── Handlers ── */
  const handleView = useCallback(
    (id) => {
      router.push(`/student/study-materials/${id}`);
    },
    [router]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setTypeFilter("");
    setDifficultyFilter("");
    setSortBy("newest");
  }, []);

  const activeFilterCount = [typeFilter, difficultyFilter].filter(Boolean).length;

  /* ── Render ── */
  return (
    <DashboardLayout role="STUDENT">
      <div className="relative mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Study Materials
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {materials.length} material{materials.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <input
                type="search"
                placeholder="Search by title, summary, or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 py-2.5 pl-10 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] outline-none transition-all focus:border-[var(--primary)] focus:bg-[var(--card)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="">All Types</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="">All Levels</option>
              {difficultyOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition-all focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>

            {/* Clear */}
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Clear {activeFilterCount}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMaterials} />
        ) : filteredMaterials.length === 0 ? (
          <EmptyState
            hasFilters={searchQuery || typeFilter || difficultyFilter}
            onClear={clearFilters}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                onClick={() => handleView(material._id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function MaterialCard({ material, onClick }) {
  const difficultyColor = {
    BEGINNER: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    INTERMEDIATE: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    ADVANCED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  }[material.difficulty] || "bg-[var(--muted)] text-[var(--muted-foreground)]";

  const typeIcon = {
    PDF: FileText,
    VIDEO: BookOpen,
    SLIDES: FileArchive,
    CODE: FileText,
    NOTES: BookOpen,
    DOCUMENT: FileText,
    CHEATSHEET: FileArchive,
    LAB: BookOpen,
    REFERENCE: BookOpen,
    OTHER: FileArchive,
  }[material.type] || BookOpen;

  const Icon = typeIcon;

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
    >
      {/* Top accent */}
      <div
        className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${difficultyColor}`}
        >
          {material.difficulty}
        </span>
      </div>

      {/* Content */}
      <h3 className="mb-2 text-base font-semibold text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
        {material.title}
      </h3>

      {material.summary && (
        <p className="mb-4 text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
          {stripHtml(material.summary).slice(0, 120)}
          {stripHtml(material.summary).length > 120 ? "..." : ""}
        </p>
      )}

      {/* Meta */}
      <div className="mt-auto space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--muted)]/50 px-2 py-1">
            <FileArchive className="h-3 w-3" />
            {material.attachmentCount || 0} file
            {material.attachmentCount !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--muted)]/50 px-2 py-1">
            <Clock className="h-3 w-3" />
            {material.estimatedReadTime || 0} min
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Calendar className="h-3 w-3" />
            {material.publishedAt
              ? new Date(material.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : new Date(material.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] transition-transform group-hover:translate-x-0.5">
            View
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-[var(--muted)]" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-[var(--muted)]" />
          </div>
          <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
          <div className="mb-4 h-4 w-full animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--muted)]" />
        </div>
      ))}
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

function EmptyState({ hasFilters, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)]">
        <BookOpen className="h-8 w-8 text-[var(--muted-foreground)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">
        {hasFilters ? "No matching materials" : "No study materials yet"}
      </h3>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">
        {hasFilters
          ? "Try adjusting your filters to find what you're looking for."
          : "Check back later for new content from your teachers."}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

/* ── Utilities ── */
function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Loader2,
  Plus,
  Clock3,
  Users,
  Trash2,
  ChevronRight,
  SlidersHorizontal,
  X,
  Search,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTimetables, deleteTimetable } from "@/services/admin/timetableService";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const DAY_SHORT = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
};

const DAY_COLOR = {
  MONDAY:    "bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-950  dark:text-blue-300  dark:border-blue-800",
  TUESDAY:   "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  WEDNESDAY: "bg-amber-50  text-amber-700  border-amber-200  dark:bg-amber-950 dark:text-amber-300  dark:border-amber-800",
  THURSDAY:  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  FRIDAY:    "bg-rose-50   text-rose-700   border-rose-200   dark:bg-rose-950  dark:text-rose-300   dark:border-rose-800",
  SATURDAY:  "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function unique(arr, key) {
  const seen = new Set();
  return arr.filter((item) => {
    const val = key(item);
    if (!val || seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

function calcDuration(start, end) {
  if (!start || !end) return null;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = eh * 60 + em - (sh * 60 + sm);
  if (diff <= 0) return null;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
      <span>Admin</span>
      <ChevronRight className="w-3 h-3" />
      <span className="text-foreground font-medium">Timetables</span>
    </nav>
  );
}

function FilterChip({ label, active, onClick, onClear }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
      }`}
    >
      {label}
      {active && onClear && (
        <span
          role="button"
          aria-label={`Clear ${label} filter`}
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="ml-0.5 opacity-70 hover:opacity-100"
        >
          <X className="w-3 h-3" />
        </span>
      )}
    </button>
  );
}

function FilterSection({ timetables, filters, setFilters }) {
  const batches = useMemo(
    () => unique(timetables, (t) => t.batch?._id).map((t) => ({ id: t.batch._id, name: t.batch.name })),
    [timetables]
  );
  const teachers = useMemo(
    () => unique(timetables, (t) => t.teacher?._id).map((t) => ({ id: t.teacher._id, name: t.teacher?.userId?.fullName })),
    [timetables]
  );

  const activeCount = [filters.batch, filters.teacher, filters.day, filters.search].filter(Boolean).length;

  const clearAll = () => setFilters({ batch: "", teacher: "", day: "", search: "" });

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          Filters
          {activeCount > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search subject or room…"
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilters((p) => ({ ...p, search: "" }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Day filter */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Day</p>
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map((day) => (
              <FilterChip
                key={day}
                label={DAY_SHORT[day]}
                active={filters.day === day}
                onClick={() => setFilters((p) => ({ ...p, day: p.day === day ? "" : day }))}
                onClear={() => setFilters((p) => ({ ...p, day: "" }))}
              />
            ))}
          </div>
        </div>

        {/* Batch filter */}
        {batches.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Batch</p>
            <div className="flex flex-wrap gap-1.5">
              {batches.map((b) => (
                <FilterChip
                  key={b.id}
                  label={b.name}
                  active={filters.batch === b.id}
                  onClick={() => setFilters((p) => ({ ...p, batch: p.batch === b.id ? "" : b.id }))}
                  onClear={() => setFilters((p) => ({ ...p, batch: "" }))}
                />
              ))}
            </div>
          </div>
        )}

        {/* Teacher filter */}
        {teachers.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Teacher</p>
            <div className="flex flex-wrap gap-1.5">
              {teachers.map((t) => (
                <FilterChip
                  key={t.id}
                  label={t.name}
                  active={filters.teacher === t.id}
                  onClick={() => setFilters((p) => ({ ...p, teacher: p.teacher === t.id ? "" : t.id }))}
                  onClear={() => setFilters((p) => ({ ...p, teacher: "" }))}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimetableCard({ item, onDelete }) {
  const duration = calcDuration(item.startTime, item.endTime);
  const dayColor = DAY_COLOR[item.dayOfWeek] ?? "bg-muted text-muted-foreground border-border";

  return (
    <div className="group bg-card border border-border rounded-xl shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 overflow-hidden">
      {/* Left accent bar keyed to day */}
      <div className={`h-1 w-full ${dayColor.split(" ")[0].replace("bg-", "bg-").replace("50", "400").replace("950", "600")}`} />

      <div className="px-5 py-4 flex items-start justify-between gap-4">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Subject + day badge */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-semibold text-foreground truncate">{item.subject}</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${dayColor}`}>
              {item.dayOfWeek}
            </span>
          </div>

          {/* Batch & course */}
          <p className="text-sm text-primary font-medium mt-1 truncate">
            {item.batch?.name}
            {item.batch?.name && item.course?.title && <span className="text-muted-foreground font-normal"> · </span>}
            {item.course?.title}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 className="w-3.5 h-3.5 flex-shrink-0" />
              {item.startTime} – {item.endTime}
              {duration && (
                <span className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[10px] font-medium">
                  {duration}
                </span>
              )}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              {item.teacher?.userId?.fullName ?? "—"}
            </span>
            {item.roomNumber && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                Room {item.roomNumber}
              </span>
            )}
          </div>
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onDelete(item._id)}
          aria-label={`Delete timetable slot: ${item.subject}`}
          className="flex-shrink-0 w-8 h-8 rounded-lg border border-transparent flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive/40"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ filtered }) {
  return (
    <div className="bg-card border border-border rounded-xl p-14 text-center">
      <CalendarDays className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
      <h2 className="text-base font-semibold text-foreground">
        {filtered ? "No slots match your filters" : "No timetable slots yet"}
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        {filtered ? "Try adjusting or clearing the active filters." : "Create your first slot to get started."}
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TimetablesPage() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ batch: "", teacher: "", day: "", search: "" });

  useEffect(() => {
    fetchTimetables();
  }, []);

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      const response = await getTimetables();
      setTimetables(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this timetable slot?")) return;
    try {
      await deleteTimetable(id);
      fetchTimetables();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = useMemo(() => {
    return timetables.filter((item) => {
      if (filters.batch && item.batch?._id !== filters.batch) return false;
      if (filters.teacher && item.teacher?._id !== filters.teacher) return false;
      if (filters.day && item.dayOfWeek !== filters.day) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const inSubject = item.subject?.toLowerCase().includes(q);
        const inRoom = item.roomNumber?.toLowerCase().includes(q);
        if (!inSubject && !inRoom) return false;
      }
      return true;
    });
  }, [timetables, filters]);

  const isFiltered = Object.values(filters).some(Boolean);

  // Group visible results by day for visual organisation
  const groupedByDay = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      const d = item.dayOfWeek;
      if (!groups[d]) groups[d] = [];
      groups[d].push(item);
    });
    // Sort groups by DAYS order
    return DAYS.filter((d) => groups[d]).map((d) => ({ day: d, items: groups[d] }));
  }, [filtered]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-5xl mx-auto py-2 space-y-5">
        <Breadcrumb />

        {/* Page header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Timetable Management</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loading ? "Loading…" : `${timetables.length} total slot${timetables.length !== 1 ? "s" : ""}${isFiltered ? ` · ${filtered.length} shown` : ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/timetables/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Plus className="w-4 h-4" />
              Create slot
            </Link>
            <Link
              href="/admin/timetables/bulk"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <Plus className="w-4 h-4" />
              Bulk builder
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading timetables…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

            {/* ── Filters sidebar ─────────────────────────────────── */}
            <div className="lg:sticky lg:top-4">
              <FilterSection
                timetables={timetables}
                filters={filters}
                setFilters={setFilters}
              />
            </div>

            {/* ── Results ─────────────────────────────────────────── */}
            <div className="space-y-6 min-w-0">
              {filtered.length === 0 ? (
                <EmptyState filtered={isFiltered} />
              ) : (
                groupedByDay.map(({ day, items }) => (
                  <div key={day}>
                    {/* Day group header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DAY_COLOR[day]}`}>
                        {day}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {items.length} slot{items.length !== 1 ? "s" : ""}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <div className="space-y-2.5">
                      {items.map((item) => (
                        <TimetableCard
                          key={item._id}
                          item={item}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
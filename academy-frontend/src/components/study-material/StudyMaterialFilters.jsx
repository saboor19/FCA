"use client";

import { useCallback, useRef, useState } from "react";
import { Search, RotateCcw, SlidersHorizontal, X, ChevronDown } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   STUDY MATERIAL FILTERS
   Fluid • Accessible • Keyboard-navigable • Theme-consistent
   ═══════════════════════════════════════════════════════════════ */

export default function StudyMaterialFilters({
  filters,
  onChange,
  onReset,

  courses = [],
  batches = [],
  subjects = [],
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeChipCount, setActiveChipCount] = useState(() => countActive(filters));
  const searchRef = useRef(null);

  /* ── Helpers ── */
  const handleChange = useCallback((name, value) => {
    const next = { ...filters, [name]: value };
    onChange?.(next);
    setActiveChipCount(countActive(next));
  }, [filters, onChange]);

  const handleReset = useCallback(() => {
    onReset?.();
    setActiveChipCount(0);
    searchRef.current?.focus();
  }, [onReset]);

  const hasActiveFilters = activeChipCount > 0;

  /* ── Active filter chips for quick removal ── */
  const activeChips = getActiveChips(filters, { courses, batches, subjects });

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* ═══════════════════════════════════════════════
          HEADER: Collapsible + Active Count + Reset
          ═══════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => setIsExpanded((p) => !p)}
          className="group flex items-center gap-2.5 rounded-lg px-2 py-1 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
          aria-expanded={isExpanded}
          aria-controls="filter-panel"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[10px] font-bold text-white">
              {activeChipCount}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-[var(--muted-foreground)] transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          EXPANDABLE FILTER PANEL
          ═══════════════════════════════════════════════ */}
      <div
        id="filter-panel"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[var(--border)] px-6 py-5">
          {/* ── Search (Full Width, Prominent) ── */}
          <div className="mb-5">
            <label htmlFor="filter-search" className="sr-only">
              Search study materials
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4.5 w-4.5 text-[var(--muted-foreground)]" />
              </div>
              <input
                ref={searchRef}
                id="filter-search"
                name="search"
                type="search"
                placeholder="Search by title, summary, or tags..."
                value={filters.search || ""}
                onChange={(e) => handleChange("search", e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 py-3 pl-11 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-all duration-200 focus:border-[var(--primary)] focus:bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
              {filters.search && (
                <button
                  onClick={() => handleChange("search", "")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── Filter Grid ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <FilterSelect
              label="Course"
              name="course"
              value={filters.course}
              onChange={handleChange}
              options={courses}
              placeholder="All Courses"
            />
            <FilterSelect
              label="Batch"
              name="batch"
              value={filters.batch}
              onChange={handleChange}
              options={batches}
              placeholder="All Batches"
            />
            <FilterSelect
              label="Subject"
              name="subject"
              value={filters.subject}
              onChange={handleChange}
              options={subjects}
              placeholder="All Subjects"
            />
            <FilterSelect
              label="Visibility"
              name="visibility"
              value={filters.visibility}
              onChange={handleChange}
              options={[
                { label: "All Visibility", value: "" },
                { label: "Batch Only", value: "BATCH_ONLY" },
                { label: "Shared Batches", value: "SHARED_BATCHES" },
              ]}
              placeholder="All Visibility"
            />
            <FilterSelect
              label="Sort By"
              name="sort"
              value={filters.sort}
              onChange={handleChange}
              options={[
                { label: "Newest First", value: "-createdAt" },
                { label: "Oldest First", value: "createdAt" },
                { label: "Title A–Z", value: "title" },
                { label: "Title Z–A", value: "-title" },
              ]}
              placeholder="Newest First"
            />
          </div>

          {/* ── Active Filter Chips ── */}
          {activeChips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                Active:
              </span>
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => handleChange(chip.name, "")}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--primary)]/5 px-3 py-1.5 text-sm font-medium text-[var(--primary)] transition-all hover:bg-[var(--primary)]/10 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
                >
                  <span className="text-[var(--muted-foreground)]">{chip.label}:</span>
                  <span>{chip.value}</span>
                  <X className="h-3.5 w-3.5 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--destructive)]" />
                </button>
              ))}
              <button
                onClick={handleReset}
                className="ml-1 text-xs font-medium text-[var(--muted-foreground)] underline-offset-2 hover:text-[var(--destructive)] hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function FilterSelect({ label, name, value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectId = `filter-${name}`;
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <label
        htmlFor={selectId}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 py-2.5 pl-3.5 pr-10 text-sm text-[var(--foreground)] transition-all duration-200 focus:border-[var(--primary)] focus:bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════════ */

function countActive(filters) {
  return Object.entries(filters).filter(([key, val]) => {
    if (key === "sort" && val === "-createdAt") return false; // default sort doesn't count
    return val && val !== "";
  }).length;
}

function getActiveChips(filters, { courses, batches, subjects }) {
  const chips = [];
  const labelMap = {
    course: { label: "Course", options: courses },
    batch: { label: "Batch", options: batches },
    subject: { label: "Subject", options: subjects },
    visibility: {
      label: "Visibility",
      options: [
        { label: "Batch Only", value: "BATCH_ONLY" },
        { label: "Shared Batches", value: "SHARED_BATCHES" },
      ],
    },
    sort: {
      label: "Sort",
      options: [
        { label: "Newest First", value: "-createdAt" },
        { label: "Oldest First", value: "createdAt" },
        { label: "Title A–Z", value: "title" },
        { label: "Title Z–A", value: "-title" },
      ],
    },
  };

  Object.entries(filters).forEach(([key, val]) => {
    if (!val || val === "") return;
    if (key === "sort" && val === "-createdAt") return; // skip default

    const config = labelMap[key];
    if (!config) return;

    const option = config.options.find((o) => o.value === val);
    const displayValue = option?.label || val;

    chips.push({
      key: `${key}-${val}`,
      name: key,
      label: config.label,
      value: displayValue,
    });
  });

  return chips;
}
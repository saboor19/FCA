"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Loader2,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTeachers } from "@/services/admin/teacherService";
import { getBatches } from "@/services/admin/batchService";
import { getCourses } from "@/services/admin/courseService";
import { createBulkTimetable } from "@/services/admin/timetableService";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const DAY_SHORT = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
};

const EMPTY_SLOT = () => ({
  subject: "",
  startTime: "",
  endTime: "",
  roomNumber: "",
});

function timeToMins(t) {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcDuration(start, end) {
  const s = timeToMins(start);
  const e = timeToMins(end);
  if (s === null || e === null || e <= s) return "";
  const diff = e - s;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

function calcTotalHours(slots) {
  let total = 0;
  slots.forEach((s) => {
    const st = timeToMins(s.startTime);
    const et = timeToMins(s.endTime);
    if (st !== null && et !== null && et > st) total += et - st;
  });
  if (total === 0) return "0h";
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
}

function getConflicts(slots) {
  const found = [];
  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) continue;
      const as_ = timeToMins(a.startTime),
        ae = timeToMins(a.endTime);
      const bs = timeToMins(b.startTime),
        be = timeToMins(b.endTime);
      if (as_ < be && ae > bs) found.push({ first: i, second: j });
    }
  }
  return found;
}

// ─── Shared input / select class helpers ────────────────────────────────────
const inputCls =
  "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-150";

const selectCls = inputCls + " appearance-none cursor-pointer";

// ─── Sub-components ──────────────────────────────────────────────────────────

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
      <span>Admin</span>
      <ChevronRight className="w-3 h-3" />
      <span>Timetables</span>
      <ChevronRight className="w-3 h-3" />
      <span className="text-foreground font-medium">Bulk Builder</span>
    </nav>
  );
}

function PageHeader({ conflicts }) {
  const hasConflicts = conflicts.length > 0;
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <CalendarClock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Bulk Timetable Builder
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1 ml-[2.75rem]">
          Schedule multiple slots for a batch, course, and teacher in one
          submission.
        </p>
      </div>
      <span
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
          hasConflicts
            ? "bg-destructive/10 text-destructive border-destructive/30"
            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
        }`}
      >
        {hasConflicts ? (
          <AlertTriangle className="w-3.5 h-3.5" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
        {hasConflicts
          ? `${conflicts.length} conflict${conflicts.length !== 1 ? "s" : ""}`
          : "No conflicts"}
      </span>
    </div>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description, action }) {
  return (
    <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-border">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="text-muted-foreground">
            <Icon className="w-4 h-4" />
          </span>
        )}
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

function FieldGroup({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

function DayTabs({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5 px-5 py-4">
      {DAYS.map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => onChange(day)}
          className={`px-3.5 py-1.5 rounded-md text-xs font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring ${
            value === day
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
          }`}
        >
          {DAY_SHORT[day]}
          <span className="hidden sm:inline ml-1 opacity-70">
            {day.charAt(0) + day.slice(1).toLowerCase().slice(0, 2)}
          </span>
        </button>
      ))}
    </div>
  );
}

function MetricBar({ slots, conflicts, selectedDay }) {
  const totalHours = calcTotalHours(slots);
  const hasConflicts = conflicts.length > 0;

  const metrics = [
    { label: "Slots", value: slots.length, icon: Clock },
    { label: "Total hours", value: totalHours, icon: Clock },
    { label: "Day", value: DAY_SHORT[selectedDay], icon: CalendarClock },
    {
      label: "Conflicts",
      value: conflicts.length,
      icon: AlertTriangle,
      danger: hasConflicts,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-4 border-t border-border bg-muted/30">
      {metrics.map(({ label, value, icon: Icon, danger }) => (
        <div key={label} className="flex flex-col gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <span
            className={`text-lg font-semibold leading-none ${
              danger ? "text-destructive" : "text-foreground"
            }`}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function ConflictAlert({ conflicts }) {
  if (conflicts.length === 0) return null;
  const pairs = conflicts
    .map((c) => `Slot ${c.first + 1} & ${c.second + 1}`)
    .join(", ");
  return (
    <div className="mx-5 mb-3 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3">
      <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-destructive">
          Time conflicts detected
        </p>
        <p className="text-xs text-destructive/80 mt-0.5">
          Overlapping: {pairs}. Adjust times to continue.
        </p>
      </div>
    </div>
  );
}

function SlotRow({ slot, index, isConflict, onChange, onRemove, showRemove }) {
  const duration = calcDuration(slot.startTime, slot.endTime);

  return (
    <tr
      className={`group border-b border-border last:border-b-0 transition-colors ${
        isConflict ? "bg-destructive/5" : "hover:bg-muted/30"
      }`}
    >
      {/* # */}
      <td className="pl-5 pr-3 py-3 w-10">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium border ${
            isConflict
              ? "bg-destructive/10 border-destructive/40 text-destructive"
              : "bg-muted border-border text-muted-foreground"
          }`}
        >
          {index + 1}
        </div>
      </td>

      {/* Subject */}
      <td className="px-2 py-3">
        <input
          type="text"
          placeholder="Subject name"
          value={slot.subject}
          onChange={(e) => onChange(index, "subject", e.target.value)}
          required
          className={inputCls}
        />
      </td>

      {/* Start */}
      <td className="px-2 py-3 w-[130px]">
        <div className="flex flex-col gap-1">
          <input
            type="time"
            value={slot.startTime}
            onChange={(e) => onChange(index, "startTime", e.target.value)}
            required
            className={`${inputCls} ${
              isConflict
                ? "border-destructive/60 bg-destructive/5 focus:ring-destructive/40"
                : ""
            }`}
          />
          {duration && (
            <span className="text-[10px] text-muted-foreground pl-1">
              {duration}
            </span>
          )}
        </div>
      </td>

      {/* End */}
      <td className="px-2 py-3 w-[120px]">
        <input
          type="time"
          value={slot.endTime}
          onChange={(e) => onChange(index, "endTime", e.target.value)}
          required
          className={`${inputCls} ${
            isConflict
              ? "border-destructive/60 bg-destructive/5 focus:ring-destructive/40"
              : ""
          }`}
        />
      </td>

      {/* Room */}
      <td className="px-2 py-3 w-[110px]">
        <input
          type="text"
          placeholder="Room"
          value={slot.roomNumber}
          onChange={(e) => onChange(index, "roomNumber", e.target.value)}
          className={inputCls}
        />
      </td>

      {/* Remove */}
      <td className="pl-2 pr-5 py-3 w-10">
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove slot ${index + 1}`}
            className="w-7 h-7 rounded-md flex items-center justify-center border border-transparent text-muted-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-all duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-destructive/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </td>
    </tr>
  );
}

function SlotsTable({ slots, conflicts, onSlotChange, onRemoveSlot }) {
  const conflictIndices = new Set(
    conflicts.flatMap((c) => [c.first, c.second]),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="pl-5 pr-3 py-2.5 text-left w-10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                #
              </span>
            </th>
            <th className="px-2 py-2.5 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Subject
              </span>
            </th>
            <th className="px-2 py-2.5 text-left w-[130px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Start
              </span>
            </th>
            <th className="px-2 py-2.5 text-left w-[120px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                End
              </span>
            </th>
            <th className="px-2 py-2.5 text-left w-[110px]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Room
              </span>
            </th>
            <th className="pl-2 pr-5 py-2.5 w-10" />
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, i) => (
            <SlotRow
              key={i}
              index={i}
              slot={slot}
              isConflict={conflictIndices.has(i)}
              onChange={onSlotChange}
              onRemove={onRemoveSlot}
              showRemove={slots.length > 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function BulkTimetablePage() {
  const router = useRouter();

  const [teachers, setTeachers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState({
    batch: "",
    course: "",
    teacher: "",
    dayOfWeek: "MONDAY",
  });

  const [slots, setSlots] = useState([EMPTY_SLOT()]);

  const conflicts = getConflicts(slots);

  // ── Fetch initial data ──────────────────────────────────────────────────

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        const [teacherRes, batchRes, courseRes] = await Promise.all([
          getTeachers(),
          getBatches(),
          getCourses(),
        ]);
        setTeachers(teacherRes.data || []);
        setBatches(batchRes.data || []);
        setCourses(courseRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleFormChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleDayChange = useCallback((day) => {
    setFormData((prev) => ({ ...prev, dayOfWeek: day }));
  }, []);

  const handleSlotChange = useCallback((index, field, value) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  const addSlot = useCallback(() => {
    setSlots((prev) => [...prev, EMPTY_SLOT()]);
  }, []);

  const removeSlot = useCallback((index) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (conflicts.length > 0) {
      alert("Please resolve all time conflicts before saving.");
      return;
    }
    try {
      setLoading(true);
      await createBulkTimetable({ ...formData, slots });
      router.push("/admin/timetables");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────

  if (initialLoading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading resources…</p>
        </div>
      </DashboardLayout>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-5xl mx-auto py-2 space-y-5">
        <Breadcrumb />
        <PageHeader conflicts={conflicts} />

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* ── Session Context ─────────────────────────────────────── */}
          <SectionCard>
            <SectionHeader
              icon={BookOpen}
              title="Session context"
              description="Select the batch, course, and teacher for this timetable."
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-5 py-5">
              <FieldGroup label="Batch">
                <div className="relative">
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleFormChange}
                    required
                    className={selectCls}
                  >
                    <option value="">Select batch</option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <GraduationCap className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </FieldGroup>

              <FieldGroup label="Course">
                <div className="relative">
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleFormChange}
                    required
                    className={selectCls}
                  >
                    <option value="">Select course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                  <BookOpen className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </FieldGroup>

              <FieldGroup label="Teacher">
                <div className="relative">
                  <select
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleFormChange}
                    required
                    className={selectCls}
                  >
                    <option value="">Select teacher</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.userId?.fullName}
                      </option>
                    ))}
                  </select>
                  <Users className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </FieldGroup>
            </div>

            <div className="border-t border-border px-5 pt-1 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block pt-3 pb-1">
                Day of week
              </span>
              <DayTabs value={formData.dayOfWeek} onChange={handleDayChange} />
            </div>
          </SectionCard>

          {/* ── Time Slots ──────────────────────────────────────────── */}
          <SectionCard>
            <SectionHeader
              icon={Clock}
              title="Time slots"
              description="Define all periods for the selected day."
              action={
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
                  {slots.length} slot{slots.length !== 1 ? "s" : ""}
                </span>
              }
            />

            <ConflictAlert conflicts={conflicts} />

            <SlotsTable
              slots={slots}
              conflicts={conflicts}
              onSlotChange={handleSlotChange}
              onRemoveSlot={removeSlot}
            />

            {/* Add row button */}
            <div className="px-5 py-3 border-t border-dashed border-border">
              <button
                type="button"
                onClick={addSlot}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <Plus className="w-4 h-4" />
                Add another slot
              </button>
            </div>

            <MetricBar
              slots={slots}
              conflicts={conflicts}
              selectedDay={formData.dayOfWeek}
            />
          </SectionCard>

          {/* ── Footer Actions ──────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 flex-wrap py-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Conflicts are validated automatically on every change.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || conflicts.length > 0}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <CalendarClock className="w-4 h-4" />
                    Create timetable
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

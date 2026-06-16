"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Monitor,
  Users,
  Video,
  ChevronRight,
  Loader2,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Zap,
  ArrowRight,
  X,
  ExternalLink,
  Clock3,
  Bell,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getMyTimetable } from "@/services/student/timetableService";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const DAY_SHORT = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const DAY_FULL = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

const MODE_CONFIG = {
  ONLINE: { icon: Video, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Online" },
  OFFLINE: { icon: MapPin, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", label: "Offline" },
  HYBRID: { icon: Monitor, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", label: "Hybrid" },
};

// ─── ANIMATION VARIANTS ───────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: { duration: 0.2 } },
};

// ─── HELPERS ──────────────────────────────────────────────────────
const getModeConfig = (mode) => MODE_CONFIG[mode] || MODE_CONFIG.OFFLINE;

const formatTime = (timeStr) => {
  if (!timeStr) return "N/A";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

const getDuration = (start, end) => {
  if (!start || !end) return "";
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const getToday = () => {
  const day = new Date().getDay();
  return DAYS[day === 0 ? 6 : day - 1];
};

// ─── CLASS CARD ────────────────────────────────────────────────────
function ClassCard({ item: cls, index }) {
  const modeConfig = getModeConfig(cls.mode);
  const ModeIcon = modeConfig.icon;
  const duration = getDuration(cls.startTime, cls.endTime);

  return (
    <motion.div
      variants={item}
      initial="rest"
      whileHover="hover"
      className="group relative overflow-hidden rounded-2xl border border-border-custom bg-card p-4 shadow-sm transition-all hover:shadow-lg sm:p-5"
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 h-full w-1 ${modeConfig.bg.replace("bg-", "bg-").replace("50", "500")}`} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Subject & Info */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
              {cls.subject}
            </h3>
            <span className={`inline-flex items-center gap-1 rounded-full border ${modeConfig.border} ${modeConfig.bg} ${modeConfig.color} px-2 py-0.5 text-[10px] font-semibold`}>
              <ModeIcon className="h-3 w-3" />
              {modeConfig.label}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{cls.course?.title}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" />
              {cls.teacher?.fullName || "TBA"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {cls.batch?.name}
            </span>
            {cls.roomNumber && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Room {cls.roomNumber}
              </span>
            )}
          </div>
        </div>

        {/* Right: Time & Action */}
        <div className="flex shrink-0 flex-col items-end gap-2 sm:items-end">
          <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
            <Clock3 className="h-4 w-4 text-primary" />
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">
                {formatTime(cls.startTime)} — {formatTime(cls.endTime)}
              </p>
              <p className="text-[10px] text-muted-foreground">{duration}</p>
            </div>
          </div>

          {cls.meetingLink && cls.mode !== "OFFLINE" && (
            <a
              href={cls.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-hover hover:shadow-md active:scale-95"
            >
              <Video className="h-3.5 w-3.5" />
              Join
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────
export default function StudentTimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(getToday());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("week"); // "week" | "day"

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    try {
      const data = await getMyTimetable();
      setTimetable(data.timetable || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Group by day
  const grouped = useMemo(() => {
    return DAYS.map((day) => ({
      day,
      classes: timetable.filter((item) => item.dayOfWeek === day),
    }));
  }, [timetable]);

  // Stats
  const stats = useMemo(() => {
    const total = timetable.length;
    const online = timetable.filter((t) => t.mode === "ONLINE").length;
    const offline = timetable.filter((t) => t.mode === "OFFLINE").length;
    const hybrid = timetable.filter((t) => t.mode === "HYBRID").length;
    return { total, online, offline, hybrid };
  }, [timetable]);

  // Filter classes for search
  const filterClasses = (classes) => {
    if (!searchQuery) return classes;
    const q = searchQuery.toLowerCase();
    return classes.filter(
      (c) =>
        c.subject?.toLowerCase().includes(q) ||
        c.course?.title?.toLowerCase().includes(q) ||
        c.teacher?.fullName?.toLowerCase().includes(q) ||
        c.batch?.name?.toLowerCase().includes(q)
    );
  };

  const activeDayClasses = filterClasses(
    timetable.filter((item) => item.dayOfWeek === activeDay)
  );

  // ─── LOADING ────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 h-14 w-14 animate-ping rounded-full bg-primary/10" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          </div>
          <h3 className="mt-5 text-lg font-semibold text-foreground">Loading timetable...</h3>
          <p className="mt-1 text-sm text-muted-foreground">Fetching your weekly schedule</p>
        </div>
      </DashboardLayout>
    );
  }

  // ─── EMPTY STATE ────────────────────────────────────────────────
  if (timetable.length === 0) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="space-y-6 pb-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl border border-border-custom bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-6 sm:p-8"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Timetable</h1>
                <p className="text-sm text-muted-foreground">View your weekly class schedule</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-border-custom bg-card p-12 sm:p-16"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
              <Calendar className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-foreground">No Classes Scheduled</h3>
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
              Your timetable is empty right now. Classes will appear here once they are assigned.
            </p>
            <button
              onClick={loadTimetable}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-hover"
            >
              <Loader2 className="h-4 w-4" />
              Refresh
            </button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── MAIN CONTENT ────────────────────────────────────────────────
  return (
    <DashboardLayout role="STUDENT">
      <div className="min-h-[calc(100vh-4rem)] space-y-6 pb-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border-custom bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-6 sm:p-8"
        >
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Student Portal</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">My Timetable</h1>
              <p className="text-sm text-muted-foreground">Your weekly class schedule at a glance</p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-border-custom bg-card/80 px-3 py-2 backdrop-blur-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{stats.total} Classes</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border-custom bg-card/80 px-3 py-2 backdrop-blur-sm">
                <Video className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold">{stats.online} Online</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subject, course, teacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border-custom bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-border-custom bg-card p-1">
              {["week", "day"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all ${
                    viewMode === mode
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {mode} View
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Day Tabs (for Day View) */}
        {viewMode === "day" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-1 overflow-x-auto rounded-xl border border-border-custom bg-card p-1"
          >
            {DAYS.map((day) => {
              const count = timetable.filter((t) => t.dayOfWeek === day).length;
              const isActive = activeDay === day;
              const isToday = day === getToday();
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`relative flex shrink-0 flex-col items-center rounded-lg px-3 py-2 text-xs transition-all sm:px-4 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span className="font-bold">{DAY_SHORT[day]}</span>
                  <span className={`text-[10px] ${isActive ? "text-white/80" : "text-muted-foreground/60"}`}>
                    {count} cls
                  </span>
                  {isToday && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* ─── WEEK VIEW ──────────────────────────────────────────── */}
        {viewMode === "week" && (
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-6">
            {grouped.map(({ day, classes }) => {
              const filtered = filterClasses(classes);
              const isToday = day === getToday();
              const hasClasses = filtered.length > 0;

              return (
                <motion.div
                  key={day}
                  variants={item}
                  className={`rounded-3xl border bg-card p-5 sm:p-6 transition-shadow ${
                    isToday ? "border-primary/30 shadow-sm ring-1 ring-primary/10" : "border-border-custom"
                  }`}
                >
                  {/* Day Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                          isToday ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {DAY_SHORT[day][0]}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-foreground">
                          {DAY_FULL[day]}
                          {isToday && (
                            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              Today
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          {filtered.length} class{filtered.length !== 1 ? "es" : ""}
                        </p>
                      </div>
                    </div>

                    {hasClasses && (
                      <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(filtered[0].startTime)} — {formatTime(filtered[filtered.length - 1].endTime)}
                      </div>
                    )}
                  </div>

                  {/* Classes */}
                  {hasClasses ? (
                    <div className="space-y-3">
                      {filtered.map((cls) => (
                        <ClassCard key={cls._id} item={cls} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl bg-muted/30 py-6 text-center text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      No classes scheduled for {DAY_FULL[day]}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ─── DAY VIEW ───────────────────────────────────────────── */}
        {viewMode === "day" && (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">
                  {DAY_FULL[activeDay]}
                  {activeDay === getToday() && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Today
                    </span>
                  )}
                </h2>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {activeDayClasses.length} class{activeDayClasses.length !== 1 ? "es" : ""}
              </span>
            </div>

            {activeDayClasses.length > 0 ? (
              <div className="space-y-3">
                {activeDayClasses.map((cls) => (
                  <ClassCard key={cls._id} item={cls} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-border-custom bg-card p-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Calendar className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">No Classes</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No classes scheduled for {DAY_FULL[activeDay]}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
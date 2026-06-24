"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Percent,
  ListTodo,
  Megaphone,
  Clock,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Bell,
  TrendingUp,
  XCircle,
  Minus,
  FileText,
  Users,
  School,
  BarChart3,
  CircleDollarSign,
  Timer,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { getStudentDashboard } from "@/services/studentService";
import { getAttendanceOverview, getAttendanceStats } from "@/services/student/attendanceService";
import { getStudentAssignments } from "@/services/student/assignmentService";
import { getNotices } from "@/services/student/noticeService";
import { getMyBatches } from "@/services/student/batchService";
import { getMyTimetable } from "@/services/student/timetableService";

/* ── helpers ── */
const statusConfig = {
  PAID: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Paid" },
  PENDING: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  OVERDUE: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Overdue" },
  PARTIAL: { icon: Minus, color: "text-sky-600", bg: "bg-sky-50", label: "Partial" },
};

const getFeeBadge = (status) =>
  statusConfig[status] || {
    icon: CircleDollarSign,
    color: "text-muted-foreground",
    bg: "bg-muted",
    label: status || "N/A",
  };

/* ── component ── */
export default function StudentDashboard() {
  const [attendance, setAttendance] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [batches, setBatches] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          attendanceOverview,
          attendanceStats,
          assignmentData,
          noticeData,
          batchData,
          timetableData,
        ] = await Promise.all([
          getAttendanceOverview(),
          getAttendanceStats(),
          getStudentAssignments(),
          getNotices(1, 5),
          getMyBatches(),
          getMyTimetable(),
        ]);

        setAttendance(attendanceOverview);
        setAssignments(assignmentData.assignments || []);
        setNotices(noticeData.notices || []);
        setBatches(batchData.batches || []);
        // console.log("this is batch data ",);
        setTimetable(timetableData.timetable || []);
      } catch (error) {
        console.log(error);
      }
    };

    loadDashboard();
  }, []);

  const pendingAssignments = assignments.filter(
    (item) => item.status !== "SUBMITTED"
  );
  const attendancePct = attendance?.percentage || 0;
  const feeBadge = getFeeBadge(dashboard?.feeStatus);

  return (
    <DashboardLayout role="STUDENT">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ── Header ── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
              Student Portal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome Back
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
            <CalendarDays className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Courses */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Courses
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  { batches.length || 0}
                </p>
              </div>
              <div className="rounded-xl bg-[color:var(--primary)]/10 p-2.5 text-[color:var(--primary)]">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[color:var(--muted-foreground)]">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Enrolled</span>
            </div>
          </div>

          {/* Attendance */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Attendance
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {dashboard?.attendance || 0}%
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                <Percent className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>On track</span>
            </div>
          </div>

          {/* Assignments */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Assignments
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {dashboard?.pendingAssignments || 0}
                </p>
              </div>
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400">
                <ListTodo className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Pending</span>
            </div>
          </div>

          {/* Fee Status */}
          <div className="group overflow-hidden rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                  Fee Status
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {feeBadge.label}
                </p>
              </div>
              <div className={`rounded-xl p-2.5 ${feeBadge.bg}`}>
                <feeBadge.icon className={`h-5 w-5 ${feeBadge.color}`} />
              </div>
            </div>
            <div className={`mt-4 flex items-center gap-1.5 text-xs font-medium ${feeBadge.color}`}>
              <CircleDollarSign className="h-3.5 w-3.5" />
              <span>Current Status</span>
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column (2/3) */}
          <div className="space-y-6 lg:col-span-2">
            {/* Today's Classes */}
            <div className="rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-sm">
              <div className="flex items-center justify-between border-b border-[color:var(--border-custom)] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold">Today&apos;s Classes</h2>
                </div>
                <span className="rounded-full bg-[color:var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--muted-foreground)]">
                  {timetable.length} total
                </span>
              </div>
              <div className="divide-y divide-[color:var(--border-custom)]">
                {timetable.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--muted)]">
                      <CalendarDays className="h-6 w-6 text-[color:var(--muted-foreground)]" />
                    </div>
                    <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                      No classes scheduled for today
                    </p>
                  </div>
                ) : (
                  timetable.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[color:var(--muted)]/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.subject}</p>
                          <p className="text-xs text-[color:var(--muted-foreground)]">
                            Class Session
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[color:var(--muted-foreground)]">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="font-medium">{item.startTime}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Assignments */}
            <div className="rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-sm">
              <div className="flex items-center justify-between border-b border-[color:var(--border-custom)] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <ListTodo className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold">Pending Assignments</h2>
                </div>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                  {pendingAssignments.length} pending
                </span>
              </div>
              <div className="divide-y divide-[color:var(--border-custom)]">
                {pendingAssignments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-[color:var(--muted-foreground)]">
                      All assignments submitted
                    </p>
                  </div>
                ) : (
                  pendingAssignments.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[color:var(--muted)]/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-[color:var(--muted-foreground)]">
                            {item.subject || "Assignment"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span className="font-medium">{item.dueDate}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-6">
            {/* Attendance Overview */}
            <div className="rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                  <Percent className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-semibold">Attendance Overview</h2>
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-[color:var(--muted)]"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${attendancePct * 2.64} ${264 - attendancePct * 2.64}`}
                      className="text-[color:var(--primary)] transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{attendancePct}%</span>
                    <span className="text-xs text-[color:var(--muted-foreground)]">
                      Present
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[color:var(--muted)] p-3 text-center">
                  <p className="text-lg font-bold text-[color:var(--primary)]">
                    {attendance?.presentDays || 0}
                  </p>
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    Present Days
                  </p>
                </div>
                <div className="rounded-xl bg-[color:var(--muted)] p-3 text-center">
                  <p className="text-lg font-bold text-red-500 dark:text-red-400">
                    {attendance?.absentDays || 0}
                  </p>
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    Absent Days
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Notices */}
            <div className="rounded-2xl border border-[color:var(--border-custom)] bg-[color:var(--card)] shadow-sm">
              <div className="flex items-center justify-between border-b border-[color:var(--border-custom)] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <Megaphone className="h-4 w-4" />
                  </div>
                  <h2 className="text-lg font-semibold">Notices</h2>
                </div>
                <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  {notices.length}
                </span>
              </div>
              <div className="divide-y divide-[color:var(--border-custom)]">
                {notices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-5 py-8 text-center">
                    <Bell className="h-8 w-8 text-[color:var(--muted-foreground)]" />
                    <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
                      No recent notices
                    </p>
                  </div>
                ) : (
                  notices.map((notice) => (
                    <div
                      key={notice._id}
                      className="px-5 py-4 transition-colors hover:bg-[color:var(--muted)]/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-[color:var(--primary)]" />
                        <div>
                          <h4 className="font-medium leading-snug">
                            {notice.title}
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                            {notice.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
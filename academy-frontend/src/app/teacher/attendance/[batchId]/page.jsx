"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Loader2,
  Save,
  Users,
  GraduationCap,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getBatchAttendance,
  markStudentAttendance,
} from "@/services/teacher/teacherAttendanceService";

// ---------- Status configuration ----------
const STATUS_CONFIG = {
  PRESENT: {
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    icon: CheckCircle,
    label: "Present",
  },
  ABSENT: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    icon: XCircle,
    label: "Absent",
  },
  LATE: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    icon: Clock,
    label: "Late",
  },
  LEAVE: {
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: FileText,
    label: "Leave",
  },
  NOT_MARKED: {
    color: "text-slate-400 dark:text-slate-500",
    bg: "bg-slate-50 dark:bg-slate-800",
    icon: AlertTriangle,
    label: "Not Marked",
  },
};

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "LATE", "LEAVE"];

// ---------- Animation variants ----------
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// ---------- Page component ----------
export default function BatchAttendancePage() {
  const params = useParams();
  const batchId = params.batchId;

  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ---------- Fetch attendance ----------
  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBatchAttendance(batchId, date);
      setAttendance(response.data || []);
      setStats(response.stats || {});
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [batchId, date]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  // ---------- Update status / remarks ----------
  const updateStatus = (enrollmentId, status) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.enrollmentId === enrollmentId ? { ...item, status } : item
      )
    );
  };

  const updateRemarks = (enrollmentId, remarks) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.enrollmentId === enrollmentId ? { ...item, remarks } : item
      )
    );
  };

  // ---------- Bulk update ----------
  const bulkUpdate = (status) => {
    if (!status) return;
    setAttendance((prev) =>
      prev.map((item) => ({ ...item, status }))
    );
    setBulkStatus(""); // reset dropdown
  };

  // ---------- Save ----------
  const handleSave = async () => {
    try {
      setSaving(true);
      await markStudentAttendance({
        batchId,
        date,
        attendance: attendance.map((item) => ({
          enrollmentId: item.enrollmentId,
          status: item.status,
          remarks: item.remarks,
        })),
      });
      setSuccessMessage("Attendance saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchAttendance(); // refresh stats
    } catch (err) {
      console.error(err);
      setError("Failed to save attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Loading skeleton ----------
  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
          {/* Header skeleton */}
          <div>
            <div className="h-9 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-72 mt-2 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border bg-white dark:bg-slate-900 p-4 h-20"
              >
                <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-8 w-16 mt-2 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))}
          </div>
          {/* Table skeleton */}
          <div className="rounded-3xl border overflow-hidden">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 grid grid-cols-4 gap-4">
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-t grid grid-cols-4 gap-4">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  // ---------- Error state ----------
  if (error && !attendance.length) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
            {error}
          </p>
          <button
            onClick={fetchAttendance}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-opacity"
            aria-label="Retry loading attendance"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // ---------- Main content ----------
  return (
    <DashboardLayout role="TEACHER">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Batch Attendance
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage student attendance for the selected date.
            </p>
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Select attendance date"
            />
          </div>
        </div>

        {/* Success / Error messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-2xl px-4 py-3 flex items-center gap-2"
            role="alert"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl px-4 py-3 flex items-center gap-2"
            role="alert"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-300"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </motion.div>
        )}

        {/* Stats cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {Object.entries(stats).map(([key, value]) => {
            const config = STATUS_CONFIG[key] || STATUS_CONFIG.NOT_MARKED;
            const Icon = config.icon;
            return (
              <motion.div
                key={key}
                variants={itemVariants}
                className={`rounded-2xl border bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md transition-shadow ${config.bg} border-slate-200 dark:border-slate-800`}
              >
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Icon className={`w-4 h-4 ${config.color}`} />
                  {config.label}
                </div>
                <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                  {value}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bulk actions */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="bulk-status"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Set all to:
          </label>
          <select
            id="bulk-status"
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select status for all students"
          >
            <option value="" disabled>
              Choose status...
            </option>
            {STATUS_OPTIONS.map((status) => {
              const config = STATUS_CONFIG[status];
              return (
                <option key={status} value={status}>
                  {config.label}
                </option>
              );
            })}
          </select>
          <button
            onClick={() => bulkUpdate(bulkStatus)}
            disabled={!bulkStatus}
            className="rounded-xl px-4 py-2 text-sm font-medium bg-slate-800 dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 dark:focus:ring-white"
            aria-label="Apply selected status to all students"
          >
            Apply
          </button>
        </div>

        {/* Attendance table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full min-w-[600px]">
            <caption className="sr-only">
              Attendance for {date} - use dropdowns to change status and input
              for remarks
            </caption>
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th scope="col" className="p-4 text-left font-medium">
                  Student
                </th>
                <th scope="col" className="p-4 text-left font-medium">
                  Enrollment
                </th>
                <th scope="col" className="p-4 text-left font-medium">
                  Status
                </th>
                <th scope="col" className="p-4 text-left font-medium">
                  Remarks
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {attendance.map((student) => {
                const currentConfig =
                  STATUS_CONFIG[student.status] || STATUS_CONFIG.NOT_MARKED;
                const StatusIcon = currentConfig.icon;
                return (
                  <motion.tr
                    key={student.enrollmentId}
                    variants={rowVariants}
                    className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        {student.fullName}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {student.enrollmentNo}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`w-4 h-4 ${currentConfig.color}`}
                        />
                        <select
                          value={student.status}
                          onChange={(e) =>
                            updateStatus(student.enrollmentId, e.target.value)
                          }
                          className={`border rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${currentConfig.color} border-slate-300 dark:border-slate-600`}
                          aria-label={`Status for ${student.fullName}`}
                        >
                          <option value="NOT_MARKED">Not Marked</option>
                          {STATUS_OPTIONS.map((status) => {
                            const cfg = STATUS_CONFIG[status];
                            return (
                              <option key={status} value={status}>
                                {cfg.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        value={student.remarks}
                        onChange={(e) =>
                          updateRemarks(
                            student.enrollmentId,
                            e.target.value
                          )
                        }
                        placeholder="Add remarks..."
                        className="border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label={`Remarks for ${student.fullName}`}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
            aria-label="Save attendance"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
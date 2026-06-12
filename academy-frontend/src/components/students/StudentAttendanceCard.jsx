"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  FileWarning,
  CalendarX2
} from "lucide-react";

import { getStudentAttendance } from "@/services/admin/attendanceService";

export default function StudentAttendanceCard({ studentId }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (studentId) {
      fetchAttendance();
    }
  }, [studentId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await getStudentAttendance(studentId);
      // Assuming API returns records, we sort them by date descending to show newest first
      const sortedData = (response.data || []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setAttendance(sortedData);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine styles and icons based on status
  const getStatusConfig = (status) => {
    switch (status) {
      case "PRESENT":
        return {
          icon: <CheckCircle2 size={14} />,
          // Flattened classes for hydration safety
          colors: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-400/10 dark:border-emerald-400/20 dark:text-emerald-400"
        };
      case "ABSENT":
        return {
          icon: <XCircle size={14} />,
          colors: "bg-red-50 border-red-200 text-red-700 dark:bg-red-400/10 dark:border-red-400/20 dark:text-red-400"
        };
      case "LATE":
        return {
          icon: <Clock size={14} />,
          colors: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-400/10 dark:border-amber-400/20 dark:text-amber-400"
        };
      case "LEAVE":
        return {
          icon: <FileWarning size={14} />,
          colors: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-400/10 dark:border-blue-400/20 dark:text-blue-400"
        };
      default:
        return {
          icon: <CalendarDays size={14} />,
          colors: "bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
        };
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border-custom rounded-2xl p-12 flex flex-col items-center justify-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Loading attendance history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-6 text-red-600 dark:text-red-400 flex items-center gap-3 shadow-sm">
        <XCircle className="w-5 h-5" />
        <p className="font-medium text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden">
      
      {/* HEADER & LEGEND */}
      <div className="p-6 border-b border-border-custom flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-900/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Attendance History
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Visual record of recent class sessions
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" /> Present
          </div>
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 dark:bg-red-400" /> Absent
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dark:bg-amber-400" /> Late
          </div>
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400" /> Leave
          </div>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="p-6">
        {attendance.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {attendance.map((item) => {
              const dateObj = new Date(item.date);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleString('default', { month: 'short' });
              const year = dateObj.getFullYear();
              
              const config = getStatusConfig(item.status);

              return (
                // Flattened dynamic class string
                <div
                  key={item._id}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all hover:-translate-y-1 hover:shadow-md ${config.colors}`}
                  title={item.remarks ? `Remarks: ${item.remarks}` : ""}
                >
                  {/* Calendar Tear-off Style */}
                  <div className="text-3xl font-black mb-1">
                    {day}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-3">
                    {month} {year}
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/50 dark:bg-black/20 px-2.5 py-1 rounded-full w-full justify-center">
                    {config.icon}
                    {item.status}
                  </div>

                  {/* Batch Name (Truncated for neatness) */}
                  <div className="mt-3 text-[10px] font-medium opacity-70 truncate w-full text-center">
                    {item.enrollment?.batch?.name || "Unknown Batch"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border-custom rounded-xl">
            <CalendarX2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-foreground font-medium">No Records Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              There is no attendance data available for this student yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
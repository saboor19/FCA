"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Monitor,
  MapPin,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getAssignedBatches } from "@/services/teacher/batchService";

// ---------- Animation variants ----------
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ---------- Page component ----------
export default function TeacherAttendancePage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAssignedBatches();
      setBatches(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load batches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const renderModeIcon = (mode) => {
    if (mode?.toUpperCase() === "ONLINE") {
      return <Monitor className="w-4 h-4" />;
    }
    return <MapPin className="w-4 h-4" />;
  };

  // ---------- Loading state ----------
  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div>
            <div className="h-9 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-5 w-96 mt-2 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl border bg-white dark:bg-slate-900 p-6 shadow-sm animate-pulse space-y-4"
              >
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 w-36 mt-4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ---------- Error state ----------
  if (error) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
            {error}
          </p>
          <button
            onClick={fetchBatches}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-opacity"
            aria-label="Retry loading batches"
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
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Student Attendance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
            Manage attendance for your assigned batches. Select a batch to mark
            or view attendance records.
          </p>
        </header>

        {/* Batch grid or empty state */}
        {batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
              No batches assigned
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              You currently have no batches to manage attendance for.
            </p>
          </div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 list-none p-0"
            role="list"
          >
            {batches.map((batch) => (
              <motion.li key={batch._id} variants={itemVariants} layout>
                <div className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 h-full flex flex-col">
                  <div className="space-y-3 flex-1">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {batch.name}
                    </h2>
                    {batch.course?.title && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        {batch.course.title}
                      </p>
                    )}
                    <div className="text-sm space-y-1 text-slate-600 dark:text-slate-400">
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Students: {batch.studentsCount ?? 0}
                      </p>
                      <p className="flex items-center gap-2">
                        {renderModeIcon(batch.mode)}
                        Mode: {batch.mode || "OFFLINE"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/teacher/attendance/${batch._id}`}
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black mt-4 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white self-start"
                    aria-label={`Mark attendance for ${batch.name}`}
                  >
                    Mark Attendance
                  </Link>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
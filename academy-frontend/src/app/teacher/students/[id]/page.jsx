"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Mail,
  Phone,
  CalendarDays,
  GraduationCap,
  BookOpen,
  Layers3,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  UserX
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getStudentById } from "@/services/teacher/studentService";

// Utility to extract initials for the avatar
const getInitials = (name) => {
  if (!name) return "US";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
};

export default function TeacherStudentDetailsPage() {
  const params = useParams();

  const studentId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await getStudentById(studentId);
      console.log(response);
      setStudent(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <main className="w-full max-w-5xl mx-auto space-y-8 pb-12">
          {/* Skeleton Back Button */}
          <div className="w-24 h-5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6" />
          
          {/* Skeleton Hero */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="w-1/3 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-1/4 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-2/3 h-4 bg-slate-200 dark:bg-slate-800 rounded" />)}
              </div>
            </div>
          </div>

          {/* Skeleton Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
          </div>
        </main>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout role="TEACHER">
        <main className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
            <UserX className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Student Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mb-8">
            The student profile you are looking for does not exist or you do not have permission to view it.
          </p>
          <Link href="/teacher/students" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all">
            Return to Directory
          </Link>
        </main>
      </DashboardLayout>
    );
  }

  const fullName = student.userId?.fullName || "Unknown Student";

  return (
    <DashboardLayout role="TEACHER">
      <main className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
        
        {/* TOP NAVIGATION */}
        <nav>
          <Link href="/teacher/students" className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </nav>

        {/* PROFILE HERO */}
        <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-8 relative overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 relative z-10 w-full">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-md ring-4 ring-white dark:ring-[#0f172a] shrink-0">
              {getInitials(fullName)}
            </div>

            {/* Identity & Contact Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {fullName}
                  </h1>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                      ID: {student.enrollmentNo || "N/A"}
                    </span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2 h-fit shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                  Active Student
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="truncate" title={student.userId?.email}>{student.userId?.email || "No email provided"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <span>{student.phone || "No phone provided"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="truncate" title={student.address}>{student.address || "No address provided"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center shrink-0">
                    <CalendarDays className="w-4 h-4 text-slate-400" />
                  </div>
                  <span>Joined {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Unknown"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS DASHBOARD */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {/* Batches Stat */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Assigned Batches</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{student.batches?.length || 0}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Layers3 className="w-6 h-6" />
            </div>
          </div>

          {/* Attendance Stat */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overall Attendance</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">92%</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          {/* Performance Stat */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-amber-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Performance</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">A+</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* ENROLLED BATCHES LIST */}
        <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center gap-3">
            <Layers3 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Enrolled Batches</h2>
          </div>

          {student.batches?.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {student.batches.map((batch) => (
                <div key={batch._id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {batch.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      {batch.course?.title || "No course assigned"}
                    </p>
                  </div>
                  
                  {/* Study Mode Badge */}
                  <div className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 text-xs font-semibold w-fit shadow-sm flex items-center gap-1.5 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${batch.studyMode?.toLowerCase() === 'online' ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                    {batch.studyMode || "Standard"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <Layers3 className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No batches assigned yet.</p>
            </div>
          )}
        </section>

      </main>
    </DashboardLayout>
  );
}
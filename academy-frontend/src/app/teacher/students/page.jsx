"use client";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Mail,
  Phone,
  GraduationCap,
  Search,
  ArrowRight,
  Filter,
  BookOpen,
  LayoutGrid,
  MoreVertical,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTeacherStudents } from "@/services/teacher/studentService";

// Utility to extract initials for the avatar
const getInitials = (name) => {
  if (!name) return "US";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
};

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  // Filter States
  const [search, setSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getTeacherStudents();
      setStudents(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically extract unique filter options from the data
  const uniqueBatches = useMemo(() => {
    const batches = students.map((s) => s.batch?.name).filter(Boolean);
    return ["All", ...new Set(batches)];
  }, [students]);

  const uniqueCourses = useMemo(() => {
    // Assuming course data might exist on the item, adjust if nested differently
    const courses = students.map((s) => s.course?.name || s.batch?.course?.name).filter(Boolean);
    return ["All", ...new Set(courses)];
  }, [students]);

  // Apply Search & Filters
  const filteredStudents = useMemo(() => {
    return students.filter((item) => {
      const name = item.student?.userId?.fullName?.toLowerCase() || "";
      const email = item.student?.userId?.email?.toLowerCase() || "";
      const searchLower = search.toLowerCase();
      
      const matchesSearch = searchLower === "" || name.includes(searchLower) || email.includes(searchLower);
      const matchesBatch = selectedBatch === "All" || item.batch?.name === selectedBatch;
      const matchesCourse = selectedCourse === "All" || (item.course?.name === selectedCourse || item.batch?.course?.name === selectedCourse);

      return matchesSearch && matchesBatch && matchesCourse;
    });
  }, [students, search, selectedBatch, selectedCourse]);

  return (
    <DashboardLayout role="TEACHER">
      <main className="w-full max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Student Directory</h1>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-xl">
              Manage, monitor, and support the students enrolled across your assigned batches and programs.
            </p>
          </div>
        </header>

        {/* METRICS DASHBOARD */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Total Students */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-indigo-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{students.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Active Batches */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-violet-500/30 transition-colors">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Batches</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{uniqueBatches.length - 1}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <LayoutGrid className="w-6 h-6" />
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:border-amber-500/30 transition-colors sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Programs / Courses</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{uniqueCourses.length - 1}</h2>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* SEARCH & FILTER CONTROLS */}
        <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:text-white transition-all placeholder:text-slate-400"
              aria-label="Search students"
            />
          </div>

          <div className="flex w-full lg:w-auto gap-4">
            {/* Batch Filter */}
            <div className="relative flex-1 lg:w-48">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-slate-400" />
              </div>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full h-11 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:text-white appearance-none cursor-pointer transition-all"
                aria-label="Filter by Batch"
              >
                {uniqueBatches.map((batch) => (
                  <option key={batch} value={batch}>{batch === "All" ? "All Batches" : batch}</option>
                ))}
              </select>
            </div>

            {/* Course Filter (Renders only if courses exist in data) */}
            {uniqueCourses.length > 1 && (
              <div className="relative flex-1 lg:w-48">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full h-11 pl-9 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 dark:text-white appearance-none cursor-pointer transition-all"
                  aria-label="Filter by Course"
                >
                  {uniqueCourses.map((course) => (
                    <option key={course} value={course}>{course === "All" ? "All Courses" : course}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </section>

        {/* DATA LIST */}
        <section className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Header Row */}
          <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="w-1/3">Student Details</div>
            <div className="w-1/4">Contact Info</div>
            <div className="w-1/4">Enrollment</div>
            <div className="w-auto text-right">Actions</div>
          </div>

          {loading ? (
            // Skeleton Loader
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 flex flex-col lg:flex-row items-start lg:items-center gap-6 animate-pulse">
                  <div className="flex items-center gap-4 w-1/3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    </div>
                  </div>
                  <div className="w-1/4 space-y-2">
                    <div className="w-40 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                    <div className="w-28 h-3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                  </div>
                  <div className="w-1/4 space-y-2">
                    <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </div>
                  <div className="w-auto flex gap-2">
                    <div className="w-24 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    <div className="w-28 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredStudents.map((item) => {
                const fullName = item.student?.userId?.fullName || "Unknown Student";
                return (
                  <div key={item._id} className="p-4 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                    
                    {/* Student Identity */}
                    <div className="flex items-center gap-4 lg:w-1/3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold tracking-wider shadow-sm ring-2 ring-white dark:ring-slate-900 shrink-0">
                        {getInitials(fullName)}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-base font-semibold text-slate-900 dark:text-white truncate" title={fullName}>
                          {fullName}
                        </span>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full w-max">
                          Student ID: {item.student?.enrollmentNo || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-1.5 lg:w-1/4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate" title={item.student?.userId?.email}>{item.student?.userId?.email || "No email provided"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{item.student?.phone || "No phone provided"}</span>
                      </div>
                    </div>

                    {/* Enrollment Details */}
                    <div className="flex flex-col gap-1.5 lg:w-1/4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Batch:</span>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.batch?.name || "Unassigned"}</span>
                      </div>
                      {item.course?.name && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Course:</span>
                          <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{item.course.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                   <div className="flex items-center gap-3 lg:w-auto mt-4 lg:mt-0 pt-4 border-t border-slate-100 dark:border-slate-800 lg:border-none lg:pt-0">
<Link 
  href={`/teacher/students/${item.student?._id}`} 
  className="flex-1 lg:flex-none h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transition-all flex items-center justify-center"
>
  Profile
</Link>
  
 
  
  <button 
    className="hidden lg:flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors" 
    aria-label="More options"
  >
    <MoreVertical className="w-5 h-5" />
  </button>
</div>

                  </div>
                );
              })}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No students found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                {search || selectedBatch !== "All" || selectedCourse !== "All" 
                  ? "We couldn't find any students matching your current filter criteria. Try adjusting your search."
                  : "You don't have any students assigned to your batches yet."}
              </p>
              {(search || selectedBatch !== "All" || selectedCourse !== "All") && (
                <button 
                  onClick={() => { setSearch(""); setSelectedBatch("All"); setSelectedCourse("All"); }}
                  className="mt-6 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </section>
      </main>
    </DashboardLayout>
  );
}
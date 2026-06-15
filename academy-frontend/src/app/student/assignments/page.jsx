"use client";

import { useEffect, useState } from "react";
import AssignmentList from "@/components/students/assignments/AssignmentList";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getStudentAssignments } from "@/services/student/assignmentService";

// Icons
const Icons = {
  BookOpen: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  Award: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Inbox: () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
};

const STATUS_CONFIG = {
  NOT_STARTED: { label: "Not Started", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/50", border: "border-slate-200 dark:border-slate-700", dot: "bg-slate-400" },
  IN_PROGRESS: { label: "In Progress", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
  SUBMITTED: { label: "Submitted", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
  GRADED: { label: "Graded", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
  LATE: { label: "Late", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", dot: "bg-red-500" }
};

// Stat Card
const StatCard = ({ icon: Icon, label, value, subtext, color }) => {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    slate: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400"
  };

  return (
    <div className="bg-card border border-border-custom rounded-2xl p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
          <Icon />
        </div>
        {subtext && (
          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg">
            {subtext}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
};

// Circular progress for average
const CircularProgress = ({ percentage, size = 48 }) => {
  const radius = (size - 4) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (p) => {
    if (p >= 80) return "#10b981";
    if (p >= 60) return "#4f46e5";
    if (p >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-muted" style={{ opacity: 0.2 }} />
        <circle cx={size/2} cy={size/2} r={radius} stroke={getColor(percentage)} strokeWidth="3" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[10px] font-bold text-foreground">{percentage}</span>
    </div>
  );
};

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const data = await getStudentAssignments();
      setAssignments(data.assignments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = !searchQuery || 
      assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || assignment.submissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics
  const totalAssignments = assignments.length;
  const notStartedCount = assignments.filter(a => a.submissionStatus === "NOT_STARTED").length;
  const inProgressCount = assignments.filter(a => a.submissionStatus === "IN_PROGRESS").length;
  const submittedCount = assignments.filter(a => ["SUBMITTED", "LATE", "AUTO_SUBMITTED"].includes(a.submissionStatus)).length;
  const gradedCount = assignments.filter(a => a.submissionStatus === "GRADED").length;
  
  // Calculate average score for graded assignments
  const gradedAssignments = assignments.filter(a => a.submissionStatus === "GRADED" && a.obtainedMarks > 0);
  const avgScore = gradedAssignments.length > 0 
    ? Math.round(gradedAssignments.reduce((acc, a) => acc + (a.obtainedMarks || 0), 0) / gradedAssignments.length)
    : 0;
  
  // Calculate average percentage if totalMarks available
  const avgPercentage = gradedAssignments.length > 0
    ? Math.round(gradedAssignments.reduce((acc, a) => {
        const pct = a.totalMarks > 0 ? ((a.obtainedMarks || 0) / a.totalMarks) * 100 : 0;
        return acc + pct;
      }, 0) / gradedAssignments.length)
    : 0;

  // Check for overdue assignments
  const now = new Date();
  const overdueCount = assignments.filter(a => 
    a.submissionStatus === "NOT_STARTED" && 
    new Date(a.dueDate) < now
  ).length;

  return (
    <DashboardLayout role="STUDENT">
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-foreground font-medium">Assignments</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                My Assignments
              </h1>
              <p className="text-muted-foreground mt-1">
                View, track, and submit your course assignments
              </p>
            </div>
            
            {/* Quick score preview if graded assignments exist */}
            {gradedCount > 0 && (
              <div className="flex items-center gap-3 px-4 py-3 bg-card border border-border-custom rounded-2xl">
                <CircularProgress percentage={avgPercentage} />
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Score</p>
                  <p className="text-sm font-bold text-foreground">{avgScore} pts</p>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard 
              icon={Icons.BookOpen} 
              label="Total" 
              value={totalAssignments}
              color="blue"
            />
            <StatCard 
              icon={Icons.Clock} 
              label="Not Started" 
              value={notStartedCount}
              subtext={overdueCount > 0 ? `${overdueCount} overdue` : undefined}
              color="slate"
            />
            <StatCard 
              icon={Icons.AlertTriangle} 
              label="In Progress" 
              value={inProgressCount}
              color="amber"
            />
            <StatCard 
              icon={Icons.CheckCircle} 
              label="Submitted" 
              value={submittedCount}
              color="violet"
            />
            <StatCard 
              icon={Icons.Award} 
              label="Graded" 
              value={gradedCount}
              subtext={avgPercentage > 0 ? `${avgPercentage}% avg` : undefined}
              color="emerald"
            />
          </div>

          {/* Filters & Search */}
          <div className="bg-card border border-border-custom rounded-2xl p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icons.Search />
                </div>
                <input
                  type="text"
                  placeholder="Search assignments by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border-custom rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <div className="flex items-center gap-1.5 text-muted-foreground mr-2 shrink-0">
                  <Icons.Filter />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                {['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'GRADED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      statusFilter === status
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border-custom'
                    }`}
                  >
                    {status === 'ALL' ? 'All' : STATUS_CONFIG[status]?.label || status}
                    {status !== 'ALL' && (
                      <span className="ml-1.5 opacity-70">
                        ({assignments.filter(a => a.submissionStatus === status).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Assignment List */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-card border border-border-custom rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-card border border-border-custom rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <Icons.Inbox />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {assignments.length === 0 ? "No Assignments Yet" : "No Results Found"}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {assignments.length === 0 
                  ? "You don't have any assignments at the moment. Check back later!"
                  : "Try adjusting your search or filter criteria to find what you're looking for."
                }
              </p>
              {assignments.length > 0 && statusFilter !== "ALL" && (
                <button 
                  onClick={() => setStatusFilter("ALL")}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                <span>
                  Showing <span className="font-medium text-foreground">{filteredAssignments.length}</span> of {assignments.length} assignments
                </span>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="text-primary hover:text-primary-hover font-medium transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
              
              <AssignmentList 
                assignments={filteredAssignments} 
                loading={false}
              />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
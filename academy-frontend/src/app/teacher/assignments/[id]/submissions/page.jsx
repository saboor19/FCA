"use client";

import { useEffect, useState } from "react";
import { useParams,useRouter  } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getAssignmentSubmissions } from "@/services/teacher/assignmentService";

// Inline icons to avoid dependency issues
const Icons = {
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  Award: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  ArrowUpDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="m21 8-4-4-4 4"/><path d="M3 16h18"/><path d="M3 8h18"/></svg>,
  ArrowUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  ArrowDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  MessageSquare: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  BarChart3: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  TrendingDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>,
  MoreHorizontal: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  Inbox: () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
};

const STATUS_CONFIG = {
  IN_PROGRESS: { label: "In Progress", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
  SUBMITTED: { label: "Submitted", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
  GRADED: { label: "Graded", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
  LATE: { label: "Late", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", dot: "bg-red-500" },
  AUTO_SUBMITTED: { label: "Auto-Submitted", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800", dot: "bg-violet-500" }
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, trend, color }) => {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    red: "bg-red-500/10 text-red-600 dark:text-red-400"
  };

  return (
    <div className="bg-card border border-border-custom rounded-2xl p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
          <Icon />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend > 0 ? <Icons.TrendingUp /> : <Icons.TrendingDown />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
        {subtext && <p className="text-xs text-muted-foreground/70 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

// Circular mini progress
const MiniProgress = ({ value, size = 36 }) => {
  const radius = (size - 4) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - ((value || 0) / 100) * circumference;
  
  const getColor = (v) => {
    if (v >= 80) return "#10b981";
    if (v >= 60) return "#4f46e5";
    if (v >= 40) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-muted" style={{ opacity: 0.2 }} />
        <circle cx={size/2} cy={size/2} r={radius} stroke={getColor(value || 0)} strokeWidth="3" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-[9px] font-bold text-foreground">{Math.round(value || 0)}</span>
    </div>
  );
};

// Student Avatar with fallback
const Avatar = ({ name, image, size = 40 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const bgColors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
  const colorIndex = name?.length % bgColors.length || 0;

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden ${!image ? bgColors[colorIndex] : ''}`}
      style={{ width: size, height: size }}
    >
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};

// Skeleton loader
const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border-custom">
        <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-muted rounded-lg animate-pulse" />
      </div>
    ))}
  </div>
);

export default function AssignmentSubmissionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });

  useEffect(() => {
    if (id) fetchSubmissions();
  }, [id]);

  const fetchSubmissions = async () => {
    try {
      const data = await getAssignmentSubmissions(id);
      setSubmissions(data.submissions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = !searchQuery || 
      sub.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.student?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.key === 'student') {
      return (a.student?.fullName || '').localeCompare(b.student?.fullName || '') * direction;
    }
    if (sortConfig.key === 'percentage') {
      return ((a.percentage || 0) - (b.percentage || 0)) * direction;
    }
    if (sortConfig.key === 'submittedAt') {
      return (new Date(a.submittedAt || 0) - new Date(b.submittedAt || 0)) * direction;
    }
    return 0;
  });

  // Analytics
  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter(s => s.status === 'GRADED').length;
  const pendingCount = submissions.filter(s => ['SUBMITTED', 'LATE', 'AUTO_SUBMITTED'].includes(s.status)).length;
  const inProgressCount = submissions.filter(s => s.status === 'IN_PROGRESS').length;
  const avgPercentage = totalSubmissions > 0 
    ? Math.round(submissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / totalSubmissions) 
    : 0;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <Icons.ArrowUpDown />;
    return sortConfig.direction === 'desc' ? <Icons.ArrowDown /> : <Icons.ArrowUp />;
  };

  return (
    <DashboardLayout role="TEACHER">
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>Assignments</span>
                <span>/</span>
                <span className="text-foreground font-medium">Submissions</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Assignment Submissions
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and review student submissions
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border-custom rounded-xl px-4 py-2">
              <Icons.FileText />
              <span className="font-medium text-foreground">{totalSubmissions}</span>
              <span>total students</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={Icons.Users} 
              label="Total Students" 
              value={totalSubmissions}
              color="blue"
            />
            <StatCard 
              icon={Icons.Award} 
              label="Graded" 
              value={gradedCount}
              subtext={`${Math.round((gradedCount / totalSubmissions) * 100) || 0}% completion`}
              color="emerald"
            />
            <StatCard 
              icon={Icons.Clock} 
              label="Pending Review" 
              value={pendingCount}
              color="amber"
            />
            <StatCard 
              icon={Icons.BarChart3} 
              label="Class Average" 
              value={`${avgPercentage}%`}
              trend={avgPercentage > 60 ? 5 : -3}
              color="violet"
            />
          </div>

          {/* Filters & Search */}
          <div className="bg-card border border-border-custom rounded-2xl p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icons.Search />
                </div>
                <input
                  type="text"
                  placeholder="Search by student name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border-custom rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                <div className="flex items-center gap-1.5 text-muted-foreground mr-2">
                  <Icons.Filter />
                  <span className="text-sm font-medium whitespace-nowrap">Filter:</span>
                </div>
                {['ALL', 'SUBMITTED', 'GRADED', 'IN_PROGRESS', 'LATE'].map((status) => (
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
                        ({submissions.filter(s => s.status === status).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="bg-card border border-border-custom rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-6">
                <TableSkeleton />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                  <Icons.Inbox />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {submissions.length === 0 ? "No Submissions Yet" : "No Results Found"}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {submissions.length === 0 
                    ? "Students haven't submitted their assignments yet. Check back later."
                    : "Try adjusting your search or filter criteria to find what you're looking for."
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-custom bg-muted/50">
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <button onClick={() => handleSort('student')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                          Student <SortIcon column="student" />
                        </button>
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <button onClick={() => handleSort('percentage')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                          Score <SortIcon column="percentage" />
                        </button>
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Answers
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <button onClick={() => handleSort('submittedAt')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                          Submitted <SortIcon column="submittedAt" />
                        </button>
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Feedback
                      </th>
                      <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {filteredSubmissions.map((submission, index) => {
                      const status = STATUS_CONFIG[submission.status] || STATUS_CONFIG.SUBMITTED;
                      const isGraded = submission.status === 'GRADED';
                      
                      return (
                        <tr 
                          key={submission._id} 
                          className="group hover:bg-muted/30 transition-colors"
                        >
                          {/* Student */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar 
                                name={submission.student?.fullName} 
                                image={submission.student?.profileImage}
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {submission.student?.fullName || 'Unknown Student'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {submission.student?.email || 'No email'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} border ${status.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>
                          </td>

                          {/* Score */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {isGraded ? (
                                <>
                                  <MiniProgress value={submission.percentage} />
                                  <div>
                                    <p className="text-sm font-bold text-foreground">
                                      {submission.obtainedMarks}
                                      <span className="text-muted-foreground font-normal text-xs"> pts</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {Math.round(submission.percentage || 0)}%
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">—</span>
                              )}
                            </div>
                          </td>

                          {/* Answer Count */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-foreground">
                                {submission.answerCount || 0}
                              </span>
                              <span className="text-xs text-muted-foreground">answers</span>
                            </div>
                          </td>

                          {/* Submitted At */}
                          <td className="px-6 py-4">
                            {submission.submittedAt ? (
                              <div className="text-sm text-foreground">
                                {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">Not submitted</span>
                            )}
                          </td>

                          {/* Feedback */}
                          <td className="px-6 py-4">
                            {submission.feedback ? (
                              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                <Icons.MessageSquare />
                                <span className="text-xs font-medium">Provided</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => router.push(`/teacher/submissions/${submission._id}`)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                              >
                                <Icons.Eye />
                                View
                              </button>
                              {submission.status !== 'GRADED' && (
                                <button
                                  onClick={() => router.push(`/teacher/submissions/${submission._id}/grade`)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                                >
                                  <Icons.Award />
                                  Grade
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {!loading && filteredSubmissions.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
              <span>
                Showing <span className="font-medium text-foreground">{filteredSubmissions.length}</span> of {submissions.length} submissions
              </span>
              {statusFilter !== 'ALL' && (
                <button 
                  onClick={() => setStatusFilter('ALL')}
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
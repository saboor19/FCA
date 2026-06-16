"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSingleSubmission } from "@/services/teacher/assignmentService";

// Icons
const Icons = {
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  MessageSquare: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Award: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  Paperclip: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Hash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Edit3: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Inbox: () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
};

const STATUS_CONFIG = {
  IN_PROGRESS: { label: "In Progress", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800", dot: "bg-amber-500" },
  SUBMITTED: { label: "Submitted", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", dot: "bg-blue-500" },
  GRADED: { label: "Graded", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", dot: "bg-emerald-500" },
  LATE: { label: "Late", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", dot: "bg-red-500" },
  AUTO_SUBMITTED: { label: "Auto-Submitted", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800", dot: "bg-violet-500" }
};

// Circular progress
const CircularProgress = ({ value, max, size = 100 }) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  const radius = (size - 8) / 2;
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
        <circle cx={size/2} cy={size/2} r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted" style={{ opacity: 0.15 }} />
        <circle cx={size/2} cy={size/2} r={radius} stroke={getColor(percentage)} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">/ {max}</span>
      </div>
    </div>
  );
};

// Avatar
const Avatar = ({ name, size = 48 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const bgColors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];
  const colorIndex = name?.length % bgColors.length || 0;

  return (
    <div className={`rounded-full ${bgColors[colorIndex]} flex items-center justify-center text-white font-bold shrink-0`} style={{ width: size, height: size, fontSize: size > 40 ? '1.1rem' : '0.875rem' }}>
      {initials}
    </div>
  );
};

// Question type badge
const QuestionTypeBadge = ({ type }) => {
  const config = {
    MCQ: { label: "Multiple Choice", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" },
    TEXT: { label: "Text Response", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" },
    FILE: { label: "File Upload", color: "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400" }
  };
  const conf = config[type] || config.TEXT;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${conf.color}`}>
      {conf.label}
    </span>
  );
};

// Stat card
const StatCard = ({ icon: Icon, label, value, color = "primary" }) => {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  };

  return (
    <div className="bg-card border border-border-custom rounded-2xl p-4">
      <div className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center mb-3`}>
        <Icon />
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
};

export default function TeacherSubmissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAnswers, setExpandedAnswers] = useState(new Set());

  useEffect(() => {
    if (id) fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const data = await getSingleSubmission(id);
      setSubmission(data.submission);
      if (data.submission?.answers) {
        setExpandedAnswers(new Set(data.submission.answers.map((_, i) => i)));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (index) => {
    setExpandedAnswers(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading submission...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!submission) {
    return (
      <DashboardLayout role="TEACHER">
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-4">
              <Icons.Inbox />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Submission Not Found</h2>
            <p className="text-muted-foreground mb-6">The submission you're looking for doesn't exist or you don't have access.</p>
            <button 
              onClick={() => router.push('/teacher/assignments')}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const assignment = submission.assignmentId;
  const student = submission.studentId;
  const status = STATUS_CONFIG[submission.status] || STATUS_CONFIG.SUBMITTED;
  const isGraded = submission.status === "GRADED";
  const totalMarks = assignment?.totalMarks || 0;
  const obtainedMarks = submission.obtainedMarks || 0;
  const percentage = submission.percentage || 0;

  const questionMap = Object.fromEntries(
    assignment?.questions?.map((q) => [q._id.toString(), q]) || []
  );

  const answeredCount = submission.answers?.filter(a => a.answerText || a.selectedOption).length || 0;
  const totalQuestions = submission.answers?.length || 0;

  return (
    <DashboardLayout role="TEACHER">
      <div className="min-h-screen bg-background">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border-custom">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center gap-3 mb-3">
              <button 
                onClick={() => router.push('/teacher/assignments')}
                className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
              >
                <Icons.ArrowLeft />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-0.5">
                  <span>Assignments</span>
                  <span>/</span>
                  <span className="truncate">{assignment?.title || "Untitled"}</span>
                  <span>/</span>
                  <span className="text-foreground font-medium">View Submission</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-11">
              <h1 className="text-xl font-bold text-foreground truncate">
                {assignment?.title || "Untitled Assignment"}
              </h1>
              <div className="flex items-center gap-3">
                {isGraded ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
                    <Icons.CheckCircle />
                    Graded
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 text-sm font-semibold border border-amber-200 dark:border-amber-800">
                    <Icons.Clock />
                    Pending Review
                  </div>
                )}
                
                {/* Grade Now Button */}
                <Link
                  href={`/teacher/submission/${submission._id}/grade`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                  <Icons.Edit3 />
                  {isGraded ? "Edit Grade" : "Grade Now"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Student Card */}
            <div className="bg-card border border-border-custom rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Student</h3>
              <div className="flex items-center gap-3">
                <Avatar name={student?.userId?.fullName} size={56} />
                <div className="min-w-0">
                  <p className="font-bold text-foreground truncate">{student?.userId?.fullName || "Unknown Student"}</p>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                    <Icons.Mail />
                    <span className="truncate">{student?.userId?.email || "No email"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Card - Only show if graded */}
            {isGraded && (
              <div className="bg-card border border-border-custom rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Score</h3>
                <div className="flex items-center justify-center py-2">
                  <CircularProgress value={obtainedMarks} max={totalMarks} size={120} />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{obtainedMarks}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Awarded</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/50">
                    <p className="text-2xl font-bold text-muted-foreground">{totalMarks}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Total</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border-custom">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Percentage</span>
                    <span className={`font-bold ${percentage >= 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Icons.FileText} label="Questions" value={`${answeredCount}/${totalQuestions}`} color="blue" />
              <StatCard icon={Icons.Award} label="Status" value={status.label} color={isGraded ? "emerald" : "amber"} />
            </div>

            {/* Submission Timeline */}
            <div className="bg-card border border-border-custom rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Timeline</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Started</p>
                    <p className="text-xs text-muted-foreground">
                      {submission.startedAt 
                        ? new Date(submission.startedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : 'Not recorded'
                      }
                    </p>
                  </div>
                </div>
                
                {submission.submittedAt && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Submitted</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}

                {submission.gradedAt && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Graded</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(submission.gradedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )}

                {submission.isLateSubmission && (
                  <div className="flex gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50">
                    <Icons.AlertTriangle />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">Late Submission</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Overall Feedback - Only if graded and has feedback */}
            {isGraded && submission.feedback && (
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-5">
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Icons.MessageSquare />
                  Overall Feedback
                </h3>
                <div className="bg-card/50 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {submission.feedback}
                </div>
              </div>
            )}

            {/* Meta Info */}
            <div className="bg-card border border-border-custom rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submission ID</span>
                  <span className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded">
                    {submission._id?.toString().slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attempt</span>
                  <span className="text-foreground font-medium">#{submission.attemptNumber || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plagiarism</span>
                  <span className={`font-medium ${(submission.plagiarismScore || 0) > 30 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {submission.plagiarismScore || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Answers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Icons.FileText />
                Responses
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setExpandedAnswers(new Set(submission.answers.map((_, i) => i)))}
                  className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Expand All
                </button>
                <span className="text-muted-foreground">|</span>
                <button 
                  onClick={() => setExpandedAnswers(new Set())}
                  className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {submission.answers?.map((answer, index) => {
              const question = questionMap[answer.questionId];
              const isExpanded = expandedAnswers.has(index);
              const hasRemark = answer.teacherRemark && answer.teacherRemark.trim().length > 0;
              const hasFiles = answer.uploadedFiles && answer.uploadedFiles.length > 0;
              const maxMarks = question?.marks || 0;

              return (
                <div 
                  key={index}
                  className={`bg-card border rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-border-custom hover:border-primary/20'}`}
                >
                  {/* Question Header */}
                  <button
                    onClick={() => toggleAnswer(index)}
                    className="w-full flex items-start gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm leading-relaxed">
                            {question?.question || "Question not found"}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <QuestionTypeBadge type={question?.type} />
                            {maxMarks > 0 && (
                              <span className="text-xs text-muted-foreground">
                                {maxMarks} marks
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Marks badge if graded */}
                          {isGraded && (
                            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              (answer.marksAwarded || 0) > 0 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" 
                                : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                            }`}>
                              {answer.marksAwarded || 0}/{maxMarks}
                            </div>
                          )}
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          >
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-5 pb-5 pt-0 border-t border-border-custom">
                      
                      {/* Student Answer */}
                      <div className="mt-4">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Icons.FileText size={14} />
                          Student Response
                        </label>
                        <div className="bg-muted/50 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed border border-border-custom">
                          {answer.answerText || answer.selectedOption || (
                            <span className="text-muted-foreground italic">No answer provided</span>
                          )}
                        </div>
                      </div>

                      {/* Attachments */}
                      {hasFiles && (
                        <div className="mt-4">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Icons.Paperclip size={14} />
                            Attachments ({answer.uploadedFiles.length})
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {answer.uploadedFiles.map((file, fIndex) => (
                              <div 
                                key={fIndex}
                                className="flex items-center gap-3 p-3 rounded-xl border border-border-custom bg-muted/30 hover:bg-muted/50 transition-colors"
                              >
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                  <Icons.Paperclip />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
                                  <p className="text-xs text-muted-foreground">{file.contentType}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Teacher Remark - Only show if graded and has remark */}
                      {hasRemark && (
                        <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Icons.MessageSquare />
                            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                              Teacher Feedback
                            </span>
                          </div>
                          <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap leading-relaxed">
                            {answer.teacherRemark}
                          </p>
                        </div>
                      )}

                      {/* Marks Awarded - Only show if graded */}
                      {isGraded && (
                        <div className="mt-4 pt-4 border-t border-border-custom">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Marks Awarded
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${maxMarks > 0 ? ((answer.marksAwarded || 0) / maxMarks) * 100 : 0}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-foreground">
                                {answer.marksAwarded || 0} <span className="text-muted-foreground font-normal">/ {maxMarks}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {submission.answers?.length === 0 && (
              <div className="text-center py-12 bg-card border border-border-custom rounded-2xl">
                <Icons.Inbox />
                <p className="mt-2 text-muted-foreground">No answers recorded for this submission.</p>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="sticky bottom-6">
              <Link
                href={`/teacher/submissions/${submission._id}/grade`}
                className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
              >
                <Icons.Edit3 />
                {isGraded ? "Edit Grade" : "Grade This Submission"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
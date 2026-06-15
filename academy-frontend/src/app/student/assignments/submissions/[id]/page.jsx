"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getStudentSubmission } from "@/services/student/assignmentService";

// Icons (using lucide-react style SVG components for zero-dependency)
const Icons = {
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>,
  Award: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  User: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Shield: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  MessageSquare: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Paperclip: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  RotateCcw: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  Hash: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
};

// Status configuration with colors and icons
const STATUS_CONFIG = {
  IN_PROGRESS: { 
    label: "In Progress", 
    color: "text-amber-600 dark:text-amber-400", 
    bg: "bg-amber-50 dark:bg-amber-950/30", 
    border: "border-amber-200 dark:border-amber-800",
    icon: Icons.Clock,
    pulse: true 
  },
  SUBMITTED: { 
    label: "Submitted", 
    color: "text-blue-600 dark:text-blue-400", 
    bg: "bg-blue-50 dark:bg-blue-950/30", 
    border: "border-blue-200 dark:border-blue-800",
    icon: Icons.CheckCircle,
    pulse: false 
  },
  LATE: { 
    label: "Late Submission", 
    color: "text-red-600 dark:text-red-400", 
    bg: "bg-red-50 dark:bg-red-950/30", 
    border: "border-red-200 dark:border-red-800",
    icon: Icons.AlertTriangle,
    pulse: true 
  },
  GRADED: { 
    label: "Graded", 
    color: "text-emerald-600 dark:text-emerald-400", 
    bg: "bg-emerald-50 dark:bg-emerald-950/30", 
    border: "border-emerald-200 dark:border-emerald-800",
    icon: Icons.Award,
    pulse: false 
  },
  AUTO_SUBMITTED: { 
    label: "Auto-Submitted", 
    color: "text-violet-600 dark:text-violet-400", 
    bg: "bg-violet-50 dark:bg-violet-950/30", 
    border: "border-violet-200 dark:border-violet-800",
    icon: Icons.RotateCcw,
    pulse: false 
  }
};

// Circular progress component
const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "var(--primary)" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (p) => {
    if (p >= 80) return "#10b981"; // emerald
    if (p >= 60) return "#4f46e5"; // indigo
    if (p >= 40) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const progressColor = getColor(percentage);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted dark:text-muted"
          style={{ opacity: 0.2 }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground" style={{ color: progressColor }}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// Plagiarism badge
const PlagiarismBadge = ({ score }) => {
  let config = { label: "Clean", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" };
  if (score > 30) config = { label: "Review Needed", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" };
  if (score > 60) config = { label: "High Risk", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" };
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.color}`}>
      <Icons.Shield />
      Plagiarism: {score}% — {config.label}
    </div>
  );
};

// Answer card component
const AnswerCard = ({ answer, index, isExpanded, onToggle }) => {
  const hasFiles = answer.uploadedFiles && answer.uploadedFiles.length > 0;
  const hasMarks = answer.marksAwarded !== undefined && answer.marksAwarded !== null;
  const hasRemark = answer.teacherRemark && answer.teacherRemark.trim().length > 0;

  return (
    <div className="group relative bg-card border border-border-custom rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
      {/* Header */}
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm">
            {index + 1}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Question {index + 1}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {answer.answerText ? "Text Response" : answer.selectedOption ? "Multiple Choice" : "No Response"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasMarks && (
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
              answer.marksAwarded > 0 
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" 
                : "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
            }`}>
              {answer.marksAwarded} pts
            </span>
          )}
          {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
        </div>
      </button>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="p-5 pt-0 border-t border-border-custom">
          {/* Answer Content */}
          <div className="mt-4">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Your Answer
            </label>
            <div className="bg-muted/50 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {answer.answerText || answer.selectedOption || (
                <span className="text-muted-foreground italic">No answer provided</span>
              )}
            </div>
          </div>

          {/* Teacher Remark */}
          {hasRemark && (
            <div className="mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icons.MessageSquare />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Teacher Feedback
                </span>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300 whitespace-pre-wrap">
                {answer.teacherRemark}
              </p>
            </div>
          )}

          {/* Uploaded Files */}
          {hasFiles && (
            <div className="mt-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Attachments
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {answer.uploadedFiles.map((file, fIndex) => (
                  <div 
                    key={fIndex}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border-custom bg-muted/30 hover:bg-muted/50 transition-colors group/file cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icons.Paperclip />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
                      <p className="text-xs text-muted-foreground">{file.contentType}</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover/file:opacity-100">
                      <Icons.Download />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat card component
const StatCard = ({ icon: Icon, label, value, subtext, color = "primary" }) => {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400"
  };

  return (
    <div className="bg-card border border-border-custom rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
          <Icon />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
        {subtext && <p className="text-xs text-muted-foreground/70 mt-1">{subtext}</p>}
      </div>
    </div>
  );
};

// Skeleton loader
const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-8 bg-muted rounded-lg w-3/4" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-muted rounded-2xl" />
      ))}
    </div>
    <div className="h-96 bg-muted rounded-2xl" />
  </div>
);

export default function StudentSubmissionViewPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAnswers, setExpandedAnswers] = useState(new Set([0]));

  useEffect(() => {
    if (id) fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const data = await getStudentSubmission(id);
      setSubmission(data.submission);
      // Expand first answer by default
      if (data.submission?.answers?.length > 0) {
        setExpandedAnswers(new Set([0]));
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
      <DashboardLayout role="STUDENT">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <Skeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!submission) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Icons.FileText />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Submission Not Found</h2>
            <p className="text-muted-foreground mb-6">The submission you're looking for doesn't exist or you don't have permission to view it.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statusConfig = STATUS_CONFIG[submission.status] || STATUS_CONFIG.SUBMITTED;
  const StatusIcon = statusConfig.icon;
  const totalQuestions = submission.answers?.length || 0;
  const answeredQuestions = submission.answers?.filter(a => a.answerText || a.selectedOption).length || 0;
  const hasFeedback = submission.feedback && submission.feedback.trim().length > 0;
  const hasGradedBy = submission.gradedBy;
  const isGraded = submission.status === "GRADED";

  return (
    <DashboardLayout role="STUDENT">
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Breadcrumb & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <span>Assignments</span>
                <span>/</span>
                <span className="text-foreground font-medium">Submission Details</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {submission.assignmentId?.title || "Untitled Assignment"}
              </h1>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} font-semibold text-sm`}>
              <StatusIcon />
              {statusConfig.label}
              {statusConfig.pulse && (
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.color.replace('text-', 'bg-')}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${statusConfig.color.replace('text-', 'bg-')}`}></span>
                </span>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={Icons.Award} 
              label="Score" 
              value={`${submission.obtainedMarks || 0} pts`}
              subtext={isGraded ? "Final grade" : "Pending grading"}
              color={isGraded ? "emerald" : "amber"}
            />
            <StatCard 
              icon={Icons.TrendingUp} 
              label="Percentage" 
              value={`${submission.percentage || 0}%`}
              subtext={submission.percentage >= 60 ? "Passing grade" : "Below passing"}
              color={submission.percentage >= 60 ? "emerald" : "amber"}
            />
            <StatCard 
              icon={Icons.Hash} 
              label="Attempt" 
              value={`#${submission.attemptNumber || 1}`}
              subtext="Submission attempt"
              color="blue"
            />
            <StatCard 
              icon={Icons.FileText} 
              label="Questions" 
              value={`${answeredQuestions}/${totalQuestions}`}
              subtext="Answered"
              color="violet"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Answers */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Overview (only show if graded) */}
              {isGraded && (
                <div className="bg-card border border-border-custom rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                  <CircularProgress percentage={Math.round(submission.percentage || 0)} />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-foreground mb-1">Performance Overview</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      You scored <span className="font-semibold text-foreground">{submission.obtainedMarks} points</span> out of the total possible marks.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <PlagiarismBadge score={submission.plagiarismScore || 0} />
                      {submission.isLateSubmission && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                          <Icons.AlertTriangle />
                          Late Submission
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Answers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Icons.FileText />
                    Your Responses
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {submission.answers?.map((answer, index) => (
                    <AnswerCard 
                      key={index} 
                      answer={answer} 
                      index={index}
                      isExpanded={expandedAnswers.has(index)}
                      onToggle={() => toggleAnswer(index)}
                    />
                  ))}
                </div>

                {totalQuestions === 0 && (
                  <div className="text-center py-12 bg-card border border-border-custom rounded-2xl">
                    <Icons.FileText />
                    <p className="mt-2 text-muted-foreground">No answers recorded for this submission.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Metadata & Feedback */}
            <div className="space-y-6">
              {/* Submission Timeline */}
              <div className="bg-card border border-border-custom rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Icons.Clock />
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Started</p>
                      <p className="text-xs text-muted-foreground">
                        {submission.startedAt ? new Date(submission.startedAt).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        }) : 'Not recorded'}
                      </p>
                    </div>
                  </div>
                  {submission.submittedAt && (
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
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
                          {new Date(submission.gradedAt).toLocaleString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Grader Info */}
              {hasGradedBy && (
                <div className="bg-card border border-border-custom rounded-2xl p-5">
                  <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
                    <Icons.User />
                    Graded By
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {submission.gradedBy?.name?.[0] || 'T'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {submission.gradedBy?.name || "Teacher"}
                      </p>
                      <p className="text-xs text-muted-foreground">Instructor</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Overall Feedback */}
              {hasFeedback && (
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-5">
                  <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
                    <Icons.Sparkles />
                    Overall Feedback
                  </h3>
                  <div className="bg-card/50 rounded-xl p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {submission.feedback}
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="bg-card border border-border-custom rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission ID</span>
                    <span className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded">
                      {submission._id?.toString().slice(-8).toUpperCase()}
                    </span>
                  </div>
                  {submission.batchId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Batch</span>
                      <span className="text-foreground">{submission.batchId?.name || 'N/A'}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Late</span>
                    <span className={submission.isLateSubmission ? "text-red-600 dark:text-red-400 font-medium" : "text-emerald-600 dark:text-emerald-400"}>
                      {submission.isLateSubmission ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
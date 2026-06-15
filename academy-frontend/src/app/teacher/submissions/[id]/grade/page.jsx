"use client";

import { useEffect, useState } from "react";
import { useParams,useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSingleSubmission, gradeSubmission } from "@/services/teacher/assignmentService";

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
  Save: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  RotateCcw: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  Paperclip: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Hash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>,
  Sparkles: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>,
  ChevronUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
};

const STATUS_CONFIG = {
  IN_PROGRESS: { label: "In Progress", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  SUBMITTED: { label: "Submitted", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  GRADED: { label: "Graded", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  LATE: { label: "Late", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
  AUTO_SUBMITTED: { label: "Auto-Submitted", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800" }
};

// Circular progress for score
const CircularProgress = ({ value, max, size = 80 }) => {
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
        <span className="text-lg font-bold text-foreground">{value}</span>
        <span className="text-[10px] text-muted-foreground">/ {max}</span>
      </div>
    </div>
  );
};

// Avatar component
const Avatar = ({ name, size = 48 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const bgColors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500'];
  const colorIndex = name?.length % bgColors.length || 0;

  return (
    <div className={`w-${size === 48 ? '12' : '10'} h-${size === 48 ? '12' : '10'} rounded-full ${bgColors[colorIndex]} flex items-center justify-center text-white font-bold text-sm shrink-0`} style={{ width: size, height: size }}>
      {initials}
    </div>
  );
};

// Question type badge
const QuestionTypeBadge = ({ type }) => {
  const config = {
    MCQ: { label: "Multiple Choice", color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400", icon: <Icons.Hash /> },
    TEXT: { label: "Text Response", color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400", icon: <Icons.FileText /> },
    FILE: { label: "File Upload", color: "bg-violet-50 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400", icon: <Icons.Paperclip /> }
  };
  const conf = config[type] || config.TEXT;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${conf.color}`}>
      {conf.icon}
      {conf.label}
    </span>
  );
};

export default function TeacherSubmissionPage() {
  const { id } = useParams();
  const router=useRouter();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [totalAwarded, setTotalAwarded] = useState(0);

  useEffect(() => {
    if (id) fetchSubmission();
  }, [id]);

  useEffect(() => {
    if (submission) {
      const total = submission.answers?.reduce((acc, ans) => acc + (Number(ans.marksAwarded) || 0), 0) || 0;
      setTotalAwarded(total);
    }
  }, [submission]);

  const fetchSubmission = async () => {
    try {
      const data = await getSingleSubmission(id);
      setSubmission(data.submission);
      setFeedback(data.submission.feedback || "");
      // Expand all by default
      if (data.submission?.answers) {
        setExpandedQuestions(new Set(data.submission.answers.map((_, i) => i)));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (index) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleMarksChange = (index, value) => {
    const updated = { ...submission };
    const numValue = value === '' ? '' : Math.max(0, Number(value));
    updated.answers[index].marksAwarded = numValue;
    setSubmission(updated);
    
    // Recalculate total
    const newTotal = updated.answers.reduce((acc, ans) => acc + (Number(ans.marksAwarded) || 0), 0);
    setTotalAwarded(newTotal);
  };

  const handleRemarkChange = (index, value) => {
    const updated = { ...submission };
    updated.answers[index].teacherRemark = value;
    setSubmission(updated);
  };

  const handleGrade = async () => {
    setSaving(true);
    try {
      await gradeSubmission(
        submission._id,
        {
          answers: submission.answers.map((answer) => ({
            questionId: answer.questionId,
            marksAwarded: answer.marksAwarded,
            teacherRemark: answer.teacherRemark
          })),
          feedback
        }
      );
      await fetchSubmission();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
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
              <Icons.AlertTriangle />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Submission Not Found</h2>
            <p className="text-muted-foreground">The submission you're looking for doesn't exist or you don't have access.</p>
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
  const currentPercentage = totalMarks > 0 ? Math.round((totalAwarded / totalMarks) * 100) : 0;

  const questionMap = Object.fromEntries(
    assignment?.questions?.map((q) => [q._id.toString(), q]) || []
  );

  return (
    <DashboardLayout role="TEACHER">
      <div className="min-h-screen bg-background">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-30 bg-card/80 backdrop-blur-xl border-b border-border-custom">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <button 
                onClick={() => window.history.back()}
                className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-foreground truncate">
                  {assignment?.title || "Untitled Assignment"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Grading Submission
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Live Score Preview */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-muted border border-border-custom">
                <CircularProgress value={totalAwarded} max={totalMarks} size={48} />
                <div>
                  <p className="text-xs text-muted-foreground">Current Score</p>
                  <p className="text-sm font-bold text-foreground">{totalAwarded} / {totalMarks}</p>
                </div>
              </div>
              
              <button
                onClick={handleGrade}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icons.Save />
                    {isGraded ? "Update Grade" : "Save Grade"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Student Info & Meta */}
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

            {/* Submission Status Card */}
            <div className="bg-card border border-border-custom rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Submission Status</h3>
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.color} border ${status.border}`}>
                  {submission.status === "GRADED" ? <Icons.CheckCircle /> : <Icons.AlertTriangle />}
                  {status.label}
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Icons.Calendar />
                      Submitted
                    </span>
                    <span className="font-medium text-foreground">
                      {submission.submittedAt 
                        ? new Date(submission.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : "Not yet"
                      }
                    </span>
                  </div>
                  
                  {submission.gradedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Icons.CheckCircle />
                        Graded On
                      </span>
                      <span className="font-medium text-foreground">
                        {new Date(submission.gradedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}

                  {submission.isLateSubmission && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm">
                      <Icons.AlertTriangle />
                      <span className="font-medium">Late Submission</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Score Summary */}
            <div className="bg-card border border-border-custom rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Score Summary</h3>
              <div className="flex items-center justify-center py-4">
                <CircularProgress value={isGraded ? submission.obtainedMarks : totalAwarded} max={totalMarks} size={120} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold text-foreground">{totalAwarded}</p>
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
                  <span className={`font-bold ${currentPercentage >= 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {currentPercentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-card border border-border-custom rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icons.MessageSquare />
                Overall Feedback
              </h3>
              <textarea
                rows={6}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide overall feedback to the student about their performance..."
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">{feedback.length} characters</span>
                {isGraded && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <Icons.CheckCircle size={12} />
                    Previously saved
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Questions & Grading */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Icons.FileText />
                Responses ({submission.answers?.length || 0})
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setExpandedQuestions(new Set(submission.answers.map((_, i) => i)))}
                  className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Expand All
                </button>
                <span className="text-muted-foreground">|</span>
                <button 
                  onClick={() => setExpandedQuestions(new Set())}
                  className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {submission.answers?.map((answer, index) => {
              const question = questionMap[answer.questionId];
              const isExpanded = expandedQuestions.has(index);
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
                    onClick={() => toggleQuestion(index)}
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
                          <div className="flex items-center gap-2 mt-2">
                            <QuestionTypeBadge type={question?.type} />
                            <span className="text-xs text-muted-foreground">
                              {maxMarks} marks
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Quick score preview */}
                          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            (answer.marksAwarded || 0) > 0 
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {answer.marksAwarded || 0}/{maxMarks}
                          </div>
                          {isExpanded ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
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
                            Attachments
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

                      {/* Grading Section */}
                      <div className="mt-5 pt-4 border-t border-border-custom">
                        <div className="flex items-center gap-2 mb-4">
                          <Icons.Award />
                          <h4 className="font-semibold text-foreground text-sm">Grading</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Marks Input */}
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                              Marks Awarded <span className="text-muted-foreground/60">(out of {maxMarks})</span>
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                max={maxMarks}
                                value={answer.marksAwarded === '' ? '' : (answer.marksAwarded || 0)}
                                onChange={(e) => handleMarksChange(index, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-foreground font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                                / {maxMarks}
                              </span>
                            </div>
                            {/* Visual mark bar */}
                            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${maxMarks > 0 ? ((answer.marksAwarded || 0) / maxMarks) * 100 : 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Remark Input */}
                          <div>
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                              Teacher Remark
                            </label>
                            <textarea
                              rows={3}
                              value={answer.teacherRemark || ""}
                              onChange={(e) => handleRemarkChange(index, e.target.value)}
                              placeholder="Add feedback for this specific answer..."
                              className="w-full px-4 py-3 rounded-xl bg-muted border border-border-custom text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {submission.answers?.length === 0 && (
              <div className="text-center py-12 bg-card border border-border-custom rounded-2xl">
                <Icons.FileText />
                <p className="mt-2 text-muted-foreground">No answers recorded for this submission.</p>
              </div>
            )}

            {/* Bottom Save Button */}
            <div className="sticky bottom-6 bg-card/90 backdrop-blur-xl border border-border-custom rounded-2xl p-4 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CircularProgress value={totalAwarded} max={totalMarks} size={48} />
                <div>
                  <p className="text-sm font-bold text-foreground">{totalAwarded} / {totalMarks} marks</p>
                  <p className="text-xs text-muted-foreground">{currentPercentage}% scored</p>
                </div>
              </div>
              <button
                onClick={handleGrade}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <><button onClick={() => router.push(`/teacher/submissions/${submission._id}`)}><Icons.Save />
                    {isGraded ? "Update Grade" : "Save Grade"}</button>
                    
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
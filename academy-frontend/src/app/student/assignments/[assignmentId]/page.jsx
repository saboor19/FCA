"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import QuestionRenderer from "@/components/students/assignments/questions/QuestionRenderer";
import AssignmentTimer from "@/components/students/assignments/AssignmentTimer";
import AssignmentActions from "@/components/students/assignments/AssignmentActions";

import {
  getStudentAssignmentById,
  startAssignmentAttempt,
  saveAssignmentAnswers,
  submitAssignment
} from "@/services/student/assignmentService";

export default function StudentAssignmentDetailsPage() {
  const { assignmentId } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState([]);
  
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // --- CRITICAL FIX: Ref to hold the freshest answers for the auto-save interval ---
  const latestAnswers = useRef(answers);

  useEffect(() => {
    latestAnswers.current = answers;
  }, [answers]);

  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    }
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      const data = await getStudentAssignmentById(assignmentId);
      setAssignment(data.assignment);
      setSubmission(data.submission);

      // --- RESUME ATTEMPT ---
      if (data.submission && data.submission.status === "IN_PROGRESS") {
        setStarted(true);
        if (data.submission.answers) {
          setAnswers(data.submission.answers);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssignment = async () => {
    try {
      setStarting(true);
      const data = await startAssignmentAttempt(assignmentId);
      setSubmission(data.submission);
      setStarted(true);
      
      // Auto-scroll to the first question for a smoother mobile experience
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setStarting(false);
    }
  };

  const handleSaveAnswers = async () => {
    try {
      if (!submission?._id) return;
      setSaving(true);
      // Use the ref here to ensure we grab the latest keystrokes
      await saveAssignmentAnswers(submission._id, { answers: latestAnswers.current });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitAssignment = async () => {
    try {
      if (!submission?._id) return;
      const confirmSubmit = window.confirm(
        "Are you sure you want to submit this assignment? You cannot change your answers after submitting."
      );
      if (!confirmSubmit) return;

      setSubmitting(true);
      await handleSaveAnswers();
      await submitAssignment(submission._id);
      
      alert("Assignment submitted successfully!");
      fetchAssignment();
      setStarted(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    try {
      await handleSaveAnswers();
      await submitAssignment(submission._id);
      alert("Time is up. Your assignment has been auto-submitted.");
      fetchAssignment();
      setStarted(false);
    } catch (error) {
      console.error(error);
    }
  };

  // --- CRITICAL FIX: Auto-Save Effect ---
  // The interval now only resets if the assignment itself changes, not on every keystroke.
  useEffect(() => {
    if (!started || !submission?._id) return;

    const interval = setInterval(() => {
      if (latestAnswers.current.length > 0) {
        // Silently save in the background without blocking UI state
        saveAssignmentAnswers(submission._id, { answers: latestAnswers.current })
          .catch((err) => console.error("Auto-save failed:", err));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [started, submission?._id]);

  // ---------------- LOADING STATE ----------------
  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] p-4 md:p-6 flex flex-col gap-6">
          <div className="h-40 animate-pulse rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800" />
          <div className="h-64 animate-pulse rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800" />
        </div>
      </DashboardLayout>
    );
  }

  // ---------------- NOT FOUND ----------------
  if (!assignment) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-10 text-center">
          <div className="rounded-full bg-slate-100 dark:bg-slate-900 p-6 mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-slate-900 dark:text-white">Assignment not found</h2>
          <p className="mt-2 text-sm text-slate-500">This assignment may have been removed or is unavailable.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="STUDENT">
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] p-4 md:p-6 pb-32">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* HEADER CARD */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111111] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {assignment.title}
                </h1>
                
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Due: {new Date(assignment.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Total Marks: {assignment.totalMarks}
                  </div>
                </div>
              </div>
            </div>

            {assignment.description && (
              <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <p className="text-sm md:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {assignment.description}
                </p>
              </div>
            )}
          </div>

          {/* START STATE */}
          {!started && (
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111111] p-8 text-center shadow-sm">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-slate-800 dark:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
                Ready to begin?
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Once you start the assignment, the questions will be revealed and your timer (if applicable) will begin counting down.
              </p>
              
              <button
                onClick={handleStartAssignment}
                disabled={starting}
                className="mt-8 w-full md:w-auto rounded-full bg-slate-900 dark:bg-yellow-500 px-8 py-3.5 text-sm font-semibold text-white dark:text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-md"
              >
                {starting ? "Initializing..." : "Start Assignment"}
              </button>
            </div>
          )}

          {/* ACTIVE ASSIGNMENT STATE */}
          {started && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* TOP BAR: Timer & Progress */}
              <div className="sticky top-4 z-40 flex items-center justify-between gap-4">
                {assignment.timeLimit ? (
                  <AssignmentTimer 
                    startedAt={submission?.startedAt} 
                    timeLimit={assignment.timeLimit} 
                    onTimeUp={handleAutoSubmit} 
                  />
                ) : <div />} {/* Empty div for flex spacing if no timer */}

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                  Answered: <span className="text-slate-900 dark:text-white">{answers.length}</span> / {assignment.questions.length}
                </div>
              </div>

              {/* QUESTIONS LIST */}
              <div className="space-y-6">
                {assignment.questions.map((question, index) => (
                  <QuestionRenderer
                    key={question._id}
                    question={question}
                    index={index}
                    answers={answers}
                    setAnswers={setAnswers}
                  />
                ))}
              </div>

              {/* ACTION BAR */}
              <AssignmentActions
                saving={saving}
                submitting={submitting}
                onSave={handleSaveAnswers}
                onSubmit={handleSubmitAssignment}
              />
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
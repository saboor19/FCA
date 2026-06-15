"use client";

import { useState, useCallback } from "react";
import McqQuestionForm from "./McqQuestionForm";
import TextQuestionForm from "./TextQuestionForm";
import FileQuestionForm from "./FileQuestionForm";

/* ─── Inline Icons ─── */
const Icons = {
  Plus: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Trash2: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  GripVertical: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
    </svg>
  ),
  ChevronUp: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  ),
  ChevronDown: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Copy: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  HelpCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  FileText: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  ListChecks: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Upload: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  ArrowUp: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  ArrowDown: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Sparkles: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
  ),
};

/* ─── Question Type Config ─── */
const QUESTION_TYPES = {
  MCQ: {
    label: "Multiple Choice",
    description: "Students select one correct answer from options",
    icon: Icons.ListChecks,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    badge: "bg-blue-500",
  },
  TEXT: {
    label: "Text Answer",
    description: "Students type their response in a text field",
    icon: Icons.FileText,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    badge: "bg-emerald-500",
  },
  FILE: {
    label: "File Upload",
    description: "Students upload a file as their answer",
    icon: Icons.Upload,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
    badge: "bg-purple-500",
  },
};

/* ─── Empty State ─── */
function EmptyQuestions({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-custom bg-card px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Icons.HelpCircle className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">No Questions Yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Start building your assignment by adding questions. You can mix MCQ, text, and file upload types.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {Object.entries(QUESTION_TYPES).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onAdd(type)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all hover:shadow-md ${config.color}`}
            >
              <Icon className="h-4 w-4" />
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Question Card ─── */
function QuestionCard({ question, index, total, onUpdate, onRemove, onMove, onDuplicate }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const config = QUESTION_TYPES[question.type] || QUESTION_TYPES.MCQ;
  const Icon = config.icon;

  const handleUpdate = useCallback(
    (updated) => onUpdate(index, updated),
    [index, onUpdate]
  );

  return (
    <div
      className="group rounded-2xl border border-border-custom bg-card shadow-sm transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-primary/30"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* ── Card Header ── */}
      <div className="flex items-center gap-3 px-5 py-4">
        {/* Drag Handle */}
        <button
          type="button"
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted active:cursor-grabbing"
          aria-label={`Drag question ${index + 1}`}
          title="Drag to reorder"
        >
          <Icons.GripVertical className="h-4 w-4" />
        </button>

        {/* Question Number & Type */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {index + 1}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className={`inline-flex h-2 w-2 rounded-full ${config.badge}`} />
          <span className="text-sm font-medium text-foreground truncate">
            {question.question ? question.question.slice(0, 60) + (question.question.length > 60 ? "..." : "") : `Untitled ${config.label}`}
          </span>
        </div>

        {/* Marks Badge */}
        <span className="hidden shrink-0 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground sm:inline-flex">
          {question.marks || 0} marks
        </span>

        {/* Required Badge */}
        {question.required && (
          <span className="hidden shrink-0 rounded-lg bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive sm:inline-flex">
            Required
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
            aria-label="Move up"
            title="Move up"
          >
            <Icons.ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
            aria-label="Move down"
            title="Move down"
          >
            <Icons.ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(index)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label="Duplicate question"
            title="Duplicate"
          >
            <Icons.Copy className="h-3.5 w-3.5" />
          </button>
          <div className="mx-1 h-4 w-px bg-border-custom" />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove question"
            title="Remove"
          >
            <Icons.Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Expand/Collapse */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
          aria-label={isExpanded ? "Collapse question" : "Expand question"}
        >
          {isExpanded ? <Icons.ChevronUp className="h-4 w-4" /> : <Icons.ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* ── Card Body ── */}
      {isExpanded && (
        <div className="border-t border-border-custom px-5 pb-5 pt-4">
          {/* Type Badge */}
          <div className="mb-4 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.color}`}>
              <Icon className="h-3 w-3" />
              {config.label}
            </span>
            <span className="text-xs text-muted-foreground">{config.description}</span>
          </div>

          {/* Question Form */}
          {question.type === "MCQ" && (
            <McqQuestionForm question={question} updateQuestion={handleUpdate} />
          )}
          {question.type === "TEXT" && (
            <TextQuestionForm question={question} updateQuestion={handleUpdate} />
          )}
          {question.type === "FILE" && (
            <FileQuestionForm question={question} updateQuestion={handleUpdate} />
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Add Question FAB / Bar ─── */
function AddQuestionBar({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border-custom" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 active:scale-[0.98]"
        >
          <Icons.Plus className="h-4 w-4" />
          Add Question
        </button>
        <div className="h-px flex-1 bg-border-custom" />
      </div>

      {isOpen && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.entries(QUESTION_TYPES).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(type);
                  setIsOpen(false);
                }}
                className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all hover:shadow-lg ${config.color} hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.color.split(" ")[0]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{config.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{config.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN QUESTION BUILDER
   ═══════════════════════════════════════════ */
export default function QuestionBuilder({ questions = [], setQuestions })  {
  const [confirmDelete, setConfirmDelete] = useState(null);

  /* ─── Add Question ─── */
  const addQuestion = useCallback((type) => {
    const newQuestion = {
      question: "",
      type,
      marks: 1,
      required: true,
    };

    if (type === "MCQ") {
      newQuestion.options = ["", ""];
      newQuestion.correctAnswer = "";
    }
    if (type === "TEXT") {
      newQuestion.maxLength = 500;
      newQuestion.minLength = 0;
    }
    if (type === "FILE") {
      newQuestion.allowedTypes = [".pdf", ".doc", ".docx"];
      newQuestion.maxSize = 10;
    }

    setQuestions((prev) => [...prev, newQuestion]);
  }, [setQuestions]);

  /* ─── Update Question ─── */
  const updateQuestion = useCallback((index, updatedQuestion) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = updatedQuestion;
      return updated;
    });
  }, [setQuestions]);

  /* ─── Remove Question ─── */
  const removeQuestion = useCallback((index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
    setConfirmDelete(null);
  }, [setQuestions]);

  /* ─── Move Question ─── */
  const moveQuestion = useCallback((index, direction) => {
    setQuestions((prev) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
  }, [setQuestions]);

  /* ─── Duplicate Question ─── */
  const duplicateQuestion = useCallback((index) => {
    setQuestions((prev) => {
      const copy = { ...prev[index], question: `${prev[index].question} (Copy)` };
      const updated = [...prev];
      updated.splice(index + 1, 0, copy);
      return updated;
    });
  }, [setQuestions]);

  /* ─── Total Marks ─── */
  const totalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Header Stats ── */}
      {questions.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-custom bg-card p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icons.HelpCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {questions.length} question{questions.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="h-4 w-px bg-border-custom" />
            <div className="flex items-center gap-2">
              <Icons.Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{totalMarks} total marks</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              {questions.filter((q) => q.type === "MCQ").length} MCQ
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {questions.filter((q) => q.type === "TEXT").length} Text
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              {questions.filter((q) => q.type === "FILE").length} File
            </span>
          </div>
        </div>
      )}

      {/* ── Questions List ── */}
      {questions.length === 0 ? (
        <EmptyQuestions onAdd={addQuestion} />
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <QuestionCard
              key={`${question.type}-${index}`}
              question={question}
              index={index}
              total={questions.length}
              onUpdate={updateQuestion}
              onRemove={(i) => setConfirmDelete(i)}
              onMove={moveQuestion}
              onDuplicate={duplicateQuestion}
            />
          ))}
        </div>
      )}

      {/* ── Add Question Bar ── */}
      {questions.length > 0 && <AddQuestionBar onAdd={addQuestion} />}

      {/* ── Delete Confirmation Modal ── */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl border border-border-custom">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <Icons.AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">Delete Question?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently remove <strong className="text-foreground">Question {confirmDelete + 1}</strong>. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-border-custom px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => removeQuestion(confirmDelete)}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
              >
                <Icons.Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback } from "react";

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
  Circle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  CheckCircle2: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 16 10" />
    </svg>
  ),
  Hash: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
  Star: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  AlignLeft: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  ),
  Check: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  GripVertical: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
    </svg>
  ),
};

/* ─── Letter Labels ─── */
const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/* ─── Option Row Component ─── */
function OptionRow({ option, index, totalOptions, isCorrect, onChange, onRemove, onSetCorrect }) {
  const label = OPTION_LABELS[index] || String(index + 1);

  return (
    <div
      className={`group flex items-center gap-3 rounded-xl border p-3 transition-all duration-150 ${
        isCorrect
          ? "border-emerald-400 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/5"
          : "border-border-custom bg-card hover:border-primary/30"
      }`}
    >
      {/* Drag Handle */}
      <button
        type="button"
        className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted active:cursor-grabbing"
        aria-label={`Drag option ${label}`}
      >
        <Icons.GripVertical className="h-3 w-3" />
      </button>

      {/* Letter Badge */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
          isCorrect
            ? "bg-emerald-500 text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {label}
      </div>

      {/* Option Input */}
      <input
        type="text"
        value={option}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Option ${label}`}
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />

      {/* Correct Toggle */}
      <button
        type="button"
        onClick={() => onSetCorrect(option)}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
          isCorrect
            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        aria-label={isCorrect ? "Correct answer" : "Mark as correct"}
        title={isCorrect ? "Correct answer" : "Mark as correct"}
      >
        {isCorrect ? <Icons.Check className="h-4 w-4" /> : <Icons.Circle className="h-4 w-4" />}
      </button>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={totalOptions <= 2}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 disabled:opacity-0 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        aria-label={`Remove option ${label}`}
        title={totalOptions <= 2 ? "Minimum 2 options required" : "Remove option"}
      >
        <Icons.X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ─── Field Component ─── */
function Field({ label, icon: Icon, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ─── Toggle Component ─── */
function Toggle({ name, checked, onChange, label, description }) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-border-custom bg-card p-3 transition-all hover:border-primary/30 hover:bg-muted/20 focus-within:ring-2 focus-within:ring-primary/20">
      <div
        className="relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? "var(--primary)" : "var(--muted-foreground)" }}
      >
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only" />
        <span
          className="absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
        />
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
    </label>
  );
}

/* ═══════════════════════════════════════════
   MAIN MCQ QUESTION FORM
   ═══════════════════════════════════════════ */
export default function McqQuestionForm({ question, updateQuestion }) {
  const options = question.options || [];
  const hasCorrectAnswer = question.correctAnswer && options.includes(question.correctAnswer);
  const isValid = question.question?.trim() && options.filter((o) => o.trim()).length >= 2 && hasCorrectAnswer;

  /* ─── Handlers ─── */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      updateQuestion({ ...question, [name]: type === "checkbox" ? checked : value });
    },
    [question, updateQuestion]
  );

  const updateOption = useCallback(
    (index, value) => {
      const updated = [...options];
      updated[index] = value;
      // If this option was the correct answer, update correctAnswer too
      const wasCorrect = options[index] === question.correctAnswer;
      updateQuestion({
        ...question,
        options: updated,
        correctAnswer: wasCorrect ? value : question.correctAnswer,
      });
    },
    [question, options, updateQuestion]
  );

  const addOption = useCallback(() => {
    updateQuestion({ ...question, options: [...options, ""] });
  }, [question, options, updateQuestion]);

  const removeOption = useCallback(
    (index) => {
      if (options.length <= 2) return;
      const removedValue = options[index];
      const updated = options.filter((_, i) => i !== index);
      updateQuestion({
        ...question,
        options: updated,
        correctAnswer: removedValue === question.correctAnswer ? "" : question.correctAnswer,
      });
    },
    [question, options, updateQuestion]
  );

  const setCorrectAnswer = useCallback(
    (value) => {
      updateQuestion({ ...question, correctAnswer: value });
    },
    [question, updateQuestion]
  );

  return (
    <div className="space-y-6">
      {/* ── Validation Banner ── */}
      {!isValid && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/5">
          <Icons.AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <p className="font-medium">Incomplete question</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {!question.question?.trim() && <li>Add a question text</li>}
              {options.filter((o) => o.trim()).length < 2 && <li>Add at least 2 options with text</li>}
              {!hasCorrectAnswer && <li>Select a correct answer</li>}
            </ul>
          </div>
        </div>
      )}

      {/* ── Question Text ── */}
      <Field label="Question Text" icon={Icons.AlignLeft} required>
        <textarea
          rows={3}
          name="question"
          value={question.question || ""}
          onChange={handleChange}
          placeholder="Enter your multiple choice question here..."
          className="w-full resize-y rounded-xl border border-border-custom bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </Field>

      {/* ── Options ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Field label="Answer Options" icon={Icons.CheckCircle2} required hint="Select the correct answer by clicking the circle.">
            <span className="sr-only">Options</span>
          </Field>
          <span className="text-xs text-muted-foreground">
            {options.filter((o) => o.trim()).length} of {options.length} filled
          </span>
        </div>

        <div className="space-y-2">
          {options.map((option, index) => (
            <OptionRow
              key={index}
              option={option}
              index={index}
              totalOptions={options.length}
              isCorrect={option === question.correctAnswer && option.trim() !== ""}
              onChange={updateOption}
              onRemove={removeOption}
              onSetCorrect={setCorrectAnswer}
            />
          ))}
        </div>

        {options.length < 8 && (
          <button
            type="button"
            onClick={addOption}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border-custom py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <Icons.Plus className="h-4 w-4" />
            Add Option {OPTION_LABELS[options.length] || options.length + 1}
          </button>
        )}
      </div>

      {/* ── Settings Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Marks" icon={Icons.Star}>
          <div className="relative">
            <input
              type="number"
              name="marks"
              value={question.marks || ""}
              onChange={handleChange}
              min={0}
              placeholder="1"
              className="w-full rounded-xl border border-border-custom bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </Field>

        <div className="flex items-end">
          <Toggle
            name="required"
            checked={question.required}
            onChange={handleChange}
            label="Required Question"
            description="Students must answer this question to submit."
          />
        </div>
      </div>

      {/* ── Correct Answer Summary ── */}
      {hasCorrectAnswer && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
          <Icons.CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Correct answer set: <strong className="text-emerald-800 dark:text-emerald-300">"{question.correctAnswer}"</strong>
          </span>
        </div>
      )}
    </div>
  );
}


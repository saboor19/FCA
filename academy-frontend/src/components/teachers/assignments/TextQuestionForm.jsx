"use client";

import { useCallback, useState } from "react";

/* ─── Inline Icons ─── */
const Icons = {
  AlignLeft: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
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
  Type: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
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
  CheckCircle2: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 12 15 16 10" />
    </svg>
  ),
  Minimize2: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  Maximize2: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  Info: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Eye: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

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

/* ─── Expandable Textarea ─── */
function ExpandableTextarea({ name, value, onChange, placeholder, rows = 4, hint, label, icon: Icon }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const charCount = (value || "").length;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{charCount} chars</span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={isExpanded ? "Collapse" : "Expand"}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Icons.Minimize2 className="h-3.5 w-3.5" /> : <Icons.Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        rows={isExpanded ? 10 : rows}
        className="w-full resize-y rounded-xl border border-border-custom bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ─── Number Input with Stepper ─── */
function NumberInput({ name, value, onChange, placeholder, min, max, hint, label, icon: Icon }) {
  const handleStep = (delta) => {
    const current = Number(value) || 0;
    const next = current + delta;
    if (min !== undefined && next < min) return;
    if (max !== undefined && next > max) return;
    onChange({ target: { name, value: String(next), type: "number" } });
  };

  return (
    <Field label={label} icon={Icon} hint={hint}>
      <div className="relative flex items-center">
        <input
          type="number"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full rounded-xl border border-border-custom bg-card py-2.5 pl-4 pr-20 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="absolute right-1 flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => handleStep(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Decrease"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          <button
            type="button"
            onClick={() => handleStep(1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Increase"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
        </div>
      </div>
    </Field>
  );
}

/* ═══════════════════════════════════════════
   MAIN TEXT QUESTION FORM
   ═══════════════════════════════════════════ */
export default function TextQuestionForm({ question, updateQuestion }) {
  const [showPreview, setShowPreview] = useState(false);

  const isValid = question.question?.trim().length > 0;
  const wordLimit = Number(question.wordLimit) || 0;
  const hasGuidelines = question.guidelines?.trim().length > 0;

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      updateQuestion({ ...question, [name]: type === "checkbox" ? checked : value });
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
            </ul>
          </div>
        </div>
      )}

      {/* ── Question Text ── */}
      <ExpandableTextarea
        name="question"
        value={question.question}
        onChange={handleChange}
        placeholder="Enter your descriptive question here. Students will type their answer in a text field..."
        rows={4}
        label="Question Text"
        icon={Icons.AlignLeft}
        hint="This is what students will see when taking the assignment."
      />

      {/* ── Answer Guidelines ── */}
      <ExpandableTextarea
        name="guidelines"
        value={question.guidelines}
        onChange={handleChange}
        placeholder="Optional: Provide grading rubric, expected structure, key points to cover, or any specific instructions for students..."
        rows={5}
        label="Answer Guidelines"
        icon={Icons.FileText}
        hint="Visible to teachers during grading. Helps maintain consistency."
      />

      {/* ── Settings Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberInput
          name="wordLimit"
          value={question.wordLimit}
          onChange={handleChange}
          placeholder="No limit"
          min={0}
          label="Word Limit"
          icon={Icons.Type}
          hint="Leave empty for no limit. Students see a counter."
        />

        <NumberInput
          name="marks"
          value={question.marks}
          onChange={handleChange}
          placeholder="1"
          min={0}
          label="Marks"
          icon={Icons.Star}
          hint="Points awarded for a correct answer."
        />
      </div>

      {/* ── Preview Toggle ── */}
      {hasGuidelines && (
        <div className="rounded-xl border border-border-custom bg-card">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/30 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <Icons.Eye className="h-4 w-4 text-muted-foreground" />
              Student Preview
            </span>
            <span className="text-xs text-muted-foreground">
              {showPreview ? "Hide" : "Show"}
            </span>
          </button>
          {showPreview && (
            <div className="border-t border-border-custom px-4 py-4">
              <div className="rounded-lg border border-border-custom bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">{question.question || "[Question text will appear here]"}</p>
                {wordLimit > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icons.Type className="h-3 w-3" />
                    Maximum {wordLimit} words
                  </div>
                )}
                <div className="mt-4">
                  <div className="h-24 w-full rounded-lg border border-dashed border-border-custom bg-card" />
                  <p className="mt-1 text-xs text-muted-foreground">Student answer area</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Required Toggle ── */}
      <Toggle
        name="required"
        checked={question.required}
        onChange={handleChange}
        label="Required Question"
        description="Students must provide an answer before submitting the assignment."
      />
    </div>
  );
}

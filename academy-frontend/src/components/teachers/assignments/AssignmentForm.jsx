"use client";

import { useState, useCallback,useEffect } from "react";
import QuestionBuilder from "./QuestionBuilder";
import { createAssignment } from "@/services/teacher/assignmentService";
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
  Save: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Loader: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Type: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
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
  Calendar: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Repeat: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
  Layers: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  AlertTriangle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  CheckCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  HelpCircle: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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
  Percent: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
  GraduationCap: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  BookOpen: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  ListOrdered: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" />
      <path d="M4 10h2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
    </svg>
  ),
  Settings2: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7h-9" /><path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
    </svg>
  ),
  ShieldCheck: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 12 15 16 10" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ChevronDown: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Info: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

/* ─── Section Component ─── */
function Section({ icon: Icon, title, description, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8 ${className}`}>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ─── Form Field Component ─── */
function Field({ label, icon: Icon, hint, required, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
        {required && <span className="text-destructive" aria-label="required">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ─── Text Input Component ─── */
function TextInput({ icon, error, className = "", ...props }) {
  return (
    <div className="relative">
      {icon && (
        <icon.type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <input
        {...props}
        className={`w-full rounded-xl border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          icon ? "pl-10" : ""
        } ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border-custom"} ${className}`}
      />
    </div>
  );
}

/* ─── Select Component ─── */
function Select({ icon, error, children, className = "", ...props }) {
  return (
    <div className="relative">
      {icon && (
        <icon.type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <select
        {...props}
        className={`w-full appearance-none rounded-xl border bg-card px-4 py-2.5 text-sm text-foreground transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          icon ? "pl-10" : ""
        } ${error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border-custom"} ${className}`}
      >
        {children}
      </select>
      <Icons.ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

/* ─── Textarea Component ─── */
function Textarea({ error, className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={`w-full resize-y rounded-xl border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-150 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
        error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border-custom"
      } ${className}`}
    />
  );
}

/* ─── Toggle / Checkbox Component ─── */
function Toggle({ name, checked, onChange, label, description, icon: Icon }) {
  return (
    <label className="group flex cursor-pointer items-start gap-4 rounded-xl border border-border-custom bg-card p-4 transition-all hover:border-primary/30 hover:bg-muted/30 focus-within:ring-2 focus-within:ring-primary/20">
      <div className="relative mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200" style={{ backgroundColor: checked ? "var(--primary)" : "var(--muted-foreground)" }}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <span
          className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4.5" : "translate-x-0.5"}`}
          style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
    </label>
  );
}

/* ─── Instruction Item ─── */
function InstructionItem({ value, index, onChange, onRemove, total }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="mt-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {index + 1}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        placeholder={`Instruction step ${index + 1}`}
        className="flex-1 rounded-xl border border-border-custom bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={total <= 1}
        className="mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
        aria-label={`Remove instruction ${index + 1}`}
        title={total <= 1 ? "Cannot remove last instruction" : "Remove instruction"}
      >
        <Icons.Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Assignment Type Badge ─── */
const TYPE_CONFIG = {
  MCQ: { label: "Multiple Choice", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20" },
  DESCRIPTIVE: { label: "Descriptive", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20" },
  FILE_UPLOAD: { label: "File Upload", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" },
  MIXED: { label: "Mixed", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" },
};

/* ═══════════════════════════════════════════
   MAIN FORM
   ═══════════════════════════════════════════ */
export default function AssignmentForm({ initialData = {}, onSubmit, loading = false, batches = [] }) {
  useEffect(() => {
  setFormData({
    title: initialData.title || "",
    description: initialData.description || "",
    type: initialData.type || "MIXED",
    batchId: initialData.batchId || "",
    moduleId: initialData.moduleId || "",
    instructions: initialData.instructions?.length
      ? initialData.instructions
      : [""],
    dueDate: initialData.dueDate || "",
    timeLimit: initialData.timeLimit || "",
    maxAttempts: initialData.maxAttempts || 1,
    retryDelay: initialData.retryDelay || 0,
    allowLateSubmission: initialData.allowLateSubmission || false,
    latePenalty: initialData.latePenalty || 0,
    autoSubmit: initialData.autoSubmit ?? true,
    allowResubmission: initialData.allowResubmission || false,
    shuffleQuestions: initialData.shuffleQuestions || false,
    showResultImmediately: initialData.showResultImmediately || false,
    showCorrectAnswers: initialData.showCorrectAnswers || false,
    requireSafeBrowser: initialData.requireSafeBrowser || false,
    questions: initialData.questions || [],
  });
}, [initialData]);
  
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    type: initialData.type || "MIXED",
    batchId: initialData.batchId || "",
    moduleId: initialData.moduleId || "",
    instructions: initialData.instructions?.length ? initialData.instructions : [""],
    dueDate: initialData.dueDate || "",
    timeLimit: initialData.timeLimit || "",
    maxAttempts: initialData.maxAttempts || 1,
    retryDelay: initialData.retryDelay || 0,
    allowLateSubmission: initialData.allowLateSubmission || false,
    latePenalty: initialData.latePenalty || 0,
    autoSubmit: initialData.autoSubmit ?? true,
    allowResubmission: initialData.allowResubmission || false,
    shuffleQuestions: initialData.shuffleQuestions || false,
    showResultImmediately: initialData.showResultImmediately || false,
    showCorrectAnswers: initialData.showCorrectAnswers || false,
    requireSafeBrowser: initialData.requireSafeBrowser || false,
    questions: initialData.questions || [],
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("details");

  const selectedBatch = batches.find((b) => b._id === formData.batchId);
  const modules = selectedBatch?.course?.modules || [];

  /* ─── Validation ─── */
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.batchId) newErrors.batchId = "Please select a batch";
    if (!formData.moduleId) newErrors.moduleId = "Please select a module";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (formData.latePenalty < 0 || formData.latePenalty > 100) newErrors.latePenalty = "Must be between 0 and 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /* ─── Handlers ─── */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "batchId") next.moduleId = "";
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, [errors]);

const setQuestions = useCallback((updater) => {
  setFormData((prev) => ({
    ...prev,
    questions:
      typeof updater === "function"
        ? updater(prev.questions || [])
        : updater,
  }));
}, []);

  const addInstruction = useCallback(() => {
    setFormData((prev) => ({ ...prev, instructions: [...prev.instructions, ""] }));
  }, []);

  const updateInstruction = useCallback((index, value) => {
    setFormData((prev) => {
      const updated = [...prev.instructions];
      updated[index] = value;
      return { ...prev, instructions: updated };
    });
  }, []);

  const removeInstruction = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  }, []);


  // console.log("this is batches",initialData)

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector("[data-error]");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSubmit(formData);
  }, [formData, validate, onSubmit]);

  /* ─── Tabs ─── */
  const tabs = [
    { id: "details", label: "Details", icon: Icons.Type },
    { id: "instructions", label: "Instructions", icon: Icons.ListOrdered },
    { id: "settings", label: "Settings", icon: Icons.Settings2 },
    { id: "questions", label: "Questions", icon: Icons.HelpCircle },
  ];

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-6 pb-20">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {initialData._id ? "Edit Assignment" : "Create Assignment"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {initialData._id
              ? "Update your assignment details and questions."
              : "Set up a new assignment for your students."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {initialData._id && (
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TYPE_CONFIG[formData.type]?.color || TYPE_CONFIG.MIXED.color}`}>
              {TYPE_CONFIG[formData.type]?.label || formData.type}
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <Icons.Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Icons.Save className="h-4 w-4" />
            )}
            {loading ? "Saving..." : initialData._id ? "Update Assignment" : "Create Assignment"}
          </button>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <nav className="sticky top-0 z-30 -mx-4 bg-background/80 px-4 py-2 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-border-custom bg-card p-1 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Tab: Details ── */}
      {activeTab === "details" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Section icon={Icons.Type} title="Basic Details" description="Core information about your assignment.">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2" data-error={errors.title}>
                <Field label="Assignment Title" required error={errors.title}>
                  <TextInput
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Mid-Term Examination - Physics"
                    error={errors.title}
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Description" icon={Icons.AlignLeft} hint="Brief overview visible to students.">
                  <Textarea
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this assignment covers..."
                  />
                </Field>
              </div>

              <div>
                <Field label="Assignment Type" icon={Icons.Layers} required>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="DESCRIPTIVE">Descriptive</option>
                    <option value="FILE_UPLOAD">File Upload</option>
                    <option value="MIXED">Mixed</option>
                  </Select>
                </Field>
              </div>

              <div data-error={errors.batchId}>
                <Field label="Batch" icon={Icons.GraduationCap} required error={errors.batchId}>
                  <Select
                    name="batchId"
                    value={formData.batchId}
                    onChange={handleChange}
                    error={errors.batchId}
                  >
                    <option value="">Select a batch</option>
                    {batches.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div data-error={errors.moduleId}>
                <Field label="Module" icon={Icons.BookOpen} required error={errors.moduleId}>
                  <Select
                    name="moduleId"
                    value={formData.moduleId}
                    onChange={handleChange}
                    disabled={!formData.batchId}
                    error={errors.moduleId}
                  >
                    <option value="">{formData.batchId ? "Select a module" : "Select a batch first"}</option>
                    {modules.map((module) => (
                      <option key={module._id} value={module._id}>
                        {module.title}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <div data-error={errors.dueDate}>
                <Field label="Due Date & Time" icon={Icons.Calendar} required error={errors.dueDate}>
                  <TextInput
                    type="datetime-local"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    error={errors.dueDate}
                  />
                </Field>
              </div>

              <div>
                <Field label="Time Limit" icon={Icons.Clock} hint="Leave empty for no limit.">
                  <TextInput
                    type="number"
                    name="timeLimit"
                    value={formData.timeLimit}
                    onChange={handleChange}
                    placeholder="Minutes"
                    min={0}
                  />
                </Field>
              </div>

              <div>
                <Field label="Max Attempts" icon={Icons.Repeat} hint="How many times a student can attempt.">
                  <TextInput
                    type="number"
                    name="maxAttempts"
                    value={formData.maxAttempts}
                    onChange={handleChange}
                    min={1}
                  />
                </Field>
              </div>

              <div>
                <Field label="Retry Delay" icon={Icons.Clock} hint="Minutes between attempts.">
                  <TextInput
                    type="number"
                    name="retryDelay"
                    value={formData.retryDelay}
                    onChange={handleChange}
                    placeholder="Minutes"
                    min={0}
                  />
                </Field>
              </div>

              <div>
                <Field label="Late Penalty" icon={Icons.Percent} hint="Percentage deducted per late submission.">
                  <TextInput
                    type="number"
                    name="latePenalty"
                    value={formData.latePenalty}
                    onChange={handleChange}
                    placeholder="0–100"
                    min={0}
                    max={100}
                    error={errors.latePenalty}
                  />
                </Field>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ── Tab: Instructions ── */}
      {activeTab === "instructions" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Section
            icon={Icons.ListOrdered}
            title="Instructions"
            description="Step-by-step guidelines for students taking this assignment."
          >
            <div className="space-y-3">
              {formData.instructions.map((instruction, index) => (
                <InstructionItem
                  key={index}
                  index={index}
                  value={instruction}
                  onChange={updateInstruction}
                  onRemove={removeInstruction}
                  total={formData.instructions.length}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addInstruction}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-border-custom px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <Icons.Plus className="h-4 w-4" />
              Add Instruction
            </button>
          </Section>
        </div>
      )}

      {/* ── Tab: Settings ── */}
      {activeTab === "settings" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Section
            icon={Icons.Settings2}
            title="Assignment Settings"
            description="Configure behavior and restrictions for this assignment."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Toggle
                name="allowLateSubmission"
                checked={formData.allowLateSubmission}
                onChange={handleChange}
                label="Allow Late Submission"
                description="Students can submit after the due date with a penalty."
                icon={Icons.Calendar}
              />
              <Toggle
                name="allowResubmission"
                checked={formData.allowResubmission}
                onChange={handleChange}
                label="Allow Resubmission"
                description="Students can overwrite their previous submission."
                icon={Icons.Repeat}
              />
              <Toggle
                name="autoSubmit"
                checked={formData.autoSubmit}
                onChange={handleChange}
                label="Auto Submit"
                description="Automatically submit when time limit expires."
                icon={Icons.CheckCircle}
              />
              <Toggle
                name="shuffleQuestions"
                checked={formData.shuffleQuestions}
                onChange={handleChange}
                label="Shuffle Questions"
                description="Randomize question order for each student."
                icon={Icons.Hash}
              />
              <Toggle
                name="showResultImmediately"
                checked={formData.showResultImmediately}
                onChange={handleChange}
                label="Show Result Immediately"
                description="Students see their score right after submission."
                icon={Icons.CheckCircle}
              />
              <Toggle
                name="showCorrectAnswers"
                checked={formData.showCorrectAnswers}
                onChange={handleChange}
                label="Show Correct Answers"
                description="Reveal correct answers after submission."
                icon={Icons.CheckCircle}
              />
              <Toggle
                name="requireSafeBrowser"
                checked={formData.requireSafeBrowser}
                onChange={handleChange}
                label="Require Safe Browser"
                description="Force lockdown browser mode for secure testing."
                icon={Icons.ShieldCheck}
              />
            </div>
          </Section>
        </div>
      )}

      {/* ── Tab: Questions ── */}
      {activeTab === "questions" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Section
            icon={Icons.HelpCircle}
            title="Questions"
            description={`${formData.questions.length} question${formData.questions.length !== 1 ? "s" : ""} added`}
          >
            <QuestionBuilder questions={formData.questions} setQuestions={setQuestions} />
          </Section>
        </div>
      )}

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-custom bg-card/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="hidden text-sm text-muted-foreground sm:block">
            <span className="font-medium text-foreground">{formData.questions.length}</span> questions ·{" "}
            <span className="font-medium text-foreground">{formData.instructions.length}</span> instructions
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
              }}
              disabled={activeTab === "details"}
              className="rounded-xl border border-border-custom px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-30"
            >
              Previous
            </button>
            {activeTab !== "questions" ? (
              <button
                type="button"
                onClick={() => {
                  const currentIndex = tabs.findIndex((t) => t.id === activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                }}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 active:scale-[0.98]"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? <Icons.Loader className="h-4 w-4 animate-spin" /> : <Icons.Save className="h-4 w-4" />}
                {loading ? "Saving..." : initialData._id ? "Update Assignment" : "Create Assignment"}
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

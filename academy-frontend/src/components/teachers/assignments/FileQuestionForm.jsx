"use client";

import { useCallback, useState } from "react";

/* ─── Inline Icons ─── */
const Icons = {
  Upload: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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
  AlignLeft: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="17" y1="10" x2="3" y2="10" />
      <line x1="21" y1="6" x2="3" y2="6" />
      <line x1="21" y1="14" x2="3" y2="14" />
      <line x1="17" y1="18" x2="3" y2="18" />
    </svg>
  ),
  FileType: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 13h6" /><path d="M9 17h3" />
    </svg>
  ),
  HardDrive: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="12" x2="2" y2="12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      <line x1="6" y1="16" x2="6.01" y2="16" />
      <line x1="10" y1="16" x2="10.01" y2="16" />
    </svg>
  ),
  Files: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
      <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
      <path d="M15 2v5h5" />
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
  Eye: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Image: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  FileCode: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 13 7 15 9 17" />
      <polyline points="15 13 17 15 15 17" />
    </svg>
  ),
  X: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

/* ─── Common File Type Presets ─── */
const FILE_TYPE_PRESETS = [
  { label: "Documents", types: "pdf,doc,docx", icon: Icons.FileType },
  { label: "Images", types: "jpg,jpeg,png,gif,webp", icon: Icons.Image },
  { label: "Code", types: "zip,tar,gz,js,py,java,cpp", icon: Icons.FileCode },
  { label: "Spreadsheets", types: "xls,xlsx,csv", icon: Icons.FileText },
];

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

/* ─── File Type Chips ─── */
function FileTypeChips({ value, onChange }) {
  const currentTypes = (value || "").split(",").map((t) => t.trim()).filter(Boolean);

  const toggleType = (type) => {
    const normalized = type.trim().toLowerCase();
    const exists = currentTypes.includes(normalized);
    const next = exists ? currentTypes.filter((t) => t !== normalized) : [...currentTypes, normalized];
    onChange({ target: { name: "allowedFileTypes", value: next.join(","), type: "text" } });
  };

  const allPresets = FILE_TYPE_PRESETS.flatMap((p) => p.types.split(","));
  const customTypes = currentTypes.filter((t) => !allPresets.includes(t));

  return (
    <div className="space-y-3">
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {FILE_TYPE_PRESETS.map((preset) => {
          const types = preset.types.split(",");
          const isActive = types.some((t) => currentTypes.includes(t));
          const Icon = preset.icon;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                const next = isActive
                  ? currentTypes.filter((t) => !types.includes(t))
                  : [...currentTypes, ...types];
                onChange({ target: { name: "allowedFileTypes", value: [...new Set(next)].join(","), type: "text" } });
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border-custom bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <Icon className="h-3 w-3" />
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Custom Type Input */}
      <div className="relative">
        <input
          type="text"
          name="allowedFileTypes"
          value={value || ""}
          onChange={onChange}
          placeholder="pdf, docx, zip, jpg, png..."
          className="w-full rounded-xl border border-border-custom bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Active Chips */}
      {currentTypes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {currentTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            >
              .{type}
              <button
                type="button"
                onClick={() => toggleType(type)}
                className="rounded-sm p-0.5 hover:bg-primary/20"
                aria-label={`Remove ${type}`}
              >
                <Icons.X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN FILE QUESTION FORM
   ═══════════════════════════════════════════ */
export default function FileQuestionForm({ question, updateQuestion }) {
  const [showPreview, setShowPreview] = useState(false);

  const isValid = question.question?.trim().length > 0;
  const maxSize = Number(question.maxFileSize) || 0;
  const maxFiles = Number(question.maxFiles) || 1;
  const fileTypes = (question.allowedFileTypes || "").split(",").filter(Boolean);

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
        placeholder="Enter your file upload question here. For example: Upload your lab report as a PDF..."
        rows={4}
        label="Question Text"
        icon={Icons.AlignLeft}
        hint="This is what students will see when taking the assignment."
      />

      {/* ── Submission Guidelines ── */}
      <ExpandableTextarea
        name="guidelines"
        value={question.guidelines}
        onChange={handleChange}
        placeholder="Optional: Provide file naming conventions, formatting requirements, or any specific instructions for the upload..."
        rows={5}
        label="Submission Guidelines"
        icon={Icons.FileText}
        hint="Visible to teachers during grading. Helps students understand expectations."
      />

      {/* ── Allowed File Types ── */}
      <Field label="Allowed File Types" icon={Icons.FileType} hint="Click presets or type custom extensions separated by commas.">
        <FileTypeChips value={question.allowedFileTypes} onChange={handleChange} />
      </Field>

      {/* ── Settings Row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <NumberInput
          name="maxFileSize"
          value={question.maxFileSize}
          onChange={handleChange}
          placeholder="No limit"
          min={1}
          max={500}
          label="Max File Size"
          icon={Icons.HardDrive}
          hint="In MB. Leave empty for no limit."
        />

        <NumberInput
          name="maxFiles"
          value={question.maxFiles}
          onChange={handleChange}
          placeholder="1"
          min={1}
          max={20}
          label="Max Upload Files"
          icon={Icons.Files}
          hint="Number of files students can upload."
        />

        <NumberInput
          name="marks"
          value={question.marks}
          onChange={handleChange}
          placeholder="1"
          min={0}
          label="Marks"
          icon={Icons.Star}
          hint="Points awarded for correct submission."
        />
      </div>

      {/* ── Preview Panel ── */}
      {(fileTypes.length > 0 || maxSize > 0 || maxFiles > 1) && (
        <div className="rounded-xl border border-border-custom bg-card">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/30 rounded-xl"
          >
            <span className="flex items-center gap-2">
              <Icons.Eye className="h-4 w-4 text-muted-foreground" />
              Student Upload Preview
            </span>
            <span className="text-xs text-muted-foreground">{showPreview ? "Hide" : "Show"}</span>
          </button>
          {showPreview && (
            <div className="border-t border-border-custom px-4 py-4">
              <div className="rounded-lg border border-dashed border-border-custom bg-muted/20 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icons.Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">
                  {question.question || "[Question text will appear here]"}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {fileTypes.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                      <Icons.FileType className="h-3 w-3" />
                      {fileTypes.map((t) => `.${t}`).join(", ")}
                    </span>
                  )}
                  {maxSize > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      <Icons.HardDrive className="h-3 w-3" />
                      Max {maxSize} MB
                    </span>
                  )}
                  {maxFiles > 1 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      <Icons.Files className="h-3 w-3" />
                      Up to {maxFiles} files
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="mx-auto flex h-10 w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-dashed border-border-custom bg-card text-xs text-muted-foreground">
                    <Icons.Upload className="h-4 w-4" />
                    Click or drag files to upload
                  </div>
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
        description="Students must upload at least one file before submitting the assignment."
      />
    </div>
  );
}
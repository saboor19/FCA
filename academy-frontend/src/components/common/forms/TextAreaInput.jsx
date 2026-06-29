"use client";

export default function TextareaInput({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = "",
  required = false,
  error = "",
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
        {label}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <textarea
        rows={rows}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 text-sm bg-background border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-150 resize-y min-h-[80px] ${
          error
            ? "border-destructive focus:border-destructive focus:ring-destructive"
            : "border-border"
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />

      {error && (
        <p id={`${name}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Keyboard, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function OnlineAttendanceForm({ onSubmit }) {
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError("Please enter the attendance code");
      inputRef.current?.focus();
      return;
    }

    if (code.trim().length < 4) {
      setError("Code must be at least 4 characters");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate API call (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onSubmit?.(code);
      // Reset after success animation
      setTimeout(() => {
        setIsSuccess(false);
        setCode("");
      }, 2000);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (error) setError("");
  };

  // Format code as user types (uppercase, add hyphens)
  const handleChange = (e) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    // Format: ATT-X7K2 style
    let formatted = raw;
    if (raw.length > 3) formatted = raw.slice(0, 3) + "-" + raw.slice(3, 7);
    if (raw.length > 7) formatted = raw.slice(0, 3) + "-" + raw.slice(3, 7) + "-" + raw.slice(7, 11);
    
    setCode(formatted.slice(0, 11));
    if (error) setError("");
  };

  return (
    <div className={`relative rounded-2xl border bg-[var(--card)] shadow-sm 
                     transition-all duration-300 overflow-hidden
                     ${isFocused ? 'border-[var(--primary)] shadow-md ring-1 ring-[var(--primary)]/20' : 'border-[var(--border-custom)]'}
                     ${isSuccess ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : ''}`}>
      
      {/* Success overlay */}
      {isSuccess && (
        <div className="absolute inset-0 bg-emerald-50/90 dark:bg-emerald-950/90 z-10 
                        flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="p-4 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">Attendance Marked!</p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">Code verified successfully</p>
        </div>
      )}

      {/* Top accent */}
      <div className={`h-1 transition-colors duration-300 ${isSuccess ? 'bg-emerald-500' : 'bg-[var(--primary)]'}`} aria-hidden="true" />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl transition-colors duration-300
                          ${isFocused ? 'bg-[var(--primary)]/10' : 'bg-[var(--muted)]'}`}>
            <Keyboard className={`w-6 h-6 transition-colors duration-300 ${isFocused ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`} 
                      aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Enter Attendance Code
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
              Type the code provided by your instructor to mark your attendance for this session.
            </p>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="ATT-X7K2"
              maxLength={11}
              disabled={isSubmitting}
              className={`w-full px-5 py-4 rounded-xl border-2 bg-[var(--background)] text-[var(--foreground)]
                         text-lg font-mono font-semibold tracking-widest uppercase text-center
                         placeholder:text-[var(--muted-foreground)] placeholder:font-sans placeholder:tracking-normal placeholder:font-normal
                         transition-all duration-200 ease-out
                         focus:outline-none
                         disabled:opacity-50 disabled:cursor-not-allowed
                         ${error 
                           ? 'border-red-300 focus:border-red-500 bg-red-50/30 dark:bg-red-950/20' 
                           : 'border-[var(--border-custom)] focus:border-[var(--primary)]'
                         }`}
              aria-label="Attendance code input"
              aria-invalid={!!error}
              aria-describedby={error ? "code-error" : undefined}
              autoComplete="off"
              autoCapitalize="characters"
            />
            
            {/* Character counter / hint */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {code.length > 0 && !isSubmitting && (
                <Sparkles className={`w-4 h-4 transition-colors ${code.length >= 7 ? 'text-emerald-500' : 'text-[var(--muted-foreground)]'}`} 
                          aria-hidden="true" />
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div id="code-error" 
                 className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 
                            border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm animate-in slide-in-from-top-1"
                 role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Hint */}
          {!error && code.length === 0 && (
            <p className="text-xs text-[var(--muted-foreground)] text-center">
              Code format: <span className="font-mono font-semibold text-[var(--foreground)]">ATT-X7K2</span>
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !code.trim()}
          className={`mt-5 w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl
                     font-semibold text-sm transition-all duration-200 ease-out
                     focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]
                     ${isSubmitting 
                       ? 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-wait' 
                       : !code.trim()
                         ? 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-not-allowed'
                         : 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/25 active:scale-[0.98]'
                     }`}
          aria-label={isSubmitting ? "Verifying code..." : "Mark attendance"}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <span>Mark Attendance</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
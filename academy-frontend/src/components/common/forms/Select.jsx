"use client";

import { ChevronDown } from "lucide-react";
import FormError from "./FormError";
import FormHelperText from "./FormHelperText";
import FormLabel from "./FormLabel";

export default function Select({
  id,
  name,
  label,

  value,
  onChange,

  options = [],

  placeholder = "Select an option",

  required = false,
  disabled = false,
  multiple = false,

  error,
  helperText,

  className = "",
  size = "default", // "sm" | "default" | "lg"

  ...props
}) {
  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    default: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3.5 text-base",
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <FormLabel
          htmlFor={id || name}
          required={required}
          className="mb-2 block"
        >
          {label}
        </FormLabel>
      )}

      <div className="relative group">
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          multiple={multiple}
          className={`
            w-full
            appearance-none
            rounded-xl
            border
            bg-[var(--card)]
            ${sizeClasses[size]}
            text-[var(--foreground)]
            placeholder:text-[var(--muted-foreground)]
            outline-none
            transition-all
            duration-200

            /* Soft focus ring */
            focus:border-[var(--primary)]
            focus:bg-[var(--card)]
            focus:ring-4
            focus:ring-[var(--primary)]/10

            /* Error state */
            ${error
              ? "border-[var(--destructive)]/60 focus:border-[var(--destructive)] focus:ring-[var(--destructive)]/10"
              : "border-[var(--border)] hover:border-[var(--muted-foreground)]/40"
            }

            /* Disabled state */
            ${disabled
              ? "cursor-not-allowed bg-[var(--muted)]/60 text-[var(--muted-foreground)] opacity-60"
              : "cursor-pointer"
            }

            /* Multiple select sizing */
            ${multiple ? "min-h-[120px] py-2" : "pr-10"}
          `}
          {...props}
        >
          {!multiple && (
            <option
              value=""
              disabled={required}
              className="text-[var(--muted-foreground)]"
            >
              {placeholder}
            </option>
          )}

          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="py-1.5 text-[var(--foreground)]"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom chevron — hidden for multiple */}
        {!multiple && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
            <ChevronDown
              className={`
                h-4 w-4
                transition-all
                duration-200
                ${disabled
                  ? "text-[var(--muted-foreground)]/40"
                  : "text-[var(--muted-foreground)] group-hover:text-[var(--primary)]"
                }
                ${error ? "text-[var(--destructive)]/60" : ""}
              `}
            />
          </div>
        )}

        {/* Subtle bottom accent on focus */}
        <div
          className={`
            pointer-events-none
            absolute
            inset-x-4
            -bottom-px
            h-px
            bg-[var(--primary)]
            transition-all
            duration-300
            ${error ? "bg-[var(--destructive)]" : ""}
            ${disabled ? "opacity-0" : "opacity-0 group-focus-within:opacity-100"}
          `}
        />
      </div>

      <div className="mt-1.5">
        <FormHelperText>{helperText}</FormHelperText>
        <FormError error={error} />
      </div>
    </div>
  );
}
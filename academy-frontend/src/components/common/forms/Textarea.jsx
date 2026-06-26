"use client";

import FormError from "./FormError";
import FormHelperText from "./FormHelperText";
import FormLabel from "./FormLabel";

export default function Textarea({
  id,
  name,
  label,

  value,
  onChange,

  rows = 4,

  placeholder = "",

  required = false,
  disabled = false,
  readOnly = false,

  error,
  helperText,

  resize = true,

  className = "",

  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <FormLabel
          htmlFor={id || name}
          required={required}
        >
          {label}
        </FormLabel>
      )}

      <textarea
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        className={`
          w-full
          rounded-lg
          border
          bg-white
          px-4
          py-2.5
          text-sm
          outline-none
          transition

          ${
            resize
              ? "resize-y"
              : "resize-none"
          }

          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-blue-500"
          }

          ${
            disabled
              ? "cursor-not-allowed bg-gray-100"
              : ""
          }

          ${className}
        `}
        {...props}
      />

      <FormHelperText>
        {helperText}
      </FormHelperText>

      <FormError
        error={error}
      />
    </div>
  );
}
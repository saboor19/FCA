"use client";

import FormError from "./FormError";
import FormHelperText from "./FormHelperText";
import FormLabel from "./FormLabel";

export default function Input({
  id,
  name,
  label,

  type = "text",

  value,
  onChange,

  placeholder = "",

  required = false,
  disabled = false,
  readOnly = false,

  error,
  helperText,

  className = "",

  startIcon: StartIcon,
  endIcon: EndIcon,

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

      <div className="relative">
        {StartIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center">
            <StartIcon
              size={18}
              className="text-gray-400"
            />
          </div>
        )}

        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
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
              StartIcon
                ? "pl-10"
                : ""
            }

            ${
              EndIcon
                ? "pr-10"
                : ""
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

        {EndIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <EndIcon
              size={18}
              className="text-gray-400"
            />
          </div>
        )}
      </div>

      <FormHelperText>
        {helperText}
      </FormHelperText>

      <FormError
        error={error}
      />
    </div>
  );
}
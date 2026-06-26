"use client";

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

  ...props
}) {

  // console.log(name, options);



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
          rounded-lg
          border
          bg-white
          px-4
          py-2.5
          text-sm
          outline-none
          transition

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
      >
        {!multiple && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      <FormHelperText>
        {helperText}
      </FormHelperText>

      <FormError
        error={error}
      />
    </div>
  );
}
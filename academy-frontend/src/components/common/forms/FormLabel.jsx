"use client";

export default function FormLabel({
  htmlFor,
  children,
  required = false,
  className = "",
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}

      {required && (
        <span className="ml-1 text-red-500">*</span>
      )}
    </label>
  );
}
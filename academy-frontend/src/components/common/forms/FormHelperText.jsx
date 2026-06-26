"use client";

export default function FormHelperText({
  children,
}) {
  if (!children) return null;

  return (
    <p className="mt-1 text-sm text-gray-500">
      {children}
    </p>
  );
}
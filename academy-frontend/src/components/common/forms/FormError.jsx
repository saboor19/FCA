"use client";

export default function FormError({
  error,
}) {
  if (!error) return null;

  return (
    <p className="mt-1 text-sm text-red-600">
      {error}
    </p>
  );
}
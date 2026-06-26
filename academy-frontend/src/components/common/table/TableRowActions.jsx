"use client";

export default function TableRowActions({
  children,
  align = "center",
  className = "",
}) {
  const alignment = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  return (
    <div
      className={`
        flex items-center
        ${alignment[align]}
        gap-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}
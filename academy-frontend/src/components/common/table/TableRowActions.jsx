"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export default function TableRowActions({
  children,
  align = "end",
  className = "",
  compact = false,
  collapseAt = 3, // Show "more" button when actions exceed this count
}) {
  const [showAll, setShowAll] = useState(false);

  const alignment = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
  };

  const actions = Array.isArray(children) ? children : [children];
  const hasOverflow = actions.length > collapseAt;
  const visibleActions = hasOverflow && !showAll ? actions.slice(0, collapseAt - 1) : actions;
  const hiddenActions = hasOverflow && !showAll ? actions.slice(collapseAt - 1) : [];

  return (
    <div
      className={`
        flex
        items-center
        ${alignment[align] || alignment.end}
        gap-1
        ${className}
      `}
      onClick={(e) => e.stopPropagation()} // Prevent row click when interacting with actions
    >
      {visibleActions.map((action, index) => (
        <div
          key={index}
          className={`
            opacity-0
            translate-x-1
            transition-all
            duration-200
            group-hover/row:opacity-100
            group-hover/row:translate-x-0
            ${compact ? "first:delay-0" : "first:delay-0"}
          `}
          style={{
            transitionDelay: `${index * 30}ms`,
          }}
        >
          {action}
        </div>
      ))}

      {hasOverflow && !showAll && hiddenActions.length > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className={`
            inline-flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            text-[var(--muted-foreground)]
            transition-colors
            hover:bg-[var(--muted)]
            hover:text-[var(--foreground)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[var(--primary)]
          `}
          aria-label="Show more actions"
          title="More actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}

      {showAll && hiddenActions.map((action, index) => (
        <div
          key={`hidden-${index}`}
          className="animate-in fade-in slide-in-from-right-2 duration-200"
        >
          {action}
        </div>
      ))}
    </div>
  );
}
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
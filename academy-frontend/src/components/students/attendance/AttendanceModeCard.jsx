"use client";

import { GraduationCap, BookOpen, Users, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils"; // or use your own class merging utility

export default function AttendanceModeCard({ 
  batch, 
  selected = false,
  onSelect,
  selectable = false 
}) {
  if (!batch) return null;

  const modeConfig = {
    online: {
      icon: BookOpen,
      label: "Online Learning",
      description: "Virtual classes via digital platform",
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50",
      accent: "bg-blue-500"
    },
    offline: {
      icon: MapPin,
      label: "On Campus",
      description: "In-person classroom attendance",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50",
      accent: "bg-emerald-500"
    },
    hybrid: {
      icon: Users,
      label: "Hybrid Mode",
      description: "Blend of online and offline classes",
      badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400",
      iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/50",
      accent: "bg-purple-500"
    }
  };

  const mode = batch.studyMode?.toLowerCase() || "offline";
  const config = modeConfig[mode] || modeConfig.offline;
  const ModeIcon = config.icon;

  return (
    <div 
      onClick={selectable ? onSelect : undefined}
      className={cn(
        "group relative rounded-2xl border bg-[var(--card)] p-6 shadow-sm",
        "transition-all duration-300 ease-out overflow-hidden",
        selectable && "cursor-pointer hover:shadow-lg hover:-translate-y-0.5",
        selected 
          ? "border-2 border-[var(--primary)] shadow-md ring-1 ring-[var(--primary)]/20" 
          : "border-[var(--border-custom)] hover:border-[var(--border-custom)]/80"
      )}
    >
      {/* Selection indicator */}
      {selectable && selected && (
        <div className="absolute top-4 right-4 z-10">
          <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
        </div>
      )}

      {/* Decorative gradient accent */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-1 opacity-60",
        config.iconBg.replace('text-', 'bg-').replace('dark:bg-', '').replace('/50', '')
      )} aria-hidden="true" />
      
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            "p-3 rounded-xl transition-transform duration-300",
            config.iconBg,
            selectable && "group-hover:scale-110"
          )}>
            <ModeIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          
          {/* Content */}
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] leading-tight">
              {batch.name}
            </h2>
            
            <div className="flex items-center gap-2 mt-3">
              <span className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border",
                config.badge
              )}>
                {config.label}
              </span>
            </div>
            
            <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        {/* Decorative batch indicator */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <div className={cn(
            "p-2 rounded-lg bg-[var(--muted)] transition-opacity",
            selected ? "opacity-100" : "opacity-50 group-hover:opacity-100"
          )}>
            <GraduationCap className="w-5 h-5 text-[var(--muted-foreground)]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Course metadata */}
      {batch.course && (
        <div className="mt-4 pt-4 border-t border-[var(--border-custom)]">
          <p className="text-xs text-[var(--muted-foreground)]">
            Course: <span className="font-medium text-[var(--foreground)]">
              {typeof batch.course === 'object' ? batch.course.title : batch.course}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
import { GraduationCap, BookOpen, Users, MapPin } from "lucide-react";

export default function AttendanceModeCard({ batch }) {
  if (!batch) return null;

  // Mode-specific configurations
  const modeConfig = {
    online: {
      icon: BookOpen,
      label: "Online Learning",
      description: "Virtual classes via digital platform",
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
      iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50"
    },
    offline: {
      icon: MapPin,
      label: "On Campus",
      description: "In-person classroom attendance",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
      iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50"
    },
    hybrid: {
      icon: Users,
      label: "Hybrid Mode",
      description: "Blend of online and offline classes",
      badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400",
      iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-900/50"
    }
  };

  const mode = batch.studyMode?.toLowerCase() || "offline";
  const config = modeConfig[mode] || modeConfig.offline;
  const ModeIcon = config.icon;

  return (
    <div className="group relative rounded-2xl border border-[var(--border-custom)] bg-[var(--card)] 
                    p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5
                    transition-all duration-300 ease-out overflow-hidden">
      
      {/* Decorative gradient accent */}
      <div className={`absolute top-0 left-0 w-full h-1 ${config.iconBg.replace('text-', 'bg-').replace('dark:bg-', '').replace('/50', '')} opacity-60`} aria-hidden="true" />
      
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`p-3 rounded-xl ${config.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <ModeIcon className="w-6 h-6" aria-hidden="true" />
          </div>
          
          {/* Content */}
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)] leading-tight">
              {batch.name}
            </h2>
            
            <div className="flex items-center gap-2 mt-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${config.badge}`}>
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
          <div className="p-2 rounded-lg bg-[var(--muted)] opacity-50 group-hover:opacity-100 transition-opacity">
            <GraduationCap className="w-5 h-5 text-[var(--muted-foreground)]" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Optional: Additional batch metadata */}
      {batch.course && (
        <div className="mt-4 pt-4 border-t border-[var(--border-custom)]">
          <p className="text-xs text-[var(--muted-foreground)]">
            Course: <span className="font-medium text-[var(--foreground)]">{batch.course}</span>
          </p>
        </div>
      )}
    </div>
  );
}
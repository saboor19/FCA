import { useEffect, useState, useRef } from "react";
import { Clock, CheckCircle2, XCircle, FileText, ArrowRight } from "lucide-react";

export default function LeaveSummary({ leaveRequests }) {
  const [animated, setAnimated] = useState({ pending: 0, approved: 0, rejected: 0 });
  // const hasAnimated = useRef(false);

  const stats = {
    pending: leaveRequests?.pending || 0,
    approved: leaveRequests?.approved || 0,
    rejected: leaveRequests?.rejected || 0,
    total: (leaveRequests?.pending || 0) + (leaveRequests?.approved || 0) + (leaveRequests?.rejected || 0)
  };

  // Animate numbers on mount
  useEffect(() => {
    // if (hasAnimated.current) return;
    // hasAnimated.current = true;

    const duration = 700;
    const steps = 25;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimated({
        pending: Math.round(stats.pending * easeOut),
        approved: Math.round(stats.approved * easeOut),
        rejected: Math.round(stats.rejected * easeOut)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [leaveRequests]);

  const cards = [
    {
      key: "pending",
      label: "Pending",
      value: animated.pending,
      rawValue: stats.pending,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-900",
      ringColor: "ring-amber-500/20",
      description: "Awaiting approval",
      accent: "bg-amber-500"
    },
    {
      key: "approved",
      label: "Approved",
      value: animated.approved,
      rawValue: stats.approved,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-900",
      ringColor: "ring-emerald-500/20",
      description: "Successfully granted",
      accent: "bg-emerald-500"
    },
    {
      key: "rejected",
      label: "Rejected",
      value: animated.rejected,
      rawValue: stats.rejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-900",
      ringColor: "ring-red-500/20",
      description: "Declined requests",
      accent: "bg-red-500"
    }
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--card)] shadow-sm 
                    hover:shadow-md transition-all duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--border-custom)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--muted)]">
            <FileText className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              Leave Requests
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {stats.total} total requests
            </p>
          </div>
        </div>
        
        {stats.total > 0 && (
          <button 
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] 
                       hover:text-[var(--primary-hover)] transition-colors"
            aria-label="View all leave requests"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid sm:grid-cols-3 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const percentage = stats.total > 0 ? (card.rawValue / stats.total) * 100 : 0;
          
          return (
            <div 
              key={card.key}
              className={`group relative rounded-xl border ${card.borderColor} ${card.bgColor} p-5
                         hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out
                         focus-within:ring-2 ${card.ringColor} focus-within:outline-none`}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              {/* Top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${card.accent} rounded-t-xl opacity-60`} aria-hidden="true" />
              
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg bg-white/60 dark:bg-black/20 ${card.color} 
                                transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                
                {/* Mini trend indicator */}
                {card.rawValue > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/30 ${card.color}`}>
                    {percentage.toFixed(0)}%
                  </span>
                )}
              </div>

              <div className="mt-4">
                <h3 className={`text-3xl font-bold ${card.color} tracking-tight`}>
                  {card.value}
                </h3>
                <p className="text-sm font-semibold text-[var(--foreground)] mt-1">
                  {card.label}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {card.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${card.accent} transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
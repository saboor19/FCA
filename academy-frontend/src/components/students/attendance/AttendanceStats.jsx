import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown, Minus, Activity, CheckCircle2, XCircle, Clock, CalendarX } from "lucide-react";

export default function AttendanceStats({ stats }) {
  const [animatedStats, setAnimatedStats] = useState({
    percentage: 0,
    total: 0,
    present: 0,
    absent: 0,
    leave: 0
  });

  const hasAnimated = useRef(false);

  // Animate numbers on mount
  useEffect(() => {
    if (!stats || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 800;
    const steps = 30;
    const interval = duration / steps;

    const targets = {
      percentage: stats?.percentage || 0,
      total: stats?.total || 0,
      present: stats?.present || 0,
      absent: stats?.absent || 0,
      leave: stats?.leave || 0
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

      setAnimatedStats({
        percentage: Math.round(targets.percentage * easeOut),
        total: Math.round(targets.total * easeOut),
        present: Math.round(targets.present * easeOut),
        absent: Math.round(targets.absent * easeOut),
        leave: Math.round(targets.leave * easeOut)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const percentage = stats?.percentage || 0;
  
  // Determine trend and color
  const getTrend = () => {
    if (percentage >= 85) return { icon: TrendingUp, color: "text-emerald-600", label: "Excellent" };
    if (percentage >= 75) return { icon: Minus, color: "text-amber-600", label: "Good" };
    return { icon: TrendingDown, color: "text-red-600", label: "At Risk" };
  };

  const trend = getTrend();
  const TrendIcon = trend.icon;

  // Stat card configuration
  const statCards = [
    {
      key: "percentage",
      label: "Attendance Rate",
      value: `${animatedStats.percentage}%`,
      rawValue: animatedStats.percentage,
      icon: Activity,
      color: "text-[var(--primary)]",
      bgColor: "bg-[var(--primary)]/10",
      ringColor: "ring-[var(--primary)]/20",
      description: "Overall attendance percentage"
    },
    {
      key: "total",
      label: "Total Days",
      value: animatedStats.total,
      rawValue: animatedStats.total,
      icon: CalendarX,
      color: "text-[var(--secondary)]",
      bgColor: "bg-[var(--secondary)]/10",
      ringColor: "ring-[var(--secondary)]/20",
      description: "Total working days"
    },
    {
      key: "present",
      label: "Present",
      value: animatedStats.present,
      rawValue: animatedStats.present,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      ringColor: "ring-emerald-200 dark:ring-emerald-900",
      description: "Days marked present"
    },
    {
      key: "absent",
      label: "Absent",
      value: animatedStats.absent,
      rawValue: animatedStats.absent,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      ringColor: "ring-red-200 dark:ring-red-900",
      description: "Days marked absent"
    },
    {
      key: "leave",
      label: "Leave",
      value: animatedStats.leave,
      rawValue: animatedStats.leave,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      ringColor: "ring-amber-200 dark:ring-amber-900",
      description: "Approved leave days"
    }
  ];

  // Circular progress for percentage
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (animatedStats.percentage / 100) * circumference;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card, index) => (
        <div 
          key={card.key}
          className="group relative rounded-2xl border border-[var(--border-custom)] bg-[var(--card)] p-5 
                     shadow-sm hover:shadow-md hover:-translate-y-0.5
                     transition-all duration-300 ease-out overflow-hidden"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/0 to-[var(--primary)]/5 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className="w-4 h-4" aria-hidden="true" />
              </div>
              
              {card.key === "percentage" && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trend.color}`}>
                  <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  {trend.label}
                </span>
              )}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              {card.key === "percentage" ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80" aria-hidden="true">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="var(--border-custom)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--foreground)]">
                      {card.value}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider font-semibold">
                      {card.label}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                    {card.value}
                  </h3>
                  <span className="text-xs text-[var(--muted-foreground)] font-medium">
                    {card.label}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-[var(--muted-foreground)] mt-2 leading-relaxed">
              {card.description}
            </p>

            {/* Progress bar for non-percentage cards */}
            {card.key !== "percentage" && card.key !== "total" && stats?.total > 0 && (
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${card.color.replace('text-', 'bg-')}`}
                    style={{ width: `${Math.min((card.rawValue / (stats.total || 1)) * 100, 100)}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="text-[10px] text-[var(--muted-foreground)] mt-1 text-right">
                  {((card.rawValue / (stats.total || 1)) * 100).toFixed(1)}% of total
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
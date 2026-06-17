import { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, Clock, AlertCircle } from "lucide-react";

export default function AttendanceHistory({ attendance = [] }) {
  const [expanded, setExpanded] = useState(false);
  const displayLimit = expanded ? attendance.length : 10;
  const hasMore = attendance.length > 10;

  // Status configuration for accessibility and visual consistency
  const statusConfig = {
    present: {
      label: "Present",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900",
      dot: "bg-emerald-500",
      ariaLabel: "Status: Present"
    },
    absent: {
      label: "Absent",
      className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
      dot: "bg-red-500",
      ariaLabel: "Status: Absent"
    },
    leave: {
      label: "Leave",
      className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
      dot: "bg-amber-500",
      ariaLabel: "Status: On Leave"
    },
    late: {
      label: "Late",
      className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900",
      dot: "bg-orange-500",
      ariaLabel: "Status: Late"
    }
  };

  const getStatusStyle = (status) => {
    const key = status?.toLowerCase() || "absent";
    return statusConfig[key] || statusConfig.absent;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString("en-US", { 
        weekday: "short", 
        year: "numeric", 
        month: "short", 
        day: "numeric" 
      }),
      relative: getRelativeDate(date)
    };
  };

  const getRelativeDate = (date) => {
    const today = new Date();
    const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return null;
  };

  const displayedItems = attendance.slice(0, displayLimit);

  return (
    <div className="rounded-2xl border border-[var(--border-custom)] bg-[var(--card)] shadow-sm 
                    hover:shadow-md transition-shadow duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--border-custom)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--muted)]">
            <Calendar className="w-5 h-5 text-[var(--primary)]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Recent Attendance
            </h2>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {attendance.length} total records
            </p>
          </div>
        </div>
        
        {attendance.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[var(--muted)] text-[var(--muted-foreground)]">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            Last 30 days
          </span>
        )}
      </div>

      {/* Content */}
      {attendance.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="inline-flex p-3 rounded-full bg-[var(--muted)] mb-3">
            <AlertCircle className="w-6 h-6 text-[var(--muted-foreground)]" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-[var(--foreground)]">No attendance records</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Your attendance history will appear here</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Attendance history records">
              <thead>
                <tr className="border-b border-[var(--border-custom)] bg-[var(--muted)]/50">
                  <th 
                    scope="col" 
                    className="text-left py-3.5 px-6 font-semibold text-[var(--foreground)] text-xs uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th 
                    scope="col" 
                    className="text-left py-3.5 px-6 font-semibold text-[var(--foreground)] text-xs uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-custom)]">
                {displayedItems.map((item, index) => {
                  const statusStyle = getStatusStyle(item.status);
                  const dateInfo = formatDate(item.date);
                  
                  return (
                    <tr 
                      key={item._id || index}
                      className="group hover:bg-[var(--muted)]/30 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-medium text-[var(--foreground)]">
                            {dateInfo.full}
                          </span>
                          {dateInfo.relative && (
                            <span className="text-xs text-[var(--muted-foreground)] mt-0.5">
                              {dateInfo.relative}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span 
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusStyle.className}`}
                          aria-label={statusStyle.ariaLabel}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} aria-hidden="true" />
                          {statusStyle.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Expand/Collapse */}
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full py-3 px-6 flex items-center justify-center gap-2 text-sm font-medium 
                         text-[var(--primary)] hover:bg-[var(--muted)] 
                         focus:outline-none focus:bg-[var(--muted)] transition-colors duration-150"
              aria-expanded={expanded}
              aria-controls="attendance-table"
            >
              {expanded ? (
                <>
                  Show Less <ChevronUp className="w-4 h-4" aria-hidden="true" />
                </>
              ) : (
                <>
                  Show All ({attendance.length} records) <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
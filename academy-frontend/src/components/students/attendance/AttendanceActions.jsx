import Link from "next/link";
import { ClipboardCheck, CalendarPlus } from "lucide-react"; // Add lucide-react if available, or use inline SVGs

export default function AttendanceActions() {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4">
      {/* Primary Action - Mark Attendance */}
      <Link
        href="/student/attendance/mark"
        className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl 
                   bg-[var(--primary)] text-white font-medium text-sm
                   shadow-[0_1px_3px_rgba(79,70,229,0.3)]
                   hover:bg-[var(--primary-hover)] hover:shadow-[0_4px_12px_rgba(79,70,229,0.4)]
                   active:scale-[0.98] active:shadow-none
                   focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]
                   transition-all duration-200 ease-out"
        aria-label="Mark your attendance for today"
      >
        <ClipboardCheck className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
        <span>Mark Attendance</span>
      </Link>

      {/* Secondary Action - Request Leave */}
      <Link
        href="/student/attendance/leave"
        className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl 
                   border border-[var(--border-custom)] bg-[var(--card)] text-[var(--foreground)] font-medium text-sm
                   hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--muted)]
                   active:scale-[0.98]
                   focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]
                   transition-all duration-200 ease-out"
        aria-label="Submit a leave request"
      >
        <CalendarPlus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
        <span>Request Leave</span>
      </Link>
    </div>
  );
}
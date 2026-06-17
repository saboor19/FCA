import { MapPin, Navigation, Radio, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function OfflineAttendanceCard({ onMarkAttendance }) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | locating | success | error

  const handleMarkAttendance = async () => {
    setIsLocating(true);
    setLocationStatus("locating");
    
    // Simulate location verification delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLocationStatus("success");
    setTimeout(() => {
      setIsLocating(false);
      setLocationStatus("idle");
      onMarkAttendance?.();
    }, 800);
  };

  const statusConfig = {
    idle: { text: "Mark Attendance", icon: Navigation },
    locating: { text: "Verifying Location...", icon: Radio },
    success: { text: "Location Verified!", icon: ShieldCheck }
  };

  const currentStatus = statusConfig[locationStatus];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="group relative rounded-2xl border border-[var(--border-custom)] bg-[var(--card)] 
                    shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Decorative map-like background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{
             backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
             backgroundSize: '24px 24px'
           }} 
           aria-hidden="true" />

      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-70" aria-hidden="true" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          
          {/* Left: Icon & Status */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 
                              dark:from-emerald-950/30 dark:to-teal-950/30 
                              border border-emerald-100 dark:border-emerald-900
                              transition-transform duration-300 group-hover:scale-105">
                <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </div>
              
              {/* Pulsing ring when locating */}
              {isLocating && (
                <span className="absolute inset-0 rounded-2xl border-2 border-emerald-400 animate-ping" aria-hidden="true" />
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[var(--foreground)]">
              Offline Attendance
            </h2>
            
            <p className="text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
              Use your current location to verify and mark your attendance. 
              Make sure you are within the campus premises.
            </p>

            {/* Location requirements */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium 
                               bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border-custom)]">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                GPS Required
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium 
                               bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border-custom)]">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                Campus Only
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={handleMarkAttendance}
              disabled={isLocating}
              className={`mt-6 inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm
                         transition-all duration-200 ease-out
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-[var(--background)]
                         ${isLocating 
                           ? 'bg-[var(--muted)] text-[var(--muted-foreground)] cursor-wait' 
                           : locationStatus === 'success'
                             ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                             : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--secondary)] hover:shadow-lg active:scale-[0.98]'
                         }`}
              aria-label={currentStatus.text}
              aria-busy={isLocating}
            >
              <StatusIcon className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{currentStatus.text}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
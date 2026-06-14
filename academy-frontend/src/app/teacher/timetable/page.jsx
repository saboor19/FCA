"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Loader2,
  Users,
  BookOpen,
  MapPin,
  Calendar
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTeacherTimetable } from "@/services/teacher/timetableService";

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

// Helper to format "14:30" to "2:30 PM"
const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hour, minute] = timeStr.split(":");
  const h = parseInt(hour, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12;
  return `${formattedHour}:${minute} ${ampm}`;
};

export default function TeacherTimetablePage() {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Determine current day for highlighting (0 = Sunday, 1 = Monday)
  const currentDayIndex = new Date().getDay();
  const currentDayString = currentDayIndex === 0 ? "SUNDAY" : DAYS[currentDayIndex - 1];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await getTeacherTimetable();
      setTimetable(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique, sorted time slots from the data
  const timeSlots = [
    ...new Set(timetable.map((item) => `${item.startTime} - ${item.endTime}`)),
  ].sort((a, b) => {
    const [startA] = a.split(" - ");
    const [startB] = b.split(" - ");
    return startA.localeCompare(startB);
  });

  return (
    <DashboardLayout role="TEACHER">
      <main className="w-full  mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              My Timetable
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Your weekly teaching schedule and class assignments across all batches.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-card border border-border-custom rounded-3xl shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Loading your schedule...</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border-custom bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[1000px] border-collapse relative">
                
                {/* TABLE HEAD: TIME SLOTS AS COLUMNS */}
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-5 text-left text-xs font-extrabold text-muted-foreground uppercase tracking-wider border-b border-r border-border-custom w-48 bg-muted/80 backdrop-blur-sm sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                      Day
                    </th>
                    {timeSlots.map((slot) => {
                      const [rawStart, rawEnd] = slot.split(" - ");
                      const displaySlot = `${formatTime(rawStart)} - ${formatTime(rawEnd)}`;
                      return (
                        <th key={slot} className="p-5 text-left text-xs font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border-custom min-w-[200px] whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock3 className="w-4 h-4 text-primary" />
                            {displaySlot}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* TABLE BODY: DAYS AS ROWS */}
                <tbody>
                  {DAYS.map((day, rowIndex) => {
                    const isToday = day === currentDayString;
                    // Determine vertical tooltip drop direction (if bottom half of the table, drop UP)
                    const isBottomHalf = rowIndex >= 3;

                    return (
                      <tr key={day} className={`group/row transition-colors ${isToday ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                        
                        {/* Day Column (Sticky) */}
                        <td className={`p-5 text-sm font-bold border-b border-r border-border-custom sticky left-0 z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] transition-colors ${isToday ? 'bg-primary/5 text-primary' : 'bg-card text-foreground group-hover/row:bg-muted/10'}`}>
                          <div className="flex items-center justify-between gap-3">
                            {day}
                            {isToday && (
                              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[9px] tracking-widest uppercase shadow-sm">
                                TODAY
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Time Slot Columns */}
                        {timeSlots.map((slot, colIndex) => {
                          const entry = timetable.find(
                            (item) => item.dayOfWeek === day && `${item.startTime} - ${item.endTime}` === slot
                          );

                          // Determine horizontal tooltip alignment to prevent screen clipping
                          const isFirstCol = colIndex === 0;
                          const isLastCol = colIndex === timeSlots.length - 1 && timeSlots.length > 1;

                          const horizontalPosition = isFirstCol ? "left-0" : isLastCol ? "right-0" : "left-1/2 -translate-x-1/2";
                          const arrowPosition = isFirstCol ? "left-6" : isLastCol ? "right-6" : "left-1/2 -translate-x-1/2";

                          return (
                            <td key={slot} className="p-3 border-b border-border-custom align-top relative">
                              {entry ? (
                                <div className="group/card relative">
                                  
                                  {/* Compact Cell Content */}
                                  <div className="p-4 rounded-2xl bg-card border border-border-custom hover:border-primary/30 hover:bg-primary/5 transition-all hover:shadow-sm cursor-default h-full flex flex-col justify-between min-h-[100px]">
                                    <div>
                                      <p className="font-bold text-sm text-foreground line-clamp-2 leading-tight">
                                        {entry.subject}
                                      </p>
                                      <p className="text-xs font-semibold text-primary mt-1.5 truncate">
                                        {entry.batch?.name}
                                      </p>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border-custom text-xs font-medium text-muted-foreground">
                                      <div className="flex items-center gap-1.5 truncate">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{entry.roomNumber || "TBD"}</span>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-md bg-muted border border-border-custom text-[10px] uppercase tracking-wider shrink-0 shadow-sm">
                                        {entry.mode}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Hover Tooltip Overlay (Dynamically Positioned) */}
                                  <div className={`absolute z-[100] hidden group-hover/card:block w-64 pointer-events-none animate-in fade-in duration-200 ${horizontalPosition} ${isBottomHalf ? 'bottom-full mb-3 slide-in-from-bottom-2' : 'top-full mt-3 slide-in-from-top-2'}`}>
                                    <div className="bg-card border border-border-custom shadow-2xl rounded-2xl p-5 relative">
                                      <p className="font-bold text-base text-foreground leading-tight">
                                        {entry.subject}
                                      </p>
                                      <p className="text-primary text-sm font-semibold mt-1">
                                        {entry.batch?.name}
                                      </p>
                                      
                                      <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                                        <div className="flex items-start gap-2.5">
                                          <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                                          <span className="leading-snug">{entry.course?.title || "No course specified"}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                          <Users className="w-4 h-4 shrink-0" />
                                          Room: <span className="text-foreground font-medium">{entry.roomNumber || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                          <CalendarDays className="w-4 h-4 shrink-0" />
                                          {entry.dayOfWeek}
                                        </div>
                                      </div>

                                      <div className="mt-4 pt-4 border-t border-border-custom flex items-center justify-between">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${entry.mode?.toLowerCase() === 'online' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                          {entry.mode}
                                        </span>
                                      </div>

                                      {/* Dynamic Tooltip Arrow */}
                                      <div className={`absolute w-3 h-3 rotate-45 bg-card border-border-custom ${arrowPosition} ${isBottomHalf ? 'top-full -mt-1.5 border-b border-r' : 'bottom-full -mb-1.5 border-t border-l'}`} />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full min-h-[100px] rounded-2xl border border-dashed border-border-custom/50 flex items-center justify-center bg-muted/10">
                                  <span className="text-muted-foreground/30 text-xs font-medium">—</span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {timeSlots.length === 0 && (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarDays className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No Schedule Found</h3>
                  <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                    You currently do not have any classes assigned to your timetable for this week.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
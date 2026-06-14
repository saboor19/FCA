"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ArrowRight,
  CalendarDays,
  ShieldAlert,
  BookOpen,
  Megaphone,
  BellOff
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTeacherNotices } from "@/services/teacher/noticeService";

export default function TeacherNoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getTeacherNotices();
      setNotices(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
      default:
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "URGENT":
        return <ShieldAlert className="w-6 h-6 text-red-500 dark:text-red-400" />;
      case "ACADEMIC":
        return <BookOpen className="w-6 h-6 text-primary" />;
      default:
        return <Megaphone className="w-6 h-6 text-accent" />;
    }
  };

  return (
    <DashboardLayout role="TEACHER">
      <main className="w-full max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Announcements</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Stay updated with academic schedules, urgent alerts, and important institutional updates.
            </p>
          </div>

          <div className="px-5 py-3.5 rounded-2xl border border-border-custom bg-card shadow-sm flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Notices</p>
              <p className="text-xl font-bold text-foreground leading-none mt-1">{notices.length}</p>
            </div>
          </div>
        </header>

        {/* LIST SECTION */}
        <section className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-sm">
          {loading ? (
            // SKELETON LOADER
            <div className="divide-y divide-border-custom">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 flex flex-col lg:flex-row gap-5 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-muted shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-1/3 h-5 bg-muted rounded-md" />
                      <div className="w-16 h-5 bg-muted rounded-full" />
                    </div>
                    <div className="w-full h-3 bg-muted rounded-md" />
                    <div className="w-2/3 h-3 bg-muted rounded-md" />
                    <div className="flex gap-4 pt-2">
                      <div className="w-24 h-3 bg-muted rounded-md" />
                      <div className="w-32 h-3 bg-muted rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notices.length > 0 ? (
            // DATA LIST
            <div className="divide-y divide-border-custom">
              {notices.map((notice) => {
                // Note: Kept your original read logic intact
                const isRead = notice.readBy?.some((item) => item.user === notice.user);

                return (
                  <Link
                    key={notice._id}
                    href={`/teacher/notices/${notice._id}`}
                    className="block p-5 sm:p-6 hover:bg-muted transition-colors group relative"
                  >
                    {/* Unread Indicator Bar */}
                    {!isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                      
                      {/* CONTENT LEFT */}
                      <div className="flex items-start gap-4 sm:gap-5 flex-1">
                        {/* Icon Box */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-border-custom bg-background`}>
                          {getTypeIcon(notice.type)}
                        </div>

                        <div className="flex-1">
                          {/* Title & Badges */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                              {notice.title}
                            </h2>
                            <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold tracking-wide uppercase ${getPriorityStyles(notice.priority)}`}>
                              {notice.priority}
                            </span>
                            {!isRead && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-primary/10 text-primary border border-primary/20 animate-pulse">
                                New
                              </span>
                            )}
                          </div>

                          {/* Description Snippet */}
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2 max-w-3xl">
                            {notice.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                              {new Date(notice.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <span className="opacity-70">Published by:</span>
                              <span className="text-foreground">{notice.publishedBy?.fullName || "Admin"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CALL TO ACTION RIGHT */}
                      <div className="flex items-center gap-1.5 text-primary text-sm font-semibold pt-4 lg:pt-0 mt-4 lg:mt-0 border-t border-border-custom lg:border-none shrink-0 group-hover:translate-x-1 transition-transform">
                        Read full notice
                        <ArrowRight className="w-4 h-4" />
                      </div>

                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            // EMPTY STATE
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-5">
                <BellOff className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-foreground">All Caught Up!</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                There are currently no active announcements or notices requiring your attention.
              </p>
            </div>
          )}
        </section>
      </main>
    </DashboardLayout>
  );
}
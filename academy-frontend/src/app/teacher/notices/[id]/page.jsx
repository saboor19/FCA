"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ShieldAlert,
  BookOpen,
  Megaphone,
  ArrowLeft,
  Eye,
  Paperclip,
  CheckCircle2,
  BellOff,
  ExternalLink
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getTeacherNoticeById, markNoticeAsRead } from "@/services/teacher/noticeService";

export default function TeacherNoticeDetailsPage() {
  const params = useParams();
  const noticeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      
      // Fetch Notice
      const response = await getTeacherNoticeById(noticeId);
      setNotice(response.data);

      // Mark as read in the background
      await markNoticeAsRead(noticeId);
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
        return <ShieldAlert className="w-8 h-8 text-red-500 dark:text-red-400" />;
      case "ACADEMIC":
        return <BookOpen className="w-8 h-8 text-primary" />;
      default:
        return <Megaphone className="w-8 h-8 text-accent" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="TEACHER">
        <main className="w-full max-w-4xl mx-auto space-y-6 pb-12">
          {/* Skeleton Back Button */}
          <div className="w-32 h-5 bg-muted rounded animate-pulse mb-6" />
          
          {/* Skeleton Hero */}
          <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 animate-pulse shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-muted shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="flex gap-3">
                <div className="w-20 h-6 bg-muted rounded-full" />
                <div className="w-24 h-6 bg-muted rounded-full" />
              </div>
              <div className="w-3/4 h-10 bg-muted rounded-md" />
              <div className="flex gap-4 pt-4">
                <div className="w-32 h-4 bg-muted rounded-md" />
                <div className="w-24 h-4 bg-muted rounded-md" />
              </div>
            </div>
          </div>

          {/* Skeleton Content */}
          <div className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 space-y-4 animate-pulse shadow-sm">
            <div className="w-full h-4 bg-muted rounded-md" />
            <div className="w-full h-4 bg-muted rounded-md" />
            <div className="w-5/6 h-4 bg-muted rounded-md" />
            <div className="w-4/6 h-4 bg-muted rounded-md" />
          </div>
        </main>
      </DashboardLayout>
    );
  }

  if (!notice) {
    return (
      <DashboardLayout role="TEACHER">
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <BellOff className="w-8 h-8 text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Notice Not Found</h2>
          <p className="text-muted-foreground mt-2 max-w-sm mb-8">
            The announcement you are looking for has been removed or is unavailable.
          </p>
          <Link href="/teacher/notices" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium shadow-sm transition-all">
            Return to Notices
          </Link>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="TEACHER">
      <main className="w-full max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
        
        {/* BACK NAVIGATION */}
        <nav>
          <Link 
            href="/teacher/notices" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Announcements
          </Link>
        </nav>

        {/* HERO SECTION */}
        <section className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-8">
          
          {/* Subtle Background Glow based on type */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 relative z-10 w-full">
            {/* Icon Block */}
            <div className="w-16 h-16 rounded-2xl border border-border-custom bg-background flex items-center justify-center shrink-0 shadow-sm">
              {getTypeIcon(notice.type)}
            </div>

            <div className="flex-1 w-full">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${getPriorityStyles(notice.priority)}`}>
                  {notice.priority}
                </span>
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border-custom text-xs font-bold tracking-wide uppercase">
                  {notice.type}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-4 leading-tight">
                {notice.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-y-3 gap-x-6 mt-6 pt-5 border-t border-border-custom/50 text-sm font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 opacity-70" />
                  {new Date(notice.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 opacity-70" />
                  {notice.views || 0} views
                </div>

                <div className="flex items-center gap-2">
                  <span className="opacity-70">Published By:</span>
                  <span className="text-foreground">{notice.publishedBy?.fullName || "System Admin"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Read Status Badge */}
          <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-sm font-semibold flex items-center gap-2 h-fit shrink-0 relative z-10">
            <CheckCircle2 className="w-4 h-4" />
            Read
          </div>
        </section>

        {/* DESCRIPTION CONTENT */}
        <section className="bg-card border border-border-custom rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-custom">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Notice Details</h2>
          </div>
          
          <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-none">
            {notice.description}
          </div>
        </section>

        {/* ATTACHMENTS (If Any) */}
        {notice.attachments?.length > 0 && (
          <section className="bg-card border border-border-custom rounded-3xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-border-custom bg-muted/30 flex items-center gap-3">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-bold text-foreground">Attachments</h2>
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-muted border border-border-custom text-xs font-semibold text-muted-foreground">
                {notice.attachments.length}
              </span>
            </div>

            <div className="divide-y divide-border-custom">
              {notice.attachments.map((file, index) => (
                <a
                  key={index}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border-custom flex items-center justify-center group-hover:border-primary/30 transition-colors">
                      <Paperclip className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {file.fileName || `Attachment ${index + 1}`}
                    </span>
                  </div>

                  <span className="text-sm text-primary font-semibold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                    Open File
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

      </main>
    </DashboardLayout>
  );
}
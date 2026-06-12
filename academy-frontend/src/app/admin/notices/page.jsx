"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  Eye,
  CalendarDays,
  Megaphone,
  Paperclip,
  Users,
  AlertCircle,
  FileText
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";
import { getNotices } from "@/services/admin/noticeService"; // Note the updated import path

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getNotices();
      setNotices(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to color-code Priority
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "HIGH":
        return {
          icon: <AlertCircle size={14} />,
          classes: "bg-red-50 border-red-200 text-red-700 dark:bg-red-400/10 dark:border-red-400/20 dark:text-red-400"
        };
      case "MEDIUM":
        return {
          icon: null,
          classes: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-400/10 dark:border-amber-400/20 dark:text-amber-400"
        };
      default: // LOW
        return {
          icon: null,
          classes: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-400/10 dark:border-emerald-400/20 dark:text-emerald-400"
        };
    }
  };

  // Helper to color-code Type
  const getTypeClasses = (type) => {
    switch (type) {
      case "EXAM":
      case "ACADEMIC":
        return "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400";
      case "URGENT":
      case "FEE":
        return "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400";
      case "HOLIDAY":
      case "EVENT":
        return "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400";
      default: // GENERAL
        return "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300";
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Loading Announcements..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-foreground">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Bell size={24} />
              </div>
              Notices & Announcements
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Broadcast critical information to students, teachers, and staff.
            </p>
          </div>

          <Link
            href="/admin/notices/create"
            className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm shrink-0"
          >
            <Plus size={18} />
            Create Notice
          </Link>
        </div>

        {/* CONTENT FEED */}
        <div className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden">
          {notices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4 text-slate-400 border border-border-custom">
                <Megaphone size={32} />
              </div>
              <h3 className="text-lg font-medium text-foreground">No Notices Published</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Keep everyone informed by publishing your first academy notice.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-custom">
              {notices.map((notice) => {
                const priorityConfig = getPriorityConfig(notice.priority);
                // Use publishDate if available, fallback to createdAt
                const displayDate = notice.publishDate || notice.createdAt;

                return (
                  <div
                    key={notice._id}
                    className="p-5 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      {/* MAIN INFO */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          
                          {/* DRAFT BADGE */}
                          {!notice.isPublished && (
                            <span className="px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider bg-slate-200 border-slate-300 text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300">
                              DRAFT
                            </span>
                          )}

                          {/* TYPE BADGE */}
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${getTypeClasses(notice.type)}`}>
                            {notice.type || "GENERAL"}
                          </span>

                          {/* PRIORITY BADGE */}
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${priorityConfig.classes}`}>
                            {priorityConfig.icon}
                            {notice.priority || "MEDIUM"}
                          </span>
                        </div>

                        <h2 className="font-semibold text-lg text-foreground group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                          {notice.title}
                        </h2>

                        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed max-w-4xl">
                          {notice.description}
                        </p>

                        {/* META DATA ROW */}
                        <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400 pt-2">
                          
                          <div className="flex items-center gap-1.5" title="Publish Date">
                            <CalendarDays size={16} className="text-slate-400" />
                            {new Date(displayDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>

                          <div className="flex items-center gap-1.5" title="Target Audience">
                            <Users size={16} className="text-slate-400" />
                            <span className="capitalize">{notice.targetAudience?.toLowerCase() || "All"}</span>
                          </div>

                          <div className="flex items-center gap-1.5" title="Views">
                            <Eye size={16} className="text-slate-400" />
                            {notice.views || 0}
                          </div>

                          {notice.attachments?.length > 0 && (
                            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                              <Paperclip size={16} />
                              {notice.attachments.length} Attachment(s)
                            </div>
                          )}

                        </div>
                      </div>

                      {/* ACTION BUTTON */}
                      <div className="hidden md:flex flex-col items-end shrink-0 pl-4">
                        <Link
                           href={`/admin/notices/${notice._id}`}
                           className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-border-custom bg-card"
                        >
                           <FileText size={16} />
                           View Details
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
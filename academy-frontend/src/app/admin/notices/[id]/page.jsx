"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Paperclip,
  Users,
  AlertCircle,
  Pencil,
  Trash2,
  Megaphone,
  CheckCircle2,
  Clock
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";

// Fixed the import to ensure we use the singular getNotice
import { getNotice, deleteNotice } from "@/services/admin/noticeService"; 

export default function NoticeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // Make sure your folder is named exactly [id] in Next.js (e.g., app/admin/notices/[id]/page.jsx)
  const noticeId = params.id;

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (noticeId) {
      fetchNoticeDetails();
    }
  }, [noticeId]);

  const fetchNoticeDetails = async () => {
    try {
      setLoading(true);
      // BUG FIX: Changed getNotices() to getNotice()
      const response = await getNotice(noticeId); 
      setNotice(response.data);
    } catch (error) {
      console.error("Failed to fetch notice", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this notice? This action cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteNotice(noticeId);
      router.push("/admin/notices");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete notice");
    }
  };

  // Helper to color-code Priority
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "HIGH":
        return {
          icon: <AlertCircle size={16} />,
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
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
      case "URGENT":
      case "FEE":
        return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";
      case "HOLIDAY":
      case "EVENT":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      default: // GENERAL
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Loading Notice Details..." />
      </DashboardLayout>
    );
  }

  if (!notice) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-foreground">Notice Not Found</h2>
          <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">Go Back</button>
        </div>
      </DashboardLayout>
    );
  }

  const priorityConfig = getPriorityConfig(notice.priority);

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        
        {/* BACK BUTTON & ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Notices
          </button>

          <div className="flex items-center gap-3">
            <Link
              href={`/admin/notices/${notice._id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors border border-border-custom shadow-sm"
            >
              <Pencil size={16} />
              Edit Notice
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* MAIN CONTENT CARD */}
        <div className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden">
          
          {/* Notice Header */}
          <div className="p-6 md:p-8 border-b border-border-custom bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {!notice.isPublished ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  <Clock size={12} /> DRAFT
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 size={12} /> PUBLISHED
                </span>
              )}
              
              <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${getTypeClasses(notice.type)}`}>
                {notice.type || "GENERAL"}
              </span>

              <span className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-bold uppercase tracking-wider ${priorityConfig.classes}`}>
                {priorityConfig.icon}
                {notice.priority || "MEDIUM"} PRIORITY
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              {notice.title}
            </h1>
          </div>

          {/* Notice Body */}
          <div className="p-6 md:p-8">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
              Message Content
            </h3>
            <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {notice.description}
            </div>
          </div>
        </div>

        {/* META & ATTACHMENTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Notice Meta Data */}
          <div className="md:col-span-2 bg-card border border-border-custom rounded-2xl shadow-sm p-6">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Megaphone size={16} /> Announcement Details
            </h3>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Target Audience</p>
                <p className="font-medium text-foreground capitalize flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" />
                  {notice.targetAudience?.toLowerCase() || "All"}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Views</p>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Eye size={16} className="text-emerald-500" />
                  {notice.views || 0} Views
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Publish Date</p>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <CalendarDays size={16} className="text-slate-400" />
                  {new Date(notice.publishDate || notice.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Expiry Date</p>
                <p className="font-medium text-foreground flex items-center gap-2">
                  <CalendarDays size={16} className="text-slate-400" />
                  {notice.expiryDate ? new Date(notice.expiryDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : "No Expiry"}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-card border border-border-custom rounded-2xl shadow-sm p-6">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Paperclip size={16} /> Attachments
            </h3>
            
            {notice.attachments && notice.attachments.length > 0 ? (
              <ul className="space-y-3">
                {notice.attachments.map((file, index) => (
                  <li key={index}>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl border border-border-custom bg-slate-50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
                        <Paperclip size={16} />
                      </div>
                      <span className="text-sm font-medium text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                        {file.fileName || `Attachment ${index + 1}`}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-border-custom rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                <Paperclip className="text-slate-300 dark:text-slate-600 mb-2" size={24} />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No files attached.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
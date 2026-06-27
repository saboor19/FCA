"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getNotice } from "@/services/student/noticeService";
import NoticePdfButton from "@/components/common/NoticePdfButton";
import { downloadNoticePdf } from "@/services/student/noticeService";

import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  Pin,
  Download,
  FileText,
  File,
  Image as ImageIcon,
  ExternalLink,
  User,
  Tag,
  Sparkles,
} from "lucide-react";

export default function NoticeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotice();
  }, [params.id]);

  const loadNotice = async () => {
    try {
      setLoading(true);
      const response = await getNotice(params.id);
      setNotice(response.notice);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      HIGH: {
        icon: AlertTriangle,
        color: "text-[var(--destructive)]",
        bg: "bg-[var(--destructive)]/10",
        border: "border-[var(--destructive)]/20",
        label: "High Priority",
      },
      MEDIUM: {
        icon: Info,
        color: "text-[var(--accent)]",
        bg: "bg-[var(--accent)]/10",
        border: "border-[var(--accent)]/20",
        label: "Medium Priority",
      },
      LOW: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        label: "Low Priority",
      },
    };
    return configs[priority] || configs.LOW;
  };

  const getTypeConfig = (type) => {
    const configs = {
      ACADEMIC: {
        icon: FileText,
        label: "Academic",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
      },
      EVENT: {
        icon: Sparkles,
        label: "Event",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
      },
      GENERAL: {
        icon: Info,
        label: "General",
        color: "text-[var(--muted-foreground)]",
        bg: "bg-[var(--muted)]",
      },
      URGENT: {
        icon: AlertTriangle,
        label: "Urgent",
        color: "text-[var(--destructive)]",
        bg: "bg-[var(--destructive)]/10",
      },
    };
    return configs[type] || configs.GENERAL;
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
      return ImageIcon;
    if (["pdf"].includes(ext)) return FileText;
    return File;
  };

  if (loading) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-[var(--muted)] rounded-lg w-32" />
            <div className="h-10 bg-[var(--muted)] rounded-xl w-3/4" />
            <div className="h-4 bg-[var(--muted)] rounded-lg w-48" />
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 space-y-4">
              <div className="h-4 bg-[var(--muted)] rounded-lg w-full" />
              <div className="h-4 bg-[var(--muted)] rounded-lg w-5/6" />
              <div className="h-4 bg-[var(--muted)] rounded-lg w-4/6" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!notice) {
    return (
      <DashboardLayout role="STUDENT">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-5">
              <Bell className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              Notice not found
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-6">
              The notice you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/student/notices")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium
                hover:bg-[var(--primary-hover)] transition-colors duration-200 shadow-md shadow-[var(--primary)]/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Notices
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const priorityConfig = getPriorityConfig(notice.priority);
  const PriorityIcon = priorityConfig.icon;
  const typeConfig = getTypeConfig(notice.type);
  const TypeIcon = typeConfig.icon;

  const publishDate = new Date(notice.publishDate);
  const formattedDate = publishDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = publishDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <DashboardLayout role="STUDENT">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Navigation */}
        <button
          onClick={() => router.push("/student/notices")}
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] 
            transition-colors duration-200 group"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-[var(--muted)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to Notices
        </button>

        {/* Main Card */}
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          {/* Header Banner */}
          <div className="relative px-8 pt-8 pb-6">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-[var(--primary)] opacity-60" />

            <div className="flex flex-wrap items-start gap-3 mb-4">
              {notice.isPinned && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold border border-[var(--accent)]/20">
                  <Pin className="w-3.5 h-3.5" />
                  Pinned Notice
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${priorityConfig.bg} ${priorityConfig.color} ${priorityConfig.border}`}
              >
                <PriorityIcon className="w-3.5 h-3.5" />
                {priorityConfig.label}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${typeConfig.bg} ${typeConfig.color}`}
              >
                <TypeIcon className="w-3.5 h-3.5" />
                {typeConfig.label}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] leading-tight tracking-tight">
              {notice.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                <div className="p-1.5 rounded-lg bg-[var(--muted)]">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                <div className="p-1.5 rounded-lg bg-[var(--muted)]">
                  <Clock className="w-4 h-4" />
                </div>
                <span>{formattedTime}</span>
              </div>
              {notice.author && (
                <div className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
                  <div className="p-1.5 rounded-lg bg-[var(--muted)]">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{notice.author}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Body — RICH TEXT HTML RENDERED */}
          <div className="px-8 pb-8">
            <div className="rounded-xl bg-[var(--muted)]/50 p-6 sm:p-8 border border-[var(--border)]">
              {/* 
                KEY CHANGE: dangerouslySetInnerHTML renders the HTML properly.
                prose classes style headings, lists, links, blockquotes, code, etc.
                Removed whitespace-pre-wrap since HTML handles its own spacing.
              */}
              <div
                className="prose prose-slate dark:prose-invert max-w-none
                  prose-headings:font-semibold prose-headings:text-[var(--foreground)]
                  prose-p:text-[var(--foreground)] prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
                  prose-a:text-[var(--primary)] prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-[var(--foreground)] prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:pl-5
                  prose-ol:list-decimal prose-ol:pl-5
                  prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)] prose-blockquote:bg-[var(--muted)]/30 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-code:bg-[var(--muted)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-[var(--muted)] prose-pre:rounded-xl prose-pre:p-4"
                dangerouslySetInnerHTML={{
                  __html: notice.description || "<p>No content provided.</p>",
                }}
              />
            </div>

            {/* Attachments */}
            {notice.attachments?.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[var(--primary)]" />
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    Attachments
                  </h3>
                  <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-0.5 rounded-full">
                    {notice.attachments.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {notice.attachments.map((file, index) => {
                    const FileIcon = getFileIcon(file.fileName);
                    return (
                      <a
                        key={index}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]
                          hover:border-[var(--primary)]/30 hover:shadow-md transition-all duration-200"
                      >
                        <div className="p-3 rounded-xl bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20 transition-colors">
                          <FileIcon className="w-6 h-6 text-[var(--primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--foreground)] truncate group-hover:text-[var(--primary)] transition-colors">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                            Click to view
                          </p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-[var(--primary)]" />
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </article>

        <NoticePdfButton
          noticeId={notice._id}
          fileName={`${notice.title}.pdf`}
          downloadFunction={downloadNoticePdf}
        />

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => router.push("/student/notices")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)]
              text-sm font-medium text-[var(--foreground)] hover:border-[var(--primary)]/30 hover:shadow-sm transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            All Notices
          </button>

          {notice.attachments?.length > 0 && (
            <button
              onClick={() => {
                notice.attachments.forEach((file) =>
                  window.open(file.fileUrl, "_blank")
                );
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium
                hover:bg-[var(--primary-hover)] transition-colors duration-200 shadow-md shadow-[var(--primary)]/20"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
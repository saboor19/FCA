"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Pin,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Sparkles
} from "lucide-react";
import { getNotices } from "@/services/student/noticeService";

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL, UNREAD, PINNED

  useEffect(() => {
    loadNotices();
  }, [page]);

  const loadNotices = async () => {
    try {
      setLoading(true);
      const response = await getNotices(page);
      setNotices(response.notices || []);
      setPagination(response.pagination);
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
        label: "High Priority"
      },
      MEDIUM: {
        icon: Info,
        color: "text-[var(--accent)]",
        bg: "bg-[var(--accent)]/10",
        border: "border-[var(--accent)]/20",
        label: "Medium Priority"
      },
      LOW: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        label: "Low Priority"
      }
    };
    return configs[priority] || configs.LOW;
  };

  const getTypeIcon = (type) => {
    const types = {
      ACADEMIC: FileText,
      EVENT: Sparkles,
      GENERAL: Info,
      URGENT: AlertTriangle
    };
    return types[type] || Info;
  };

  const filteredNotices = notices.filter((notice) => {
    if (filter === "UNREAD") return !notice.isRead;
    if (filter === "PINNED") return notice.isPinned;
    return true;
  });

  const unreadCount = notices.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout role="STUDENT">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-[var(--primary)]/10">
                <Bell className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
                Notices
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] text-xs font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-[var(--muted-foreground)] text-sm ml-[52px]">
              Stay updated with the latest announcements and important updates
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--muted)] w-fit">
          {[
            { key: "ALL", label: "All Notices", count: notices.length },
            { key: "UNREAD", label: "Unread", count: unreadCount },
            { key: "PINNED", label: "Pinned", count: notices.filter((n) => n.isPinned).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === tab.key
                  ? "bg-[var(--card)] text-[var(--primary)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-1.5 text-xs ${
                    filter === tab.key ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                  }`}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--muted)]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-[var(--muted)] rounded-lg w-3/4" />
                    <div className="h-4 bg-[var(--muted)] rounded-lg w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-5">
              <Bell className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
              No notices found
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {filter === "ALL"
                ? "There are no announcements at the moment."
                : filter === "UNREAD"
                ? "You've read all notices. Great job!"
                : "No pinned notices available."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotices.map((notice, index) => {
              const priorityConfig = getPriorityConfig(notice.priority);
              const PriorityIcon = priorityConfig.icon;
              const TypeIcon = getTypeIcon(notice.type);
              const isNew = !notice.isRead;

              return (
                <div
                  key={notice._id}
                  onClick={() => router.push(`/student/notices/${notice._id}`)}
                  className={`group relative rounded-2xl border bg-[var(--card)] p-6 cursor-pointer
                    transition-all duration-300 ease-out
                    hover:shadow-lg hover:-translate-y-0.5 hover:border-[var(--primary)]/30
                    ${isNew ? "border-[var(--primary)]/20 shadow-sm" : "border-[var(--border)]"}
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Unread indicator stripe */}
                  {isNew && (
                    <div className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-[var(--primary)]" />
                  )}

                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div
                      className={`p-3 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        isNew ? "bg-[var(--primary)]/10" : "bg-[var(--muted)]"
                      }`}
                    >
                      <TypeIcon
                        className={`w-5 h-5 ${isNew ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {notice.isPinned && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold">
                                <Pin className="w-3 h-3" />
                                Pinned
                              </span>
                            )}
                            <h3
                              className={`text-lg font-semibold leading-tight ${
                                isNew ? "text-[var(--foreground)]" : "text-[var(--foreground)]/80"
                              }`}
                            >
                              {notice.title}
                            </h3>
                          </div>
                          <p className="text-sm text-[var(--muted-foreground)] mt-1.5 line-clamp-2">
                            {notice.description?.substring(0, 150)}
                            {notice.description?.length > 150 ? "..." : ""}
                          </p>
                        </div>

                        {/* Unread dot */}
                        {isNew && (
                          <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[var(--primary)] mt-2 animate-pulse" />
                        )}
                      </div>

                      {/* Footer meta */}
                      <div className="flex items-center gap-4 mt-4 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color} ${priorityConfig.border} border`}
                        >
                          <PriorityIcon className="w-3.5 h-3.5" />
                          {priorityConfig.label}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(notice.publishDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>

                        {notice.type && (
                          <span className="text-xs text-[var(--muted-foreground)] capitalize">
                            {notice.type.toLowerCase()}
                          </span>
                        )}

                        <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Read more
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)]
                text-sm font-medium text-[var(--foreground)] transition-all duration-200
                hover:border-[var(--primary)]/30 hover:shadow-sm
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--border)]"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    page === p
                      ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages))}
              disabled={page === pagination.pages}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)]
                text-sm font-medium text-[var(--foreground)] transition-all duration-200
                hover:border-[var(--primary)]/30 hover:shadow-sm
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--border)]"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
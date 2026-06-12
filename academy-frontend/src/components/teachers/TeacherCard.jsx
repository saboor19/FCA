"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, User, Briefcase, Mail } from "lucide-react";

export default function TeacherCard({ teacher, onDelete }) {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(teacher._id);
  };

  const fullName = teacher.userId?.fullName || "Unknown";
  const email = teacher.userId?.email || "No email";
  const employeeId = teacher.employeeId || "N/A";
  const specialization = teacher.specialization || "Not specified";
  const isActive = teacher.userId?.isActive ?? true;

  return (
    <div className="group relative bg-card border border-border-custom rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Entire card is clickable (except buttons) */}
      <Link href={`/admin/teachers/${teacher._id}`} className="block">
        <div className="p-5">
          {/* Header with avatar + name */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <User size={24} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground line-clamp-1">
                  {fullName}
                </h3>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Briefcase size={14} />
                  <span>{employeeId}</span>
                </div>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-400/10 dark:text-green-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-3">
            <Mail size={14} className="text-slate-400" />
            <span className="truncate">{email}</span>
          </div>

          {/* Specialization */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Specialization</p>
            <p className="text-sm font-medium text-foreground">{specialization}</p>
          </div>

          {/* Action buttons (visible on hover / always on mobile) */}
          <div className="flex items-center justify-end gap-1 pt-2 border-t border-border-custom opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <Link
              href={`/admin/teachers/${teacher._id}`}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="View Details"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={18} />
            </Link>
            <Link
              href={`/admin/teachers/edit/${teacher._id}`}
              className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
              title="Edit Teacher"
              onClick={(e) => e.stopPropagation()}
            >
              <Pencil size={18} />
            </Link>
            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
              title="Deactivate Teacher"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
"use client";

import Link from "next/link";
import { Trash2, Pencil, Phone, User, Shield, Hash, Eye } from "lucide-react";

export default function StudentCard({ student, onDelete }) {
  return (
    <div className="group bg-card border border-border-custom rounded-3xl p-6 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
      
      {/* Premium Header: Avatar & Name */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-indigo-500/10 dark:to-slate-800 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/30 mb-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
          <User size={36} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        
        <h3 className="font-semibold text-foreground text-xl tracking-tight mb-1">
          {student.userId?.fullName || "Unknown Student"}
        </h3>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs text-slate-500 dark:text-slate-400">
          <Hash size={14} />
          <span className="font-mono font-medium text-green-700 dark:text-green-500">
            {student.enrollmentNo || "N/A"}
          </span>
        </div>
      </div>

      {/* Body: Key Details - Clean & Spacious */}
      <div className="space-y-4 mb-8 flex-1 px-1">
        <div className="flex items-center gap-4 text-sm">
          <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Phone size={18} className="text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wider">PHONE</p>
            <p className="font-medium text-foreground truncate">
              {student.phone || "No phone provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Shield size={18} className="text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wider">GUARDIAN</p>
            <p className="font-medium text-foreground truncate">
              {student.guardianName || "No guardian info"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Actions - Premium minimal buttons */}
      <div className="flex items-center justify-between pt-5 border-t border-border-custom mt-auto">
        <Link
          href={`/admin/students/${student._id}`}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl transition-all active:scale-95"
          title="View Profile"
        >
          <Eye size={18} />
          <span>View</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/students/${student._id}/edit`}
            className="p-3 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-2xl transition-all active:scale-95"
            title="Edit Student"
          >
            <Pencil size={18} />
          </Link>

          <button
            onClick={() => onDelete(student._id)}
            className="p-3 text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all active:scale-95"
            title="Delete Student"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
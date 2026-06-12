"use client";

import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  Eye, 
  Pencil, 
  GraduationCap, 
  Laptop, 
  MapPin, 
  Layers 
} from "lucide-react";

export default function BatchCard({ batch }) {
  // Helper to visually distinguish study modes
  const getModeIcon = (mode) => {
    switch (mode) {
      case "ONLINE":
        return <Laptop size={16} className="text-blue-500" />;
      case "HYBRID":
        return <Layers size={16} className="text-purple-500" />;
      default: // OFFLINE
        return <MapPin size={16} className="text-emerald-500" />;
    }
  };

  return (
    <div className="group bg-card border border-border-custom rounded-2xl p-6 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      
      {/* Decorative top accent line based on status */}
      <div className={`absolute top-0 left-0 w-full h-1 ${batch.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />

      {/* Header: Identity & Status */}
      <div className="flex items-start justify-between gap-4 mb-6 mt-1">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-500/20 shadow-sm">
            <GraduationCap size={28} />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
              {batch.name}
            </h3>
            {/* Flattened className for hydration safety */}
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${batch.isActive ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-400/10 dark:border-emerald-400/20 dark:text-emerald-400" : "bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"}`}>
              {batch.isActive ? "Active Batch" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Body: Key Details - Changed bg to solid slate-50 for high contrast in light mode */}
      <div className="space-y-4 mb-6 flex-1 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-border-custom">
        
        {/* COURSE */}
        <div className="flex items-start gap-3">
          <BookOpen size={16} className="text-indigo-500 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Course</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1" title={batch.course?.title}>
              {batch.course?.title || "No Course Assigned"}
            </span>
          </div>
        </div>
        
        {/* STUDY MODE */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getModeIcon(batch.studyMode)}</div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Study Mode</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {batch.studyMode || "OFFLINE"}
            </span>
          </div>
        </div>

        {/* TEACHERS & CAPACITY GRID */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-custom mt-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Teachers</span>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <Users size={16} className="text-indigo-500" />
              {batch.teachers?.length || 0} Assigned
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Capacity</span>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <Users size={16} className="text-orange-500" />
              {batch.capacity} Seats
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-custom shrink-0">
        <Link
          href={`/admin/batches/${batch._id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20"
        >
          <Eye size={16} />
          View
        </Link>
        
        <Link
          href={`/admin/batches/edit/${batch._id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20"
        >
          <Pencil size={16} />
          Edit
        </Link>
      </div>
    </div>
  );
}
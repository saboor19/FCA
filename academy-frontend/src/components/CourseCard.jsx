"use client";

import Link from "next/link";
import { Trash2, BookOpen, Clock, IndianRupee } from "lucide-react";

export default function CourseCard({ course, onDelete }) {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(course._id);
  };

  return (
    <Link
      href={`/admin/courses/${course._id}`}
      className="group block bg-card border border-border-custom rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative">
        {/* Thumbnail or fallback */}
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-slate-400" />
          )}
        </div>

        {/* Delete button - top right */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/50"
          aria-label="Delete course"
        >
          <Trash2 size={18} className="text-red-500" />
        </button>

        {/* Level badge - top left */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
          {course.level?.charAt(0) + course.level?.slice(1).toLowerCase() || "Beginner"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
          {course.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={14} />
            <span>{course.duration || "—"}</span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <IndianRupee size={20} />
            <span>{course.price?.toLocaleString() || "0"}</span>
          </div>
        </div>

        {/* Module count */}
        <div className="mt-3 pt-3 border-t border-border-custom text-xs text-slate-400">
          {course.modules?.length || 0} module{course.modules?.length !== 1 ? "s" : ""}
        </div>
      </div>
    </Link>
  );
}
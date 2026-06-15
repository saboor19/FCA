"use client";

import Link from "next/link";

/* ─── Inline Icons ─── */
const Icons = {
  Mail: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Briefcase: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Pencil: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  User: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  GraduationCap: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  MapPin: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Calendar: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Award: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  BookOpen: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Clock: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  ExternalLink: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════
   TEACHER PROFILE CARD
   ═══════════════════════════════════════════ */
export default function TeacherProfileCard({ teacher }) {
  const imageUrl = teacher?.profileImage?.fileId
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${teacher.profileImage.fileId}`
    : null;

  const initials = teacher?.userId?.fullName
    ? teacher.userId.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const joinDate = teacher?.createdAt
    ? new Date(teacher.createdAt).toLocaleDateString(undefined, {
        month: "short",
        year: "numeric",
      })
    : null;

  const stats = [
    { label: "Courses", value: teacher?.courses?.length || 0, icon: Icons.BookOpen },
    { label: "Experience", value: teacher?.experience ? `${teacher.experience} yrs` : "—", icon: Icons.Clock },
    { label: "Rating", value: teacher?.rating ? `${teacher.rating}/5` : "—", icon: Icons.Award },
  ];

  return (
    <div className="group w-full max-w-sm overflow-hidden rounded-2xl border border-border-custom bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5">
      {/* ── Cover Banner ── */}
      <div className="relative h-28 w-full overflow-hidden bg-muted">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="h-full w-full" viewBox="0 0 400 112" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="var(--muted-foreground)" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-primary/5" />
        {/* Status indicator */}
        <div className="absolute right-4 top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>
      </div>

      {/* ── Profile Content ── */}
      <div className="relative flex flex-col items-center px-6 pb-6">
        {/* Avatar */}
        <div className="relative -mt-14">
          <div className="relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${teacher?.userId?.fullName || "Teacher"} Profile`}
                className="h-28 w-28 rounded-full border-4 border-card bg-muted object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`h-28 w-28 items-center justify-center rounded-full border-4 border-card bg-primary/10 text-2xl font-bold text-primary shadow-md ${imageUrl ? "hidden" : "flex"}`}
            >
              {initials}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-[3px] border-card bg-emerald-500" />
          </div>
        </div>

        {/* Name */}
        <h2 className="mt-4 text-center text-xl font-bold text-foreground">
          {teacher?.userId?.fullName || "Unknown Teacher"}
        </h2>

        {/* Specialization */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
            <Icons.Briefcase className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            {teacher?.specialization || "General Education"}
          </span>
        </div>

        {/* Bio / Short description */}
        {teacher?.bio && (
          <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {teacher.bio}
          </p>
        )}

        {/* Contact Info */}
        <div className="mt-4 w-full space-y-2">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
            <Icons.Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{teacher?.userId?.email || "No email provided"}</span>
          </div>
          {teacher?.phone && (
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
              <Icons.Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{teacher.phone}</span>
            </div>
          )}
          {teacher?.location && (
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
              <Icons.MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{teacher.location}</span>
            </div>
          )}
          {joinDate && (
            <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50">
              <Icons.Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>Joined {joinDate}</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center rounded-xl border border-border-custom bg-muted/30 px-2 py-3 transition-colors hover:bg-muted/50"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="mt-1 text-lg font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Qualification / Degree */}
        {teacher?.qualification && (
          <div className="mt-4 flex w-full items-center gap-2 rounded-xl border border-border-custom bg-muted/20 px-4 py-3">
            <Icons.GraduationCap className="h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Qualification</p>
              <p className="truncate text-sm font-medium text-foreground">{teacher.qualification}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex w-full gap-2">
          <Link
            href="/teacher/profile/edit"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98]"
          >
            <Icons.Pencil className="h-4 w-4" />
            Edit Profile
          </Link>
          <Link
            href="/teacher/profile"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-custom text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="View full profile"
            title="View full profile"
          >
            <Icons.ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
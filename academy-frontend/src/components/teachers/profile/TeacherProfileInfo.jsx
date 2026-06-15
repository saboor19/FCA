"use client";

/* ─── Inline Icons ─── */
const Icons = {
  IdCard: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M15 8h2" /><path d="M15 12h2" /><path d="M7 16h10" />
    </svg>
  ),
  GraduationCap: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  Briefcase: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Phone: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  MapPin: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  CalendarDays: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
      <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
    </svg>
  ),
  FileText: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  Mail: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Award: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Building: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" /><path d="M16 6h.01" />
      <path d="M8 10h.01" /><path d="M16 10h.01" />
      <path d="M8 14h.01" /><path d="M16 14h.01" />
    </svg>
  ),
  DollarSign: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  UserCheck: ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  ),
};

/* ─── Info Row Component ─── */
function InfoRow({ icon: Icon, label, value, highlight = false }) {
  const isEmpty = !value || value === "-" || value === "0 Years";
  return (
    <div className={`group flex items-start gap-3 rounded-xl p-3 transition-all ${highlight ? "bg-primary/5 border border-primary/10" : "hover:bg-muted/40"}`}>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-sm font-semibold ${isEmpty ? "text-muted-foreground italic" : "text-foreground"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TEACHER PROFILE INFO
   ═══════════════════════════════════════════ */
export default function TeacherProfileInfo({ teacher }) {
  const formattedDate = teacher?.joiningDate
    ? new Date(teacher.joiningDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

  const experienceText = teacher?.experience
    ? `${teacher.experience} Year${teacher.experience > 1 ? "s" : ""}`
    : "Not specified";

  const infoSections = [
    {
      title: "Professional Details",
      subtitle: "Work-related information and credentials",
      icon: Icons.Briefcase,
      items: [
        { icon: Icons.IdCard, label: "Employee ID", value: teacher?.employeeId || "-" },
        { icon: Icons.GraduationCap, label: "Qualification", value: teacher?.qualification || "-", highlight: !!teacher?.qualification },
        { icon: Icons.Briefcase, label: "Experience", value: experienceText },
        { icon: Icons.Award, label: "Specialization", value: teacher?.specialization || "-" },
        { icon: Icons.Building, label: "Department", value: teacher?.department || "-" },
        { icon: Icons.DollarSign, label: "Salary Grade", value: teacher?.salaryGrade || "-" },
      ],
    },
    {
      title: "Contact Information",
      subtitle: "Ways to reach this teacher",
      icon: Icons.Phone,
      items: [
        { icon: Icons.Mail, label: "Email", value: teacher?.userId?.email || "-" },
        { icon: Icons.Phone, label: "Phone", value: teacher?.phone || "-" },
        { icon: Icons.MapPin, label: "Address", value: teacher?.address || "-" },
        { icon: Icons.MapPin, label: "Location", value: teacher?.location || "-" },
      ],
    },
    {
      title: "Employment Timeline",
      subtitle: "Dates and status information",
      icon: Icons.CalendarDays,
      items: [
        { icon: Icons.CalendarDays, label: "Joining Date", value: formattedDate },
        { icon: Icons.UserCheck, label: "Employment Status", value: teacher?.status || "Active" },
        { icon: Icons.CalendarDays, label: "Last Updated", value: teacher?.updatedAt ? new Date(teacher.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "-" },
      ],
    },
  ];

  const hasBio = teacher?.bio && teacher.bio.trim().length > 0;

  return (
    <div className="w-full space-y-6">
      {/* ── Main Info Card ── */}
      <div className="rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8">
        <SectionHeader
          icon={Icons.IdCard}
          title="Professional Information"
          subtitle="Detailed academic and contact details"
        />

        {infoSections.map((section, sIdx) => (
          <div key={sIdx} className={sIdx > 0 ? "mt-8 pt-8 border-t border-border-custom" : ""}>
            <div className="mb-4 flex items-center gap-2">
              <section.icon className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{section.title}</h3>
              <span className="text-xs text-muted-foreground">— {section.subtitle}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, iIdx) => (
                <InfoRow
                  key={iIdx}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  highlight={item.highlight}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bio Card ── */}
      <div className="rounded-2xl border border-border-custom bg-card p-6 shadow-sm sm:p-8">
        <SectionHeader
          icon={Icons.FileText}
          title="Biography"
          subtitle="Professional background and teaching philosophy"
        />

        {hasBio ? (
          <div className="relative overflow-hidden rounded-xl border border-border-custom bg-muted/20">
            {/* Decorative quote mark */}
            <div className="absolute -left-2 -top-4 text-8xl font-serif text-primary/5 select-none">
              "
            </div>
            <div className="relative p-6">
              <p className="text-sm leading-[1.8] text-foreground whitespace-pre-wrap">
                {teacher.bio}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-custom py-12 text-center">
            <Icons.FileText className="h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">No biography provided</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a bio to help students and colleagues learn more about you.
            </p>
          </div>
        )}
      </div>

      {/* ── Quick Stats Bar ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Courses", value: teacher?.courses?.length || 0, icon: Icons.Building },
          { label: "Students", value: teacher?.totalStudents || "—", icon: Icons.UserCheck },
          { label: "Rating", value: teacher?.rating ? `${teacher.rating}/5` : "—", icon: Icons.Award },
          { label: "Assignments", value: teacher?.totalAssignments || "—", icon: Icons.FileText },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-center rounded-xl border border-border-custom bg-card p-4 text-center transition-all hover:shadow-sm"
            >
              <Icon className="h-5 w-5 text-primary" />
              <span className="mt-2 text-xl font-bold text-foreground">{stat.value}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import {
  Mail,
  Phone,
  Hash,
  Briefcase,
  Building2,
  User,
  Calendar,
  Target,
  TrendingUp,
  MapPin,
  FileText,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

import SalesTeamActions from "./SalesTeamActions";

export default function SalesTeamDetails({ member, onDelete }) {
  if (!member) return null;

  const statusConfig = {
    ACTIVE: {
      bg: "bg-[var(--success)]/10",
      text: "text-[var(--success)]",
      border: "border-[var(--success)]/20",
      label: "Active",
    },
    ON_LEAVE: {
      bg: "bg-[var(--warning)]/10",
      text: "text-[var(--warning)]",
      border: "border-[var(--warning)]/20",
      label: "On Leave",
    },
    RESIGNED: {
      bg: "bg-[var(--muted)]",
      text: "text-[var(--muted-foreground)]",
      border: "border-[var(--border)]",
      label: "Resigned",
    },
    TERMINATED: {
      bg: "bg-[var(--destructive)]/10",
      text: "text-[var(--destructive)]",
      border: "border-[var(--destructive)]/20",
      label: "Terminated",
    },
  };

  const status = statusConfig[member.employmentStatus] || statusConfig.TERMINATED;

  const sections = [
    {
      id: "profile",
      title: "Profile Overview",
      icon: User,
      content: (
        <div className="flex items-start gap-5">
          <div
            className="w-20 h-20 flex items-center justify-center text-3xl font-bold text-white shrink-0"
            style={{ backgroundColor: "var(--primary)" }}
            aria-hidden="true"
          >
            {member.userId?.fullName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-[var(--foreground)] truncate">
              {member.userId?.fullName}
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              {member.designation} · {member.department}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}
              >
                <span className={`w-1.5 h-1.5 mr-2 ${status.text.replace("text-", "bg-")}`} />
                {status.label}
              </span>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">
                {member.employeeId}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: Mail,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem
            icon={Mail}
            label="Email Address"
            value={member.userId?.email}
            href={`mailto:${member.userId?.email}`}
          />
          <InfoItem
            icon={Phone}
            label="Phone Number"
            value={member.phone}
            href={member.phone ? `tel:${member.phone}` : null}
          />
          <InfoItem
            icon={MapPin}
            label="Residential Address"
            value={member.address}
            fullWidth
          />
        </div>
      ),
    },
    {
      id: "employment",
      title: "Employment Details",
      icon: Briefcase,
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoItem icon={Hash} label="Employee ID" value={member.employeeId} mono />
          <InfoItem icon={Briefcase} label="Designation" value={member.designation} />
          <InfoItem icon={Building2} label="Department" value={member.department} />
          <InfoItem
            icon={UserCheck}
            label="Reporting Manager"
            value={
              member.manager
                ? `${member.manager.userId?.fullName} (${member.manager.employeeId})`
                : null
            }
          />
          <InfoItem
            icon={Calendar}
            label="Joining Date"
            value={
              member.joiningDate
                ? new Date(member.joiningDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null
            }
          />
          <InfoItem icon={Calendar} label="Date of Birth" value={member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : null} />
          <InfoItem icon={User} label="Gender" value={member.gender} />
          <InfoItem
            icon={TrendingUp}
            label="Experience"
            value={member.experience ? `${member.experience} Years` : null}
          />
        </div>
      ),
    },
    {
      id: "targets",
      title: "Performance Targets",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <TargetCard
              label="Daily Target"
              value={member.dailyLeadTarget || 0}
              sub="leads / day"
            />
            <TargetCard
              label="Monthly Target"
              value={member.monthlyLeadTarget || 0}
              sub="leads / month"
            />
            <TargetCard
              label="Projected"
              value={(member.dailyLeadTarget || 0) * 22}
              sub="leads (22 days)"
              accent="success"
            />
          </div>
          {/* Progress visualization */}
          <div className="pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                Monthly Progress
              </span>
              <span className="text-xs font-bold text-[var(--foreground)]">
                0 / {member.monthlyLeadTarget || 0}
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--muted)] border border-[var(--border)]">
              <div
                className="h-full bg-[var(--primary)] transition-all"
                style={{
                  width: `${Math.min(
                    ((0) / (member.monthlyLeadTarget || 1)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "bio",
      title: "Professional Bio",
      icon: FileText,
      content: member.bio ? (
        <p className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
          {member.bio}
        </p>
      ) : (
        <div className="flex items-center gap-3 p-4 border border-[var(--border)] bg-[var(--muted)]/50">
          <AlertTriangle size={16} className="text-[var(--warning)]" />
          <span className="text-sm text-[var(--muted-foreground)]">
            No bio provided for this member.
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Content */}
      <div className="space-y-0 lg:col-span-2">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <section
              key={section.id}
              className={`border border-[var(--border)] bg-[var(--card)] ${
                index !== 0 ? "border-t-0" : ""
              }`}
              aria-labelledby={`section-${section.id}`}
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--muted)]/30">
                <div className="p-1.5 bg-[var(--primary-muted)] text-[var(--primary)]">
                  <Icon size={16} aria-hidden="true" />
                </div>
                <h2
                  id={`section-${section.id}`}
                  className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]"
                >
                  {section.title}
                </h2>
              </div>
              <div className="p-6">{section.content}</div>
            </section>
          );
        })}
      </div>

      {/* Sidebar Actions */}
      <aside className="lg:col-span-1">
        <div className="sticky top-6 space-y-0">
          <SalesTeamActions member={member} onDelete={onDelete} />
        </div>
      </aside>
    </div>
  );
}

/* ─── Subcomponents ─── */

function InfoItem({ icon: Icon, label, value, href, mono = false, fullWidth = false }) {
  const content = (
    <div className={`flex items-start gap-3 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <div className="p-2 bg-[var(--muted)] text-[var(--muted-foreground)] shrink-0">
        <Icon size={14} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mb-0.5">
          {label}
        </p>
        {value ? (
          <p
            className={`text-sm font-medium text-[var(--foreground)] truncate ${
              mono ? "font-mono" : ""
            }`}
          >
            {value}
          </p>
        ) : (
          <span className="text-sm text-[var(--muted-foreground)]">—</span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group block hover:bg-[var(--muted)]/50 -mx-2 px-2 py-1 transition-colors"
        title={`${label}: ${value}`}
      >
        {content}
      </a>
    );
  }

  return <div className="py-1">{content}</div>;
}

function TargetCard({ label, value, sub, accent = "primary" }) {
  return (
    <div className="border border-[var(--border)] bg-[var(--background)] p-4 text-center">
      <p
        className="text-2xl font-bold"
        style={{ color: `var(--${accent === "success" ? "success" : "primary"})` }}
      >
        {value}
      </p>
      <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider mt-1">
        {label}
      </p>
      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>
    </div>
  );
}
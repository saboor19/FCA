"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BookOpen, Users, CalendarDays, FileText, 
  Wallet, Bell, ShieldCheck, GraduationCap, ChevronLeft, ChevronRight,
  Award, TrendingUp
} from "lucide-react";

const Sidebar = ({ role }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getIcon = (name) => {
    const icons = {
      Dashboard: <LayoutDashboard size={20} />,
      Courses: <BookOpen size={20} />,
      "My Courses": <BookOpen size={20} />,
      Students: <Users size={20} />,
      Teachers: <Users size={20} />,
      Attendance: <CalendarDays size={20} />,
      Assignments: <FileText size={20} />,
      Fees: <Wallet size={20} />,
      Notices: <Bell size={20} />,
      Batches: <GraduationCap size={20} />,
      Enrollments: <ShieldCheck size={20} />,
      Profile: <Users size={20} />,
      Reports: <FileText size={20} />,
      "Performance": <TrendingUp size={20} />,
      "Achievements": <Award size={20} />,
    };
    return icons[name] || <LayoutDashboard size={20} />;
  };

  const links = {
    ADMIN: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Students", href: "/admin/students" },
      { name: "Teachers", href: "/admin/teachers" },
      { name: "Courses", href: "/admin/courses" },
      { name: "Batches", href: "/admin/batches" },
      { name: "Enrollments", href: "/admin/enrollments" },
      { name: "Fees", href: "/admin/fees" },
      { name: "TimeTables", href: "/admin/timetables" },
      { name: "Attendance", href: "/admin/attendance" },
      { name: "Notices", href: "/admin/notices" },
      { name: "Reports", href: "/admin/reports" },
    ],
    TEACHER: [
      { name: "Dashboard", href: "/teacher/dashboard" },
      { name: "My Courses", href: "/teacher/courses" },
      { name: "Students", href: "/teacher/students" },
      { name: "Assignments", href: "/teacher/assignments" },
      { name: "Attendance", href: "/teacher/attendance" },
      { name: "Notices", href: "/teacher/notices" },
      { name: "Timetable", href: "/teacher/timetable" },
      { name: "Reports", href: "/teacher/reports" },
    ],
    STUDENT: [
      { name: "Dashboard", href: "/student/dashboard" },
      { name: "My Courses", href: "/student/courses" },
      { name: "Assignments", href: "/student/assignments" },
      { name: "Attendance", href: "/student/attendance" },
      { name: "Fees", href: "/student/fees" },
      { name: "Performance", href: "/student/performance" },
      { name: "Achievements", href: "/student/achievements" },
      { name: "Notices", href: "/student/notice" },
    ],
  };

  const activeLinks = links[role] || links.ADMIN;

  return (
    <aside 
      className={`
        ${isCollapsed ? "w-20" : "w-72"} 
        border-r border-border-custom bg-card/95 backdrop-blur-xl 
        h-screen flex flex-col transition-all duration-500 ease-out 
        sticky top-0 shrink-0 z-30 shadow-xl
      `}
    >
      {/* Collapse Toggle Button - Improved */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-9 bg-card border border-border-custom rounded-full p-2 shadow-md hover:shadow-lg text-slate-500 dark:text-slate-400 hover:text-foreground transition-all hover:scale-110 z-40"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Brand / Logo Area - Premium */}
      <div className={`flex items-center gap-3 mt-8 mb-12 px-6 transition-all duration-300 ${isCollapsed ? "justify-center" : ""}`}>
        <div className="w-11 h-11 bg-gradient-to-br from-violet-600 via-indigo-600 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
          <GraduationCap size={26} className="text-white" />
        </div>
        
        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-[-0.04em] text-foreground">
              Fusion Code
            </h1>
            <p className="text-[10px] font-mono tracking-[1.5px] text-muted-foreground -mt-1">ACADEMY</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 overflow-y-auto pb-8 space-y-1">
        {activeLinks.map((link) => {
          const isActive = pathname === link.href;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.name : ""}
              className={`
                group flex items-center gap-3.5 py-[13px] px-5  text-[20px] font-medium
                transition-all duration-300 relative overflow-hidden
                ${isActive 
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/40" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-foreground"
                }
                ${isCollapsed ? "justify-center px-0" : ""}
              `}
            >
              {/* Active Indicator */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/30 rounded-r-full" />
              )}

              <div className={`shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {getIcon(link.name)}
              </div>

              {!isCollapsed && (
                <span className="whitespace-nowrap tracking-tight">
                  {link.name}
                </span>
              )}

              {/* Subtle shine effect on active */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-40 pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className={`mt-auto border-t border-border-custom p-4 ${isCollapsed ? "px-3" : ""}`}>
        <div className={`flex items-center gap-3 text-xs text-muted-foreground ${isCollapsed ? "justify-center" : ""}`}>
          {!isCollapsed && (
            <div>
              {/* Role: <span className="font-medium text-foreground capitalize">{role.toLowerCase()}</span> */}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
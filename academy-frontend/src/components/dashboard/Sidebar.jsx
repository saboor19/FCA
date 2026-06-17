"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import {
  LayoutDashboard,
  BookOpen,
  Users,User2,
  CalendarDays,
  FileText,
  Wallet,
  Bell,
  ShieldCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Award,
  TrendingUp,
  Plus,
  ChevronDown,
} from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const icons = {
  Dashboard: LayoutDashboard,
  Courses: BookOpen,
  "My Courses": BookOpen,
  Students: Users,
  Teachers: Users,
  Attendance: CalendarDays,
  Assignments: FileText,
  Fees: Wallet,
  Notices: Bell,
  Batches: GraduationCap,
  Enrollments: ShieldCheck,
  Profile: Users,
  Reports: FileText,
  Performance: TrendingUp,
  Achievements: Award,
};

const Sidebar = ({ role }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (name) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const links = {
    ADMIN: [
      { name: "Dashboard", href: "/admin/dashboard" },
      {
        name: "Students",
        href: "/admin/students",
        subItems: [{ name: "Create New", href: "/admin/students/create" }],
      },
      {
        name: "Teachers",
        href: "/admin/teachers",
        subItems: [{ name: "Create New", href: "/admin/teachers/create" }],
      },
      {
        name: "Courses",
        href: "/admin/courses",
        subItems: [{ name: "Create New", href: "/admin/courses/create" }],
      },
      {
        name: "Batches",
        href: "/admin/batches",
        subItems: [{ name: "Create New", href: "/admin/batches/new" }],
      },
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
      { name: "Profile", href: "/teacher/profile" },
    ],
    STUDENT: [
      { name: "Dashboard", href: "/student/dashboard" },
      { name: "Batches", href: "/student/batches" },
      { name: "Assignments", href: "/student/assignments" },
      { name: "Timetable", href: "/student/timetable" },
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
        ${inter.className} 
        /* --- Mobile: fixed overlay, slides in/out --- */
        fixed top-0 left-0 h-full z-40 w-72
        bg-card/95 backdrop-blur-xl
        border-r border-border-custom
        shadow-2xl
        transition-all duration-500 ease-out
        ${isCollapsed ? "-translate-x-full" : "translate-x-0"}

        /* --- Desktop: sticky, shrinks content --- */
        lg:sticky lg:top-0 lg:h-screen lg:z-30
        lg:translate-x-0                     /* always visible on desktop */
        ${isCollapsed ? "lg:w-30" : "lg:w-72"}
      `}
    >
      {/* Collapse toggle – always visible */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute w-6 -right-6 z-[-1] top-[50%] bg-card border-y border-r border-border-custom rounded-r-2xl h-20 p-2 shadow-md hover:shadow-lg text-muted-foreground hover:text-foreground transition-all hover:scale-110 "
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Brand */}
      <div
        className={`flex items-center gap-3 mt-8 mb-12 px-6 transition-all duration-300 ${
          isCollapsed ? "lg:justify-center" : ""
        }`}
      >
        <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <GraduationCap size={20} className="text-white" />
        </div>
        {(!isCollapsed || (isCollapsed && window?.innerWidth >= 1024)) && (
          <div className="hidden lg:block">
          {!isCollapsed && (
            <span className="capitalize">{role?.toLowerCase()} panel</span>
          )}
          <p className="text-[10px] tracking-[1.5px] text-muted-foreground -mt-1">
              FUSION CODE ACADEMY
            </p>
          </div>
        )}
        {/* On mobile always show brand when expanded */}
        {!isCollapsed && (
          <div className="lg:hidden">
            <h1 className="text-2xl font-medium tracking-[-0.04em] text-foreground">
              Fusion Code
            </h1>
            <p className="text-[10px] tracking-[1.5px] text-muted-foreground -mt-1">
              ACADEMY
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1 overflow-y-auto pb-8 space-y-1">
        {activeLinks.map((link) => {
          const Icon = icons[link.name] || LayoutDashboard;
          const isActive =
            pathname === link.href ||
            (link.subItems &&
              link.subItems.some((sub) => pathname === sub.href));
          const hasSubItems = link.subItems && link.subItems.length > 0;
          const isExpanded = expandedMenus[link.name] || false;

          return (
            <div key={link.name}>
              {/* Main link row */}
              <div
                className={`
                  group flex items-center justify-between rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                  ${isCollapsed ? "lg:justify-center lg:px-0" : ""}
                `}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-3.5 py-3 px-5 flex-1 ${
                    isCollapsed ? "lg:justify-center lg:px-0" : ""
                  }`}
                  title={isCollapsed ? link.name : ""}
                >
                  <div
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap tracking-tight font-light lg:inline">
                      {link.name}
                    </span>
                  )}
                </Link>

                {/* Expand arrow for submenus */}
                {hasSubItems && !isCollapsed && (
                  <button
                    onClick={() => toggleMenu(link.name)}
                    className="pr-4 py-3 text-current hover:opacity-80 transition-opacity"
                    aria-label={`Toggle ${link.name} submenu`}
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Submenu */}
              {hasSubItems && !isCollapsed && isExpanded && (
                <div className="ml-9 mt-1 space-y-1 overflow-hidden">
                  {link.subItems.map((sub) => {
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`
                          flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm
                          transition-all duration-200
                          ${
                            isSubActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }
                        `}
                      >
                        <Plus size={14} className="text-primary" />
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      
    </aside>
  );
};

export default Sidebar;
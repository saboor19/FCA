"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  BookOpen01Icon,
  UserMultipleIcon,
  TeacherIcon,
  Calendar03Icon,
  File02Icon,
  Wallet01Icon,
  Notification03Icon,
  GraduationScrollIcon,
  Shield01Icon, // Replaced ShieldCheckIcon with valid Shield01Icon
  UserAccountIcon,
  ChartHistogramIcon,
  Award01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  Add01Icon,
  ArrowDown01Icon,
  BookBookmarkIcon,
  CalendarSettingIcon,
  MoneySend01Icon,
  UserGroupIcon,
  LibraryIcon,
  CalendarCheckInIcon,
  Notification01Icon,
} from "@hugeicons/core-free-icons";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const icons = {
  Dashboard: Home01Icon,
  Courses: BookOpen01Icon,
  "My Courses": BookBookmarkIcon,
  Students: UserMultipleIcon,
  Teachers: TeacherIcon,
  Attendance: CalendarCheckInIcon,
  Assignments: File02Icon,
  Fees: MoneySend01Icon,
  Notices: Notification01Icon,
  Batches: GraduationScrollIcon,
  Enrollments: Shield01Icon, // Updated reference here
  Profile: UserAccountIcon,
  Reports: ChartHistogramIcon,
  Performance: ChartHistogramIcon,
  Achievements: Award01Icon,
  "Study Material": LibraryIcon,
  Timetable: CalendarSettingIcon,
  TimeTables: CalendarSettingIcon,
  "sales-team": UserGroupIcon,
  "Create New": Add01Icon,
  Leaves: Calendar03Icon,
  "Create Session": Add01Icon,
};

const Sidebar = ({ role }) => {
  const pathname = usePathname();
  const navRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = () => {
      setShowScrollTop(nav.scrollTop > 200);
    };

    nav.addEventListener("scroll", handleScroll);
    return () => nav.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    navRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      { name: "sales-team", href: "/admin/sales-team" },
    ],
    TEACHER: [
      { name: "Dashboard", href: "/teacher/dashboard" },
      { name: "My Courses", href: "/teacher/courses" },
      { name: "Students", href: "/teacher/students" },
      { name: "Assignments", href: "/teacher/assignments" },
      { name: "Study Material", href: "/teacher/study-materials" },
      {
        name: "Attendance",
        href: "/teacher/attendance",
        subItems: [
          { name: "Leaves", href: "/teacher/leaves" },
          { name: "Create Session", href: "/teacher/attendance/session" },
        ],
      },
      { name: "Notices", href: "/teacher/notices" },
      { name: "Timetable", href: "/teacher/timetable" },
      { name: "Profile", href: "/teacher/profile" },
    ],
    STUDENT: [
      { name: "Dashboard", href: "/student/dashboard" },
      { name: "Batches", href: "/student/batches" },
      { name: "Assignments", href: "/student/assignments" },
      { name: "Study Material", href: "/student/study-materials" },
      { name: "Timetable", href: "/student/timetable" },
      { name: "Attendance", href: "/student/attendance" },
      { name: "Fees", href: "/student/fees" },
      { name: "Notices", href: "/student/notices" },
      { name: "Profile", href: "/student/profile" },
    ],
  };

  const activeLinks = links[role] || links.ADMIN;

  return (
    <aside
      className={`
        ${inter.className}
        fixed top-0 left-0 h-full z-40
        bg-[var(--sidebar)] backdrop-blur-xl
        border-r border-[var(--sidebar-border)]
        shadow-2xl
        transition-all duration-300 ease-out
        ${isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
        w-72
        lg:sticky lg:top-0 lg:h-screen lg:z-30
        ${isCollapsed ? "lg:w-20" : "lg:w-72"}
      `}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-6 top-1/2 -translate-y-1/2 z-50
          w-6 h-20
          bg-[var(--sidebar)] border-y border-r border-[var(--sidebar-border)]
          flex items-center justify-center
          text-[var(--muted-foreground)] hover:text-[var(--foreground)]
          transition-all hover:scale-110
          shadow-md"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <HugeiconsIcon
          icon={isCollapsed ? ArrowRight01Icon : ArrowLeft01Icon}
          size={16}
          color="currentColor"
          strokeWidth={2}
        />
      </button>

      {/* Brand */}
      <div
        className={`flex items-center gap-3 mt-6 mb-10 px-5 transition-all duration-300 ${
          isCollapsed ? "lg:justify-center lg:px-0" : ""
        }`}
      >
        <div
          className="w-11 h-11 flex items-center justify-center shrink-0"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <HugeiconsIcon
            icon={GraduationScrollIcon}
            size={22}
            color="#ffffff"
            strokeWidth={1.5}
          />
        </div>
        {(!isCollapsed || typeof window === "undefined") && (
          <div className={`${isCollapsed ? "lg:hidden" : "block"}`}>
            <h1 className="text-lg font-medium tracking-tight text-[var(--foreground)] leading-tight">
              Fusion Code
            </h1>
            <p className="text-[10px] tracking-[2px] text-[var(--muted-foreground)] uppercase font-medium">
              Academy
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav
        ref={navRef}
        className="px-3 flex-1 overflow-y-auto pb-24 space-y-0.5"
        style={{
          maxHeight: "calc(100vh - 140px)",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--secondary) var(--muted)",
        }}
      >
        {activeLinks.map((link) => {
          const Icon = icons[link.name] || Home01Icon;
          const isActive =
            pathname === link.href ||
            (link.subItems && link.subItems.some((sub) => pathname === sub.href));
          const hasSubItems = link.subItems && link.subItems.length > 0;
          const isExpanded = expandedMenus[link.name] || false;

          return (
            <div key={link.name}>
              {/* Main link */}
              <div
                className={`
                  group flex items-center justify-between
                  transition-all duration-200
                  border-l-2
                  ${
                    isActive
                      ? "bg-[var(--primary-muted)] border-[var(--primary)] text-[var(--primary)]"
                      : "border-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  }
                  ${isCollapsed ? "lg:justify-center" : ""}
                `}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-3.5 py-3 px-4 flex-1 min-w-0 ${
                    isCollapsed ? "lg:justify-center lg:px-0" : ""
                  }`}
                  title={isCollapsed ? link.name : ""}
                >
                  <div
                    className={`shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    <HugeiconsIcon
                      icon={Icon}
                      size={20}
                      color="currentColor"
                      strokeWidth={isActive ? 2 : 1.5}
                    />
                  </div>
                  {!isCollapsed && (
                    <span className="whitespace-nowrap tracking-tight font-medium text-sm truncate">
                      {link.name === "sales-team" ? "Sales Team" : link.name}
                    </span>
                  )}
                </Link>

                {/* Submenu toggle */}
                {hasSubItems && !isCollapsed && (
                  <button
                    onClick={() => toggleMenu(link.name)}
                    className="pr-4 py-3 text-current hover:opacity-80 transition-opacity shrink-0"
                    aria-label={`Toggle ${link.name} submenu`}
                    aria-expanded={isExpanded}
                  >
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={14}
                      color="currentColor"
                      strokeWidth={2}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Submenu */}
              {hasSubItems && !isCollapsed && isExpanded && (
                <div className="ml-11 mt-0.5 mb-1 space-y-0.5 border-l border-[var(--sidebar-border)]">
                  {link.subItems.map((sub) => {
                    const SubIcon = icons[sub.name] || Add01Icon;
                    const isSubActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className={`
                          flex items-center gap-3 py-2.5 px-4 text-sm
                          transition-all duration-200
                          ${
                            isSubActive
                              ? "bg-[var(--primary-muted)] text-[var(--primary)] font-medium border-l-2 border-[var(--primary)]"
                              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] border-l-2 border-transparent"
                          }
                        `}
                      >
                        <HugeiconsIcon
                          icon={SubIcon}
                          size={16}
                          color="currentColor"
                          strokeWidth={isSubActive ? 2 : 1.5}
                        />
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

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`
          absolute bottom-4 left-1/2 -translate-x-1/2
          flex items-center justify-center
          w-8 h-8
          bg-[var(--primary)] text-white
          shadow-lg
          transition-all duration-300
          hover:bg-[var(--primary-hover)]
          ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
        aria-label="Scroll to top of navigation"
        title="Scroll to top"
      >
        <HugeiconsIcon
          icon={ArrowUp01Icon}
          size={16}
          color="#ffffff"
          strokeWidth={2}
        />
      </button>
    </aside>
  );
};

export default Sidebar;
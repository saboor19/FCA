"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./theme-toggle";

const NavLink = ({ href, children, isActive = false }) => (
  <Link
    href={href}
    className={`
      relative px-1 py-1 text-sm font-semibold tracking-[0.025em]
      text-slate-600 dark:text-slate-300
      hover:text-slate-900 dark:hover:text-white
      transition-all duration-300 group
      ${isActive ? "text-indigo-600 dark:text-amber-400" : ""}
    `}
  >
    {children}
    <span
      className={`
        absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2.5px] 
        bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 
        dark:from-amber-400 dark:via-orange-400 dark:to-rose-400
        rounded-full transition-all duration-300 origin-center
        ${isActive ? "w-6" : "w-0 group-hover:w-6"}
      `}
    />
  </Link>
);

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-white/10 backdrop-blur-2xl bg-white/85 dark:bg-[#0f172a]/90 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="FCA Academy Home"
        >
          <div className="relative">
            <span className="text-3xl font-black tracking-[-0.04em] bg-clip-text text-transparent bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 group-hover:via-violet-500 transition-all">
              FCA
            </span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 dark:bg-amber-300 rounded-full opacity-75 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Academy
            </span>
            <span className="text-[10px] font-mono tracking-[2px] text-slate-400 dark:text-slate-500 -mt-0.5">EST 2023</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-9 text-sm">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/courses">Courses</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          {/* Enroll Now Button - FIXED: single-line className */}
          <Link
            href="/enroll"
            className="px-6 py-2.5 text-sm font-semibold rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 dark:from-amber-500 dark:to-orange-500 dark:hover:from-amber-600 dark:hover:to-orange-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-orange-500/30 transition-all duration-300 active:scale-[0.985]"
          >
            Enroll Now
          </Link>

          {/* Login Button - FIXED: removed extra whitespace and invalid hover:scale-120 */}
          <Link
            href="/login"
            className="px-5 py-2 border-2 border-amber-50 text-blue-300 hover:bg-amber-50/10 transition-all"
          >
            Login
          </Link>

          {/* Theme Toggle */}
          <div className="pl-4 border-l border-slate-200 dark:border-white/10">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileOpen ? "M6 18L18 6M6 6h12v12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] py-6 px-6 shadow-xl">
          <div className="flex flex-col gap-6 text-base">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/courses">Courses</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/about">About</NavLink>

            <Link
              href="/enroll"
              className="mt-4 w-full py-4 text-center font-semibold rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-base"
            >
              Enroll Now
            </Link>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "../theme-toggle";

const NavLink = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="relative text-sm font-semibold tracking-[0.02em] text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all duration-300 group"
    >
      {children}
      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2.5px] w-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400 rounded-full transition-all duration-300 group-hover:w-6" />
    </Link>
  );
};

export default function AppNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? "py-4" : "py-6"}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`relative flex items-center justify-between rounded-3xl border backdrop-blur-2xl transition-all duration-500 px-6 lg:px-8 ${isScrolled ? "bg-white/70 dark:bg-[#0b1120]/70 border-white/20 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.08)]" : "bg-white/40 dark:bg-[#0b1120]/40 border-white/10 dark:border-white/5"}`}>
            
            {/* GLOW */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-1/4 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-violet-500/10 blur-3xl rounded-full" />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 flex items-center justify-between w-full h-20">
              
              {/* LOGO */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white font-black text-lg">FCA</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">FCA Academy</span>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">Modern Engineering Academy</span>
                </div>
              </Link>

              {/* DESKTOP NAV */}
              <div className="hidden lg:flex items-center gap-12">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/courses">Programs</NavLink>
                <NavLink href="/projects">Projects</NavLink>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/contact">Contact</NavLink>
              </div>

              {/* RIGHT */}
              <div className="hidden lg:flex items-center gap-4">
                <Link
                  href="/login"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 text-sm font-semibold transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/enroll"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white text-sm font-semibold shadow-[0_0_30px_rgba(79,70,229,0.35)] hover:shadow-[0_0_45px_rgba(79,70,229,0.45)] hover:-translate-y-[2px] transition-all duration-300"
                >
                  Enroll Now
                </Link>
                <div className="pl-2">
                  <ThemeToggle />
                </div>
              </div>

              {/* MOBILE BUTTON */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden w-11 h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-100 lg:hidden transition-all duration-500 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        
        {/* OVERLAY */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={() => setIsMobileOpen(false)}
        />

        {/* PANEL */}
        <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-3xl border-l border-white/10 p-8 transition-transform duration-500 ${isMobileOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-xl font-bold">Navigation</h2>
              <ThemeToggle />
            </div>

            <div className="flex flex-col gap-8 text-lg font-semibold">
              <Link href="/">Home</Link>
              <Link href="/courses">Programs</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
            </div>

            <div className="mt-auto flex flex-col gap-4">
              <Link
                href="/login"
                className="w-full py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-center font-semibold"
              >
                Login
              </Link>
              <Link
                href="/enroll"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white text-center font-semibold"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
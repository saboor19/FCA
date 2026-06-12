"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder matching the exact dimensions of the new toggle (w-14 = 56px, h-8 = 32px)
    return <div className="w-14 h-8 rounded-full border border-transparent" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative flex items-center w-14 h-8 rounded-full p-1 
        transition-colors duration-300 border
        focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 dark:focus:ring-offset-[#0f172a]
        ${isDark 
          ? "bg-black/20 border-white/10 shadow-inner" 
          : "bg-slate-100 border-slate-200 shadow-inner"
        }
      `}
      aria-label="Toggle Theme"
    >
      {/* Background Icons (Stationary inside the track) */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun size={14} className={isDark ? "text-slate-600" : "text-amber-500"} />
        <Moon size={14} className={isDark ? "text-slate-400" : "text-slate-300"} />
      </div>

      {/* Sliding Thumb */}
      <div
        className={`
          w-6 h-6 rounded-full relative z-10 
          transform transition-all duration-300 ease-spring flex items-center justify-center
          ${isDark 
            ? "translate-x-6 bg-gradient-to-br from-amber-300 to-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.4)] border border-amber-200" 
            : "translate-x-0 bg-white shadow-md border border-slate-100"
          }
        `}
      />
    </button>
  );
}
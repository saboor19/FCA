"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function AcademyLoader({ 
  text = "Loading...", 
  fullScreen = false 
}) {
  return (
    <div 
      className={`flex flex-col items-center justify-center w-full ${
        fullScreen ? "min-h-screen" : "min-h-[400px]"
      }`}
    >
      <div className="relative flex items-center justify-center w-24 h-24">
        
        {/* Inner Orbital Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full border-t-2 border-r-2 border-slate-900 dark:border-slate-100 opacity-20"
        />

        {/* Outer Orbital Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
          className="absolute inset-0 m-auto w-20 h-20 rounded-full border-b-2 border-l-2 border-blue-500/50 opacity-40"
        />

        {/* Center Floating Icon */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="bg-card border border-border-custom p-3 rounded-2xl shadow-sm z-10"
        >
          <GraduationCap size={24} className="text-foreground" />
        </motion.div>
        
      </div>

      {/* Pulsing Text */}
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest uppercase"
      >
        {text}
      </motion.p>
    </div>
  );
}
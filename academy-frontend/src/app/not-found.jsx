"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileQuestion, 
  ArrowLeft, 
  Home, 
  Search,
  BookOpen
} from "lucide-react";


export default function NotFoundPage() {
  return (
    
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        
        {/* Animated Icon Composition */}
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-slate-100 p-8 rounded-full"
          >
            <FileQuestion size={80} className="text-slate-400" />
          </motion.div>
          
          {/* Small floating academy-themed icons */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 bg-white p-2 rounded-lg shadow-md border border-slate-100"
          >
            <BookOpen size={20} className="text-blue-500" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-2 -left-2 bg-white p-2 rounded-lg shadow-md border border-slate-100"
          >
            <Search size={20} className="text-slate-400" />
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-md"
        >
          <h1 className="text-6xl font-black text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            The academic resource or page you are looking for doesn't exist or has been moved to a different department.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/admin/dashboard"
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 transition shadow-sm"
          >
            <Home size={18} />
            Back to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            <ArrowLeft size={18} />
            Previous Page
          </button>
        </motion.div>

        {/* Decorative background element (matches Academy design system) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50" />
      </div>

  );
}
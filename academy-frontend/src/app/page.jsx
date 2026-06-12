"use client";

import { useEffect, useState } from "react";
import { getAllCourses } from "@/services/courseService";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourses();
        setCourses(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
  }, []);

  return (
    
    <main className="relative overflow-hidden">
      
      {/* BACKGROUND GLOW EFFECT (Sleek Royal Vibe) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="min-h-[85vh] flex flex-col justify-center px-6 max-w-7xl mx-auto relative z-10 pt-20">
        
        {/* Subtle Badge */}
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-sm w-fit backdrop-blur-md shadow-sm">
          Empowering Future Leaders
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
          Learn Modern <br />
          {/* Royal Gold/Amber Text Gradient */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500">
            Tech Skills Faster
          </span>
        </h1>

        <p className="text-lg md:text-xl opacity-80 max-w-2xl mb-10 leading-relaxed">
          FCA Academy helps students master development, coding, and modern software technologies with elite, real-world guidance.
        </p>

        <div className="flex flex-wrap gap-5">
          {/* Primary Button: Rich Violet/Indigo Gradient with Shadow Glow */}
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] transition-all duration-300 hover:-translate-y-1">
            Explore Courses
          </button>

          {/* Secondary Button: Sleek Glassmorphism Outline */}
          <button className="px-8 py-4 rounded-xl border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md font-semibold transition-all duration-300 hover:bg-slate-100 dark:hover:bg-white/10">
            Learn More
          </button>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="mb-16 md:flex justify-between items-end border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Premium Programs
            </h2>
            <p className="text-lg opacity-70">
              Explore our most demanded, industry-led curriculums.
            </p>
          </div>
          
          <button className="hidden md:block mt-6 md:mt-0 px-6 py-2 rounded-lg text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
            View All Courses →
          </button>
        </div>

        {/* Increased gap for a less cluttered, more premium layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
            />
          ))}
        </div>
      </section>

    </main>
  );
}
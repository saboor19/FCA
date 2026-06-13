// components/dashboard/SlidingHeadlines.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";

const dummyHeadlines = [
  {
    id: 1,
    text: "🎓 New batch for Data Science starts on July 15th – enroll now!",
    color: "from-indigo-500 to-blue-600",
    icon: Megaphone,
  },
  {
    id: 2,
    text: "💰 Fee payment deadline extended to July 20th for all students.",
    color: "from-emerald-500 to-teal-600",
    icon: Megaphone,
  },
  {
    id: 3,
    text: "🏆 Congratulations to our top performers in the June assessments!",
    color: "from-amber-500 to-orange-600",
    icon: Megaphone,
  },
  {
    id: 4,
    text: "📢 Teacher’s Day celebration on September 5th – join us for the event.",
    color: "from-purple-500 to-pink-600",
    icon: Megaphone,
  },
  {
    id: 5,
    text: "📚 New course alert: Advanced React & Next.js now available!",
    color: "from-rose-500 to-red-600",
    icon: Megaphone,
  },
];

const SlidingHeadlines = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % dummyHeadlines.length);
  }, []);

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + dummyHeadlines.length) % dummyHeadlines.length
    );
  };

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goToNext, 4000);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

  const headline = dummyHeadlines[currentIndex];

  return (
    <div
      className="w-full mb-6 overflow-hidden rounded-2xl border border-border-custom bg-card shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Content container – slides horizontally */}
      <div className="relative h-14 md:h-16">
        <div
          className={`absolute inset-0 flex items-center px-4 md:px-6 bg-gradient-to-r ${headline.color} transition-all duration-700 ease-in-out`}
        >
          {/* Navigation arrows (always visible) */}
          <button
            onClick={goToPrev}
            className="absolute left-1 md:left-3 p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            aria-label="Previous headline"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex-1 flex items-center gap-3 mx-10">
            <headline.icon size={20} className="text-white shrink-0" />
            <p className="text-white text-sm md:text-base font-medium tracking-wide truncate">
              {headline.text}
            </p>
          </div>

          <button
            onClick={goToNext}
            className="absolute right-1 md:right-3 p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
            aria-label="Next headline"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5 py-2">
        {dummyHeadlines.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-5 bg-primary"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to headline ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlidingHeadlines;
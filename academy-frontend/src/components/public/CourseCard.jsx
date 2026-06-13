"use client";

import Link from "next/link";
import Image from "next/image";

export default function CourseCard({ course }) {

  return (

    <div
      className=" my-10
        group relative overflow-hidden
        rounded-[32px]
        border border-slate-200 dark:border-white/10
        bg-white/70 dark:bg-white/[0.04]
        backdrop-blur-2xl
        hover:-translate-y-3
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        transition-all duration-500
      "
    >

      {/* GLOW */}

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">

        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />

        <div className="absolute bottom-0 right-0 w-40 h-40 bg-violet-500/10 blur-3xl rounded-full" />

      </div>

      {/* COURSE IMAGE */}

      <div className="relative h-56 overflow-hidden">

        <Image
          src={course.thumbnail || "/image4.avif"}
          alt={course.title}
          fill
          className="
            object-cover
            group-hover:scale-105
            transition-transform duration-700
          "
        />

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* CATEGORY BADGE */}

        <div className="absolute top-5 left-5">

          <span
            className="
              px-4 py-2 rounded-full
              bg-white/10 backdrop-blur-xl
              border border-white/10
              text-white text-xs font-semibold
            "
          >

            {course.category || "Engineering"}

          </span>

        </div>

        {/* LEVEL */}

        <div className="absolute top-5 right-5">

          <span
            className="
              px-4 py-2 rounded-full
              bg-amber-500/20
              border border-amber-400/20
              text-amber-300
              text-xs font-semibold
              backdrop-blur-xl
            "
          >

            {course.level || "Beginner"}

          </span>

        </div>

        {/* BOTTOM CONTENT */}

        <div className="absolute bottom-5 left-5 right-5">

          <div className="flex items-center gap-3 text-white/80 text-sm mb-3">

            <span>
              {course.duration || "12 Weeks"}
            </span>

            <div className="w-1 h-1 rounded-full bg-white/40" />

            <span>
              {course.lessons || "24 Modules"}
            </span>

          </div>

          <h3 className="text-2xl font-bold text-white leading-tight">

            {course.title}

          </h3>

        </div>

      </div>

      {/* CONTENT */}

      <div className="relative z-10 p-7">

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-7 line-clamp-3">

          {course.description}

        </p>

        {/* TECH STACK */}

        <div className="flex flex-wrap gap-2 mb-8">

          {(course.techStack || [
            "React",
            "Node.js",
            "MongoDB"
          ]).slice(0, 4).map((tech) => (

            <span
              key={tech}
              className="
                px-3 py-1.5 rounded-xl
                bg-slate-100 dark:bg-white/5
                border border-slate-200 dark:border-white/10
                text-xs font-medium
                text-slate-600 dark:text-slate-300
              "
            >

              {tech}

            </span>

          ))}

        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between">

          {/* PRICE */}

          <div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">

              Starting From

            </p>

            <h4 className="text-2xl font-bold">

              ₹{course.price || "4,999"}

            </h4>

          </div>

          {/* CTA */}

          <Link
            href={`/courses/${course._id}`}
            className="
              px-5 py-3 rounded-2xl
              bg-gradient-to-r
              from-indigo-600
              to-violet-700
              hover:from-indigo-500
              hover:to-violet-600
              text-white
              text-sm
              font-semibold
              shadow-lg shadow-indigo-500/20
              hover:shadow-indigo-500/40
              transition-all duration-300
            "
          >

            View Program

          </Link>

        </div>

      </div>

    </div>

  );

}
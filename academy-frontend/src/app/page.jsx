"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllCourses } from "@/services/public/courseService";
import CourseCard from "@/components/public/CourseCard";
import { Code2, Cpu, Layers, Users, Briefcase } from 'lucide-react';
import Reveal from "@/components/public/Reveal";
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

      {/* GLOBAL BACKGROUND GLOWS */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* HERO SECTION */}

      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 min-h-screen flex items-center">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
        <Reveal>
              <div>

            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500 text-sm font-semibold backdrop-blur-md">

              Modern Engineering Academy

            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-8">

              Build Real Skills.
              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-500">

                Launch Real Careers.

              </span>

            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-10">

              Learn full-stack development, AI, cybersecurity,
              cloud technologies, and modern software engineering
              through practical mentorship and industry-level projects.

            </p>

            <div className="flex flex-wrap gap-5">

              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 text-white font-semibold shadow-[0_0_40px_rgba(79,70,229,0.35)] transition-all duration-300 hover:-translate-y-1">

                Explore Programs

              </button>

              <button className="px-8 py-4 rounded-2xl border border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 font-semibold">

                View Platform

              </button>

            </div>

            {/* METRICS */}

            <div className="grid grid-cols-3 gap-6 mt-16">

              {[
                ["120+", "Batches"],
                ["5000+", "Students"],
                ["40+", "Projects"]
              ].map(([value, label]) => (

                <div key={label}>

                  <h3 className="text-3xl font-bold mb-2">

                    {value}

                  </h3>

                  <p className="text-sm text-slate-500 dark:text-slate-400">

                    {label}

                  </p>

                </div>

              ))}

            </div>

             </div>
        </Reveal>



          {/* RIGHT */}
            <Reveal>
             <div className="relative">

            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 blur-3xl rounded-[40px]" />

            <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">

              <Image
                src="/image1.svg"
                alt="FCA Dashboard"
                width={1200}
                height={900}
                className="w-full h-auto object-cover"
              />

            </div>

             </div>
          </Reveal>



        </div>

      </section>

      {/* LEARNING TRACKS */}

      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="text-center mb-20">

          <h2 className="text-5xl font-bold tracking-tight mb-6">

            Industry-Focused Learning Tracks

          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">

            Structured programs designed around real-world technologies,
            engineering workflows, and career growth.

          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {[
            {
              title:"Full Stack Engineering",
              desc:"React, Node.js, APIs, Databases"
            },
            {
              title:"AI & Data Science",
              desc:"Python, ML, Deep Learning"
            },
            {
              title:"Cybersecurity",
              desc:"Linux, Networking, Ethical Hacking"
            },
            {
              title:"Cloud & DevOps",
              desc:"Docker, CI/CD, AWS"
            }
          ].map((item) => (

            <div
              key={item.title}
              className="group p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
            >

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 mb-6" />

              <h3 className="text-2xl font-bold mb-4">

                {item.title}

              </h3>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">

                {item.desc}

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* PLATFORM SHOWCASE */}

      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          <div>

            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-500 font-semibold text-sm">

              Built For Modern Learning

            </div>

            <h2 className="text-5xl font-bold leading-tight mb-8">

              One Integrated Platform
              For Students & Management

            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">

              Attendance, timetable, analytics, assignments,
              fee management, learning workflows, and
              performance tracking — unified into one ecosystem.

            </p>

            <div className="space-y-5">

              {[
                "Smart Attendance Management",
                "Batch & Timetable Scheduling",
                "Student Performance Analytics",
                "Integrated Finance System"
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-4"
                >

                  <div className="w-3 h-3 rounded-full bg-amber-500" />

                  <p className="font-medium">

                    {item}

                  </p>

                </div>

              ))}

            </div>

          </div>

          <div className="relative">

            <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-[40px]" />

            <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">

              <Image
                src="/image2.png"
                alt="Platform Preview"
                width={1200}
                height={900}
                className="w-full h-auto object-cover"
              />

            </div>

          </div>

        </div>

      </section>



{/* STUDENT JOURNEY */}
<Reveal >
<section className="max-w-7xl mx-auto px-6 py-28">
<div className="relative">

    {/* CENTER LINE */}

    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-violet-500 to-amber-500 -translate-x-1/2 opacity-30" />

    <div className="space-y-20">

      {[
        {
          step:"01",
          title:"Build Strong Fundamentals",
          desc:"Master programming concepts, logic building, development workflows, and engineering foundations."
        },
        {
          step:"02",
          title:"Learn Modern Technologies",
          desc:"Work with React, Node.js, databases, APIs, cloud systems, and modern development tools."
        },
        {
          step:"03",
          title:"Develop Real Projects",
          desc:"Build practical applications with industry-level architecture and production workflows."
        },
        {
          step:"04",
          title:"Collaborate & Deploy",
          desc:"Experience teamwork, Git workflows, deployment pipelines, and real engineering practices."
        },
        {
          step:"05",
          title:"Prepare For Industry",
          desc:"Strengthen portfolios, technical communication, interview preparation, and problem-solving."
        }
      ].map((item, index) => (

        <div
          key={item.step}
          className={`
            relative grid lg:grid-cols-2 gap-12 items-center
            ${index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""}
          `}
        >

          {/* CARD */}

          <div
            className="
              group relative overflow-hidden
              rounded-[32px]
              border border-slate-200 dark:border-white/10
              bg-white/70 dark:bg-white/[0.04]
              backdrop-blur-2xl
              p-10
              hover:-translate-y-2
              transition-all duration-500
            "
          >

            {/* GLOW */}

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">

              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />

            </div>

            <div className="relative z-10">

              <div
                className="
                  w-16 h-16 rounded-2xl
                  bg-gradient-to-br
                  from-indigo-500
                  to-violet-600
                  flex items-center justify-center
                  text-white font-bold text-xl
                  mb-8
                  shadow-lg shadow-indigo-500/20
                "
              >

                {item.step}

              </div>

              <h3 className="text-3xl font-bold mb-5">

                {item.title}

              </h3>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">

                {item.desc}

              </p>

            </div>

          </div>

          {/* VISUAL SIDE */}

          <div className="hidden lg:flex justify-center">

            <div
              className="
                relative w-72 h-72 rounded-full
                border border-white/10
                bg-gradient-to-br
                from-indigo-500/10
                via-violet-500/10
                to-amber-500/10
                backdrop-blur-xl
                flex items-center justify-center
              "
            >

              <div
                className="
                  w-40 h-40 rounded-full
                  bg-gradient-to-br
                  from-indigo-500
                  to-violet-600
                  opacity-80 blur-2xl
                "
              />

            </div>

          </div>

        </div>

      ))}

    </div>

  </div></section>
</Reveal>



      {/* COURSES */}

      <section className="max-w-7xl mx-auto px-6 py-28">

        <div className="flex justify-between items-end mb-16">

          <div>

            <h2 className="text-5xl font-bold mb-4">

              Premium Programs

            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-400">

              Explore industry-ready learning experiences.

            </p>
            {courses.slice(0,2).map((course) => (
              

        <CourseCard key={course._id}    course={course}  />))}

          </div>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {courses.slice(0,2).map((course) => (


            <Reveal >
              <CourseCard key={course._id} course={course}/>
            </Reveal>

          ))}

        </div>

      </section>

      {/* CTA SECTION */}
      <Reveal>

      <section className="max-w-7xl mx-auto px-6 py-32">

        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-r from-indigo-600 to-violet-700 p-16 md:p-24 text-center">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15),transparent_50%)]" />

          <div className="relative z-10">

            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-8">

              Start Building
              The Future Today.

            </h2>

            <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">

              Join FCA Academy and master technologies
              that modern companies actually use.

            </p>

            <button className="px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold hover:bg-slate-100 transition-all duration-300">

              Join FCA Academy

            </button>

          </div>

        </div>

      </section>

      </Reveal>


    </main>

  );

}
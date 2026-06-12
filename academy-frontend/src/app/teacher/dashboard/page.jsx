"use client";

import {
  BookOpen,
  CalendarDays,
  Bell,
  Users,
  ClipboardCheck,
  TrendingUp,
  ArrowRight,
  Clock3
} from "lucide-react";

import Link from "next/link";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

export default function TeacherDashboardPage(){

  const stats = [

    {
      title:"Assigned Batches",
      value:"8",
      icon:<BookOpen className="w-6 h-6" />,
      color:"from-violet-500 to-indigo-500"
    },

    {
      title:"Total Students",
      value:"214",
      icon:<Users className="w-6 h-6" />,
      color:"from-emerald-500 to-teal-500"
    },

    {
      title:"Attendance Pending",
      value:"3",
      icon:<ClipboardCheck className="w-6 h-6" />,
      color:"from-amber-500 to-orange-500"
    },

    {
      title:"Performance Avg",
      value:"87%",
      icon:<TrendingUp className="w-6 h-6" />,
      color:"from-pink-500 to-rose-500"
    }

  ];

  const todayClasses = [

    {
      subject:"Web Development",
      batch:"MERN-A",
      time:"10:00 AM - 11:30 AM"
    },

    {
      subject:"Data Structures",
      batch:"DSA-B",
      time:"12:00 PM - 1:30 PM"
    },

    {
      subject:"Java Programming",
      batch:"JAVA-C",
      time:"3:00 PM - 4:30 PM"
    }

  ];

  const notices = [

    {
      title:"Mid-term exams starting next week"
    },

    {
      title:"Attendance submission deadline today"
    },

    {
      title:"Faculty meeting scheduled for Friday"
    }

  ];

  return(

    <DashboardLayout role="TEACHER">

      <div className="space-y-8">

        {/* PAGE HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">

              Teacher Dashboard

            </h1>

            <p className="text-muted-foreground mt-1">

              Manage classes, attendance, students and academic activities.

            </p>

          </div>

          <div
            className="
              px-4
              py-3
              rounded-2xl
              border
              bg-card
              shadow-sm
              flex
              items-center
              gap-3
            "
          >

            <Clock3 className="w-5 h-5 text-indigo-500" />

            <div>

              <p className="text-xs text-muted-foreground">

                Today

              </p>

              <p className="font-semibold">

                Monday Schedule Active

              </p>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {
            stats.map((item,index) => (

              <div
                key={index}
                className="
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  bg-card
                  p-6
                  shadow-sm
                "
              >

                <div
                  className={`
                    absolute
                    inset-0
                    opacity-10
                    bg-gradient-to-br
                    ${item.color}
                  `}
                />

                <div className="relative flex items-start justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">

                      {item.title}

                    </p>

                    <h2 className="text-3xl font-bold mt-3">

                      {item.value}

                    </h2>

                  </div>

                  <div
                    className={`
                      p-3
                      rounded-2xl
                      text-white
                      bg-gradient-to-br
                      ${item.color}
                    `}
                  >

                    {item.icon}

                  </div>

                </div>

              </div>

            ))
          }

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* TODAY CLASSES */}

          <div
            className="
              xl:col-span-2
              bg-card
              border
              rounded-3xl
              shadow-sm
              overflow-hidden
            "
          >

            <div
              className="
                px-6
                py-5
                border-b
                flex
                items-center
                justify-between
              "
            >

              <div className="flex items-center gap-2">

                <CalendarDays className="w-5 h-5 text-indigo-500" />

                <h2 className="font-semibold text-lg">

                  Today's Classes

                </h2>

              </div>

              <Link
                href="/teacher/timetable"
                className="
                  text-sm
                  text-indigo-600
                  flex
                  items-center
                  gap-1
                  hover:underline
                "
              >

                View Schedule

                <ArrowRight className="w-4 h-4" />

              </Link>

            </div>

            <div className="divide-y">

              {
                todayClasses.map((item,index) => (

                  <div
                    key={index}
                    className="
                      p-5
                      flex
                      items-center
                      justify-between
                      hover:bg-muted/40
                      transition
                    "
                  >

                    <div>

                      <h3 className="font-semibold">

                        {item.subject}

                      </h3>

                      <p className="text-sm text-muted-foreground mt-1">

                        Batch: {item.batch}

                      </p>

                    </div>

                    <div
                      className="
                        px-4
                        py-2
                        rounded-xl
                        bg-indigo-50
                        text-indigo-700
                        text-sm
                        font-medium
                      "
                    >

                      {item.time}

                    </div>

                  </div>

                ))
              }

            </div>

          </div>

          {/* NOTICES */}

          <div
            className="
              bg-card
              border
              rounded-3xl
              shadow-sm
              overflow-hidden
            "
          >

            <div
              className="
                px-6
                py-5
                border-b
                flex
                items-center
                gap-2
              "
            >

              <Bell className="w-5 h-5 text-amber-500" />

              <h2 className="font-semibold text-lg">

                Latest Notices

              </h2>

            </div>

            <div className="divide-y">

              {
                notices.map((item,index) => (

                  <div
                    key={index}
                    className="
                      p-5
                      hover:bg-muted/40
                      transition
                    "
                  >

                    <p className="text-sm font-medium leading-relaxed">

                      {item.title}

                    </p>

                  </div>

                ))
              }

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}
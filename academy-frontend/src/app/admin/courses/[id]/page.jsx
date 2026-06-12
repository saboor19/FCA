"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";

import {
  BookOpen,
  Clock,
  Layers,
  IndianRupee,
  GraduationCap,
  Pencil,
  ArrowLeft,
  Users,
  FolderKanban,
  Hash
} from "lucide-react";

import { getCourse } from "@/services/admin/courseService";
import { getBatches } from "@/services/admin/batchService";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id;

  const [course, setCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const courseData = await getCourse(courseId);
      setCourse(courseData.data);

      const batchData = await getBatches();
      const filteredBatches = batchData.data.filter(
        (batch) => batch.course?._id === courseId
      );
      setBatches(filteredBatches);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Loading Course Details..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {course?.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Course Management Overview
            </p>
          </div>
          
          <Link
            href={`/admin/courses/${courseId}/edit`}
            className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm shrink-0"
          >
            <Pencil size={16} />
            Edit Course
          </Link>
        </div>

        {/* COURSE INFO CARD */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="text-slate-400" size={20} />
            Course Specifications
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Description spans 2 columns on larger screens */}
            <div className="md:col-span-2">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Description
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                {course?.description || "No description provided."}
              </p>
            </div>

            {/* Meta Data */}
            <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-border-custom">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-border-custom shrink-0">
                  <Clock size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</p>
                  <p className="font-medium text-foreground mt-0.5">{course?.duration || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-border-custom shrink-0">
                  <Layers size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Level</p>
                  <p className="font-medium text-foreground mt-0.5">{course?.level || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-border-custom shrink-0">
                  <IndianRupee size={18} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price</p>
                  <p className="font-medium text-foreground mt-0.5">₹{course?.price || "0"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


{/* MODULES CARD */}

<div className="bg-card border border-border-custom rounded-2xl p-6 md:p-8 shadow-sm">

  <div className="flex items-center justify-between mb-6">

    <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
      <FolderKanban
        className="text-slate-400"
        size={20}
      />
      Course Modules
    </h2>

    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
      {course?.modules?.length || 0} TOTAL
    </span>

  </div>

  {
    !course?.modules ||
    course.modules.length === 0 ? (

      <div className="text-center py-12 border border-dashed border-border-custom rounded-xl bg-slate-50/50 dark:bg-slate-900/20">

        <FolderKanban
          className="mx-auto text-slate-300 dark:text-slate-600 mb-3"
          size={32}
        />

        <p className="text-slate-500 dark:text-slate-400 font-medium">
          No modules added to this course yet.
        </p>

      </div>

    ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {
          course.modules
            .sort((a,b) =>
              a.order - b.order
            )
            .map((module,index) => (

            <div
              key={module._id || index}
              className="border border-border-custom rounded-xl p-5 bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all shadow-sm"
            >

              <div className="flex items-start justify-between mb-4">

                <div>

                  <h3 className="font-semibold text-foreground text-lg">
                    {module.title}
                  </h3>

                  {
                    module.code && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1">

                        <Hash size={12} />

                        <span>
                          {module.code}
                        </span>

                      </div>
                    )
                  }

                </div>

                <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  #{module.order}
                </div>

              </div>

              <div className="space-y-3">

                {
                  module.duration && (

                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">

                      <Clock
                        size={15}
                        className="text-blue-500"
                      />

                      <span>
                        {module.duration}
                      </span>

                    </div>

                  )
                }

                {
                  module.description && (

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {module.description}
                    </p>

                  )
                }

              </div>

            </div>

          ))
        }

      </div>

    )
  }

</div>




        {/* BATCHES CARD */}
        <div className="bg-card border border-border-custom rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
              <GraduationCap className="text-slate-400" size={20} />
              Assigned Batches
            </h2>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
              {batches.length} TOTAL
            </span>
          </div>

          {batches.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border-custom rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
              <GraduationCap className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={32} />
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No batches assigned to this course yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map((batch) => (
                <Link
                  key={batch._id}
                  href={`/admin/batches/${batch._id}`}
                  className="group flex items-center justify-between border border-border-custom rounded-xl p-5 bg-card hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm hover:shadow-md"
                >
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-amber-400 transition-colors">
                      {batch.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded uppercase tracking-wide">
                        {batch.studyMode}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 mb-1">
                      <Users size={14} /> Capacity
                    </span>
                    <span className="font-medium text-foreground">{batch.capacity}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
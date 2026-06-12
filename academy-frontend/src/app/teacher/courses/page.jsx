"use client";

import {
  useEffect,
  useState
} from "react";

import Link from "next/link";

import {

  BookOpen,
  Users,
  CalendarDays,
  Loader2,
  ArrowRight,
  Monitor,
  Building2

} from "lucide-react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import {
  getAssignedBatches
} from "@/services/teacher/batchService";

export default function TeacherCoursesPage(){

  const [batches,setBatches] =
    useState([]);

  const [loading,setLoading] =
    useState(true);

  useEffect(() => {

    fetchBatches();

  },[]);

  const fetchBatches = async() => {

    try{

      setLoading(true);

      const response =
        await getAssignedBatches();

      setBatches(response.data || []);

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };

  const getModeIcon = (mode) => {

    switch(mode){

      case "ONLINE":
        return (
          <Monitor className="w-4 h-4" />
        );

      default:
        return (
          <Building2 className="w-4 h-4" />
        );

    }

  };

  return(

    <DashboardLayout role="TEACHER">

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold">

            My Courses & Batches

          </h1>

          <p className="text-muted-foreground mt-1">

            View and manage your assigned classes.

          </p>

        </div>

        {/* CONTENT */}

        {
          loading ? (

            <div className="flex justify-center py-20">

              <Loader2
                className="
                  w-7
                  h-7
                  animate-spin
                "
              />

            </div>

          ) : batches.length === 0 ? (

            <div
              className="
                bg-card
                border
                rounded-3xl
                p-12
                text-center
              "
            >

              <BookOpen
                className="
                  w-12
                  h-12
                  mx-auto
                  text-muted-foreground
                  mb-4
                "
              />

              <h2 className="text-xl font-semibold">

                No batches assigned

              </h2>

              <p className="text-muted-foreground mt-2">

                Contact admin for batch assignment.

              </p>

            </div>

          ) : (

            <div
              className="
                grid
                grid-cols-1
                lg:grid-cols-2
                gap-6
              "
            >

              {
                batches.map((batch) => (

                  <div
                    key={batch._id}
                    className="
                      bg-card
                      border
                      rounded-3xl
                      p-6
                      shadow-sm
                      hover:shadow-md
                      transition
                    "
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div>

                        <h2 className="text-2xl font-bold">

                          {batch.name}

                        </h2>

                        <p className="text-indigo-600 font-medium mt-1">

                          {
                            batch.course?.title
                          }

                        </p>

                      </div>

                      <div
                        className="
                          px-3
                          py-2
                          rounded-xl
                          bg-indigo-50
                          text-indigo-700
                          flex
                          items-center
                          gap-2
                          text-sm
                          font-medium
                        "
                      >

                        {
                          getModeIcon(
                            batch.studyMode
                          )
                        }

                        {batch.studyMode}

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div
                      className="
                        mt-6
                        space-y-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          text-sm
                        "
                      >

                        <Users
                          className="
                            w-4
                            h-4
                            text-emerald-500
                          "
                        />

                        <span>

                          {batch.studentsCount|| 0}
                          {" "}Students

                        </span>

                      </div>

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          text-sm
                        "
                      >

                        <CalendarDays
                          className="
                            w-4
                            h-4
                            text-amber-500
                          "
                        />

                        <span>

                          {
                            new Date(
                              batch.startDate
                            ).toLocaleDateString()
                          }

                          {" "} - {" "}

                          {
                            new Date(
                              batch.endDate
                            ).toLocaleDateString()
                          }

                        </span>

                      </div>

                    </div>

                    {/* ACTION */}

                    <div className="mt-8">

                      <Link
                        href={`/teacher/courses/${batch._id}`}
                        className="
                          inline-flex
                          items-center
                          gap-2
                          text-indigo-600
                          font-medium
                          hover:underline
                        "
                      >

                        Open Batch

                        <ArrowRight className="w-4 h-4" />

                      </Link>

                    </div>

                  </div>

                ))
              }

            </div>

          )
        }

      </div>

    </DashboardLayout>

  );

}
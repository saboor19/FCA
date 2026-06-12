"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useParams
} from "next/navigation";

import {

  Users,
  CalendarDays,
  Clock3,
  Loader2,
  BookOpen,
  Activity,
  Mail,
  ArrowRight

} from "lucide-react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import {
  getBatchDetails
} from "@/services/teacher/batchService";

export default function TeacherBatchDetailsPage(){

  const params = useParams();

  const batchId =
    Array.isArray(params?.id)
      ? params.id[0]
      : params?.id;

  const [batch,setBatch] =
    useState(null);

  const [loading,setLoading] =
    useState(true);

  useEffect(() => {

    if(batchId){
      fetchBatch();
    }

  },[batchId]);

  const fetchBatch = async() => {

    try{

      setLoading(true);

      const response =
        await getBatchDetails(batchId);

      setBatch(response.data);

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };

  if(loading){

    return(

      <DashboardLayout role="TEACHER">

        <div className="flex justify-center py-20">

          <Loader2
            className="
              w-8
              h-8
              animate-spin
            "
          />

        </div>

      </DashboardLayout>

    );

  }

  if(!batch){

    return(

      <DashboardLayout role="TEACHER">

        <div className="text-center py-20">

          Batch not found

        </div>

      </DashboardLayout>

    );

  }

  return(

    <DashboardLayout role="TEACHER">

      <div className="space-y-8">

        {/* HEADER */}

        <div
          className="
            bg-card
            border
            rounded-3xl
            p-8
            shadow-sm
          "
        >

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-4xl font-bold">

                {batch.name}

              </h1>

              <p className="text-indigo-600 font-medium mt-2 text-lg">

                {batch.course?.title}

              </p>

              <p className="text-muted-foreground mt-4 max-w-2xl">

                {
                  batch.course?.description
                  ||
                  "No description available."
                }

              </p>

            </div>

            <div
              className="
                px-4
                py-3
                rounded-2xl
                bg-indigo-50
                text-indigo-700
                font-medium
              "
            >

              {batch.studyMode}

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            className="
              bg-card
              border
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-muted-foreground text-sm">

                  Students

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  {batch.students?.length || 0}

                </h2>

              </div>

              <Users
                className="
                  w-10
                  h-10
                  text-emerald-500
                "
              />

            </div>

          </div>

          <div
            className="
              bg-card
              border
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-muted-foreground text-sm">

                  Start Date

                </p>

                <h2 className="text-lg font-bold mt-2">

                  {
                    new Date(
                      batch.startDate
                    ).toLocaleDateString()
                  }

                </h2>

              </div>

              <CalendarDays
                className="
                  w-10
                  h-10
                  text-amber-500
                "
              />

            </div>

          </div>

          <div
            className="
              bg-card
              border
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-muted-foreground text-sm">

                  Capacity

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  {batch.capacity}

                </h2>

              </div>

              <BookOpen
                className="
                  w-10
                  h-10
                  text-violet-500
                "
              />

            </div>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* STUDENTS */}

          <div
            className="
              xl:col-span-2
              bg-card
              border
              rounded-3xl
              shadow-sm
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

                <Users className="w-5 h-5" />

                <h2 className="font-semibold text-lg">

                  Students

                </h2>

              </div>

            </div>

            <div className="divide-y">

              {
                batch.students?.length > 0 ? (

                  batch.students.map((student) => (

                    <div
                      key={student._id}
                      className="
                        p-5
                        flex
                        items-center
                        justify-between
                        hover:bg-muted/40
                      "
                    >

                      <div>

                        <h3 className="font-semibold">

                          {
                            student.userId?.fullName
                          }

                        </h3>

                        <p
                          className="
                            text-sm
                            text-muted-foreground
                            mt-1
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <Mail className="w-4 h-4" />

                          {
                            student.userId?.email
                          }

                        </p>

                      </div>

                      <button
                        className="
                          text-indigo-600
                          flex
                          items-center
                          gap-1
                          text-sm
                          font-medium
                        "
                      >

                        View

                        <ArrowRight className="w-4 h-4" />

                      </button>

                    </div>

                  ))

                ) : (

                  <div className="p-8 text-center text-muted-foreground">

                    No students assigned

                  </div>

                )
              }

            </div>

          </div>

          {/* SIDEBAR */}

          <div className="space-y-6">

            {/* UPCOMING CLASSES */}

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

                <Clock3 className="w-5 h-5" />

                <h2 className="font-semibold">

                  Upcoming Classes

                </h2>

              </div>

              <div className="divide-y">

                {
                  [
                    "React Fundamentals",
                    "API Integration",
                    "Authentication System"
                  ].map((item,index) => (

                    <div
                      key={index}
                      className="p-5"
                    >

                      <p className="font-medium">

                        {item}

                      </p>

                      <p
                        className="
                          text-sm
                          text-muted-foreground
                          mt-1
                        "
                      >

                        Tomorrow • 10:00 AM

                      </p>

                    </div>

                  ))
                }

              </div>

            </div>

            {/* ACTIVITY */}

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

                <Activity className="w-5 h-5" />

                <h2 className="font-semibold">

                  Recent Activity

                </h2>

              </div>

              <div className="divide-y">

                {
                  [
                    "Attendance marked",
                    "Assignment uploaded",
                    "New student joined"
                  ].map((item,index) => (

                    <div
                      key={index}
                      className="p-5"
                    >

                      <p className="text-sm font-medium">

                        {item}

                      </p>

                    </div>

                  ))
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>

  );

}
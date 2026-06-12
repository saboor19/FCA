"use client";

import {
  useEffect,
  useState
} from "react";

import {

  CalendarDays,
  Clock3,
  Loader2,
  Users,
  BookOpen

} from "lucide-react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import {
  getTeacherTimetable
} from "@/services/teacher/timetableService";

const DAYS = [

  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY"

];

export default function TeacherTimetablePage(){

  const [timetable,setTimetable] =
    useState([]);

  const [loading,setLoading] =
    useState(true);

  useEffect(() => {

    fetchTimetable();

  },[]);

  const fetchTimetable = async() => {

    try{

      setLoading(true);

      const response =
        await getTeacherTimetable();

      setTimetable(response.data || []);

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };

  const getClassesForDay =
    (day) => {

      return timetable.filter(
        item =>
          item.dayOfWeek === day
      );

    };

  return(

    <DashboardLayout role="TEACHER">

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <h1 className="text-3xl font-bold">

            My Timetable

          </h1>

          <p className="text-muted-foreground mt-1">

            Weekly teaching schedule.

          </p>

        </div>

        {
          loading ? (

            <div className="flex justify-center py-20">

              <Loader2
                className="
                  w-8
                  h-8
                  animate-spin
                "
              />

            </div>

          ) : (

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {
                DAYS.map((day) => {

                  const classes =
                    getClassesForDay(day);

                  return(

                    <div
                      key={day}
                      className="
                        bg-card
                        border
                        rounded-3xl
                        shadow-sm
                        overflow-hidden
                      "
                    >

                      {/* DAY HEADER */}

                      <div
                        className="
                          px-6
                          py-5
                          border-b
                          bg-muted/30
                        "
                      >

                        <h2 className="font-bold text-lg">

                          {day}

                        </h2>

                      </div>

                      {/* CLASSES */}

                      <div className="divide-y">

                        {
                          classes.length > 0 ? (

                            classes.map((item) => (

                              <div
                                key={item._id}
                                className="p-5"
                              >

                                <div className="flex items-start justify-between">

                                  <div>

                                    <h3 className="font-semibold text-lg">

                                      {item.subject}

                                    </h3>

                                    <p
                                      className="
                                        text-indigo-600
                                        font-medium
                                        mt-1
                                      "
                                    >

                                      {
                                        item.batch?.name
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
                                      text-sm
                                      font-medium
                                    "
                                  >

                                    {item.mode}

                                  </div>

                                </div>

                                <div
                                  className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-5
                                    mt-5
                                    text-sm
                                    text-muted-foreground
                                  "
                                >

                                  <div className="flex items-center gap-2">

                                    <Clock3 className="w-4 h-4" />

                                    {item.startTime}
                                    {" - "}
                                    {item.endTime}

                                  </div>

                                  <div className="flex items-center gap-2">

                                    <BookOpen className="w-4 h-4" />

                                    {
                                      item.course?.title
                                    }

                                  </div>

                                  <div className="flex items-center gap-2">

                                    <Users className="w-4 h-4" />

                                    Room:
                                    {" "}
                                    {
                                      item.roomNumber
                                      || "N/A"
                                    }

                                  </div>

                                </div>

                              </div>

                            ))

                          ) : (

                            <div
                              className="
                                p-8
                                text-center
                                text-muted-foreground
                              "
                            >

                              No classes scheduled

                            </div>

                          )
                        }

                      </div>

                    </div>

                  );

                })
              }

            </div>

          )
        }
      </div>

    </DashboardLayout>

  );

}
"use client";

import {
  useEffect,
  useState
} from "react";

import Link from "next/link";

import {

  Bell,
  Loader2,
  ArrowRight,
  CalendarDays,
  ShieldAlert,
  BookOpen,
  Megaphone

} from "lucide-react";

import DashboardLayout
from "@/components/dashboard/DashboardLayout";

import {
  getTeacherNotices
} from "@/services/teacher/noticeService";

export default function TeacherNoticesPage(){

  const [notices,setNotices] =
    useState([]);

  const [loading,setLoading] =
    useState(true);

  useEffect(() => {

    fetchNotices();

  },[]);

  const fetchNotices = async() => {

    try{

      setLoading(true);

      const response =
        await getTeacherNotices();

      setNotices(
        response.data || []
      );

    }catch(error){

      console.log(error);

    }finally{

      setLoading(false);

    }

  };

  const getPriorityStyles =
    (priority) => {

      switch(priority){

        case "HIGH":

          return `
            bg-red-100
            text-red-700
          `;

        case "MEDIUM":

          return `
            bg-amber-100
            text-amber-700
          `;

        default:

          return `
            bg-emerald-100
            text-emerald-700
          `;

      }

    };

  const getTypeIcon =
    (type) => {

      switch(type){

        case "URGENT":

          return (
            <ShieldAlert
              className="
                w-5
                h-5
                text-red-500
              "
            />
          );

        case "ACADEMIC":

          return (
            <BookOpen
              className="
                w-5
                h-5
                text-indigo-500
              "
            />
          );

        default:

          return (
            <Megaphone
              className="
                w-5
                h-5
                text-amber-500
              "
            />
          );

      }

    };

  return(

    <DashboardLayout role="TEACHER">

      <div className="space-y-8">

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-5
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-bold
                tracking-tight
              "
            >

              Notices

            </h1>

            <p
              className="
                text-muted-foreground
                mt-2
              "
            >

              Stay updated with
              academic announcements,
              schedules and important
              updates.

            </p>

          </div>

          <div
            className="
              px-5
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

            <Bell
              className="
                w-5
                h-5
                text-indigo-500
              "
            />

            <div>

              <p
                className="
                  text-xs
                  text-muted-foreground
                "
              >

                Total Notices

              </p>

              <p className="font-semibold">

                {
                  notices.length
                }

              </p>

            </div>

          </div>

        </div>

        {/* LIST */}

        <div
          className="
            bg-card
            border
            rounded-3xl
            overflow-hidden
            shadow-sm
          "
        >

          {
            loading ? (

              <div
                className="
                  py-24
                  flex
                  justify-center
                "
              >

                <Loader2
                  className="
                    w-10
                    h-10
                    animate-spin
                  "
                />

              </div>

            ) : notices.length > 0 ? (

              <div className="divide-y">

                {
                  notices.map(
                    (notice) => {

                      const isRead =
                        notice.readBy?.some(
                          (item) =>
                            item.user
                            === notice.user
                        );

                      return(

                        <Link
                          key={notice._id}
                          href={
                            `/teacher/notices/${notice._id}`
                          }
                          className="
                            block
                            p-6
                            hover:bg-muted/40
                            transition
                          "
                        >

                          <div
                            className="
                              flex
                              flex-col
                              lg:flex-row
                              lg:items-start
                              lg:justify-between
                              gap-5
                            "
                          >

                            {/* LEFT */}

                            <div
                              className="
                                flex
                                items-start
                                gap-4
                              "
                            >

                              <div
                                className="
                                  mt-1
                                "
                              >

                                {
                                  getTypeIcon(
                                    notice.type
                                  )
                                }

                              </div>

                              <div>

                                <div
                                  className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                  "
                                >

                                  <h2
                                    className="
                                      text-lg
                                      font-semibold
                                    "
                                  >

                                    {
                                      notice.title
                                    }

                                  </h2>

                                  <span
                                    className={`
                                      px-3
                                      py-1
                                      rounded-full
                                      text-xs
                                      font-medium
                                      ${getPriorityStyles(
                                        notice.priority
                                      )}
                                    `}
                                  >

                                    {
                                      notice.priority
                                    }

                                  </span>

                                  {
                                    !isRead && (

                                      <span
                                        className="
                                          px-3
                                          py-1
                                          rounded-full
                                          text-xs
                                          font-medium
                                          bg-indigo-100
                                          text-indigo-700
                                        "
                                      >

                                        New

                                      </span>

                                    )
                                  }

                                </div>

                                <p
                                  className="
                                    text-sm
                                    text-muted-foreground
                                    mt-3
                                    leading-relaxed
                                    line-clamp-2
                                  "
                                >

                                  {
                                    notice.description
                                  }

                                </p>

                                <div
                                  className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-5
                                    mt-4
                                  "
                                >

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-2
                                      text-sm
                                      text-muted-foreground
                                    "
                                  >

                                    <CalendarDays
                                      className="
                                        w-4
                                        h-4
                                      "
                                    />

                                    {
                                      new Date(
                                        notice.createdAt
                                      ).toLocaleDateString()
                                    }

                                  </div>

                                  <div
                                    className="
                                      text-sm
                                      text-muted-foreground
                                    "
                                  >

                                    Published By :
                                    {" "}
                                    <span className="font-medium">

                                      {
                                        notice.publishedBy
                                        ?.fullName
                                      }

                                    </span>

                                  </div>

                                </div>

                              </div>

                            </div>

                            {/* RIGHT */}

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                text-indigo-600
                                text-sm
                                font-medium
                              "
                            >

                              View Notice

                              <ArrowRight
                                className="
                                  w-4
                                  h-4
                                "
                              />

                            </div>

                          </div>

                        </Link>

                      );

                    }
                  )
                }

              </div>

            ) : (

              <div
                className="
                  py-24
                  text-center
                "
              >

                <Bell
                  className="
                    w-14
                    h-14
                    mx-auto
                    text-muted-foreground
                    mb-4
                  "
                />

                <h3
                  className="
                    text-xl
                    font-semibold
                  "
                >

                  No Notices Found

                </h3>

                <p
                  className="
                    text-muted-foreground
                    mt-2
                  "
                >

                  There are currently
                  no published notices.

                </p>

              </div>

            )
          }

        </div>

      </div>

    </DashboardLayout>

  );

}
"use client";

import Link from "next/link";



export default function
AssignmentCard({ assignment }){

  // ---------------- STATUS COLORS ----------------

  const statusColors = {

    NOT_STARTED:
    "bg-slate-100 text-slate-700",

    IN_PROGRESS:
    "bg-yellow-100 text-yellow-700",

    SUBMITTED:
    "bg-blue-100 text-blue-700",

    GRADED:
    "bg-green-100 text-green-700",

    LATE:
    "bg-red-100 text-red-700"

  };



  // ---------------- BUTTON LABEL ----------------

  const buttonLabel = {

    NOT_STARTED:
    "Start Assignment",

    IN_PROGRESS:
    "Continue Attempt",

    SUBMITTED:
    "View Submission",

    GRADED:
    "View Result",

    LATE:
    "View Submission"

  };



  return(

    <div
      className="
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-slate-900
        p-5
        shadow-sm
      "
    >

      <div
        className="
          flex
          flex-col
          gap-5
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        {/* LEFT */}

        <div
          className="
            flex-1
          "
        >

          <h2
            className="
              text-lg
              md:text-xl
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {assignment.title}
          </h2>



          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-3
              text-sm
              text-slate-600
              dark:text-slate-400
            "
          >

            <span>
              Due:
              {" "}
              {
                new Date(
                  assignment.dueDate
                ).toLocaleDateString()
              }
            </span>



            <span>
              Marks:
              {" "}
              {assignment.totalMarks}
            </span>

          </div>



          <div
            className="
              mt-4
            "
          >

            <span
              className={`
                inline-flex
                rounded-full
                px-3
                py-1
                text-xs
                font-medium
                ${
                  statusColors[
                    assignment
                    .submissionStatus
                  ]
                }
              `}
            >
              {
                assignment
                .submissionStatus
              }
            </span>

          </div>

        </div>



        {/* RIGHT */}

        <div
          className="
            w-full
            md:w-auto
          "
        >

          <Link
            href={
              `/student/assignments/${assignment._id}`
            }
            className="
              inline-flex
              w-full
              items-center
              justify-center
              rounded-2xl
              bg-slate-900
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
              dark:bg-white
              dark:text-slate-900
              md:w-auto
            "
          >
            {
              buttonLabel[
                assignment
                .submissionStatus
              ]
            }
          </Link>

        </div>

      </div>

    </div>

  );

}

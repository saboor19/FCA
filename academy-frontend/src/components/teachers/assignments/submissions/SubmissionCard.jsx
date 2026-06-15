"use client";

import Link
from "next/link";

export default function
SubmissionCard({submission}){

  return(

    <div
      className="
        rounded-2xl
        border
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-slate-900
        p-5
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h3
            className="
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {
              submission.student
              ?.fullName
            }
          </h3>

          <p
            className="
              text-sm
              text-slate-500
            "
          >
            {
              submission.student
              ?.email
            }
          </p>

        </div>



        <div
          className="
            text-right
          "
        >

          <p>
            Status:
            {" "}
            {submission.status}
          </p>

          <p>
            Marks:
            {" "}
            {submission.obtainedMarks}
          </p>

        </div>



        <Link
          href={
            `/teacher/submissions/${submission._id}`
          }
          className="
            px-4
            py-2
            rounded-xl
            bg-slate-900
            text-white
          "
        >
          Review
        </Link>

      </div>

    </div>

  );

}
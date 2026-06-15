
import AssignmentCard
from "./AssignmentCard";



export default function
AssignmentList({

  assignments,
  loading

}){

  // ---------------- LOADING ----------------

  if(loading){

    return(

      <div
        className="
          grid
          gap-4
        "
      >

        {
          [1,2,3].map((item)=>(
            <div
              key={item}
              className="
                h-40
                rounded-2xl
                bg-white
                dark:bg-slate-900
                animate-pulse
              "
            />
          ))
        }

      </div>

    );

  }



  // ---------------- EMPTY ----------------

  if(assignments.length === 0){

    return(

      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          p-10
          text-center
        "
      >

        <h2
          className="
            text-lg
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          No assignments found
        </h2>

        <p
          className="
            mt-2
            text-sm
            text-slate-500
          "
        >
          Assignments will appear here
        </p>

      </div>

    );

  }



  // ---------------- LIST ----------------

  return(

    <div
      className="
        grid
        gap-4
      "
    >

      {
        assignments.map(
          (assignment)=>(
            <AssignmentCard
              key={assignment._id}
              assignment={assignment}
            />
          )
        )
      }

    </div>

  );

}

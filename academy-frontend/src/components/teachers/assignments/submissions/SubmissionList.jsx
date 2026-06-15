import SubmissionCard
from "./SubmissionCard";

export default function
SubmissionList({

  submissions,
  loading

}){

  if(loading){

    return(
      <div className="space-y-4">
        {[1,2,3].map((item)=>(
          <div
            key={item}
            className="
              h-24
              rounded-2xl
              bg-white
              dark:bg-slate-900
              animate-pulse
            "
          />
        ))}
      </div>
    );
  }



  if(submissions.length===0){

    return(

      <div
        className="
          rounded-2xl
          border
          border-dashed
          border-slate-300
          p-10
          text-center
        "
      >

        No submissions found

      </div>

    );

  }



  return(

    <div className="space-y-4">

      {
        submissions.map(
          (submission)=>(
            <SubmissionCard
              key={submission._id}
              submission={submission}
            />
          )
        )
      }

    </div>

  );

}
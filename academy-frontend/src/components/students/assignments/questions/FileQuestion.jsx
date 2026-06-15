
export default function
FileQuestion({

  question,
  index

}){

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
      "
    >

      <h2
        className="
          text-base
          md:text-lg
          font-semibold
          text-slate-900
          dark:text-white
        "
      >
        Q{index + 1}.
        {" "}
        {question.question}
      </h2>



      <div
        className="
          mt-5
          rounded-2xl
          border
          border-dashed
          border-slate-300
          p-6
          text-center
          text-sm
          text-slate-500
        "
      >
        File upload UI coming next
      </div>

    </div>

  );

}

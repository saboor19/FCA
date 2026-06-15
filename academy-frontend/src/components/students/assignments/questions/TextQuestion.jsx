
export default function
TextQuestion({

  question,
  index,
  answers,
  setAnswers

}){

  const currentAnswer =
  answers.find(
    (answer)=>
      answer.questionId
      ===
      question._id
  );



  const handleChange =
  (value)=>{

    const filteredAnswers =
    answers.filter(
      (answer)=>
        answer.questionId
        !==
        question._id
    );



    setAnswers([

      ...filteredAnswers,

      {
        questionId:question._id,
        answerText:value
      }

    ]);

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
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
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



        <span
          className="
            rounded-full
            bg-slate-100
            px-3
            py-1
            text-xs
            font-medium
            text-slate-600
          "
        >
          {question.marks} Marks
        </span>

      </div>



      <textarea
        rows={8}
        value={
          currentAnswer?.answerText
          || ""
        }
        onChange={(e)=>
          handleChange(
            e.target.value
          )
        }
        placeholder="Write your answer here..."
        className="
          mt-5
          w-full
          rounded-2xl
          border
          border-slate-300
          dark:border-slate-700
          bg-transparent
          p-4
          text-sm
          outline-none
          focus:ring-2
          focus:ring-slate-400
        "
      />

    </div>

  );

}

export default function
McqQuestion({

  question,
  index,
  answers,
  setAnswers

}){

  // ---------------- CURRENT ANSWER ----------------

  const currentAnswer =
  answers.find(
    (answer)=>
      answer.questionId
      ===
      question._id
  );



  // ---------------- CHANGE HANDLER ----------------

  const handleOptionChange =
  (option)=>{

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
        selectedOption:option
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

      {/* QUESTION */}

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



      {/* OPTIONS */}

      <div
        className="
          mt-5
          space-y-3
        "
      >

        {
          question.options.map(
            (option)=>(
              <label
                key={option}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  rounded-2xl
                  border
                  border-slate-200
                  dark:border-slate-700
                  p-4
                  transition
                  hover:bg-slate-50
                  dark:hover:bg-slate-800
                "
              >

                <input
                  type="radio"
                  name={question._id}
                  checked={
                    currentAnswer
                    ?.selectedOption
                    ===
                    option
                  }
                  onChange={()=>
                    handleOptionChange(
                      option
                    )
                  }
                />



                <span
                  className="
                    text-sm
                    text-slate-700
                    dark:text-slate-300
                  "
                >
                  {option}
                </span>

              </label>
            )
          )
        }

      </div>

    </div>

  );

}

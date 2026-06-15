const autoGradeMcqs =
({
  questions,
  answers
}) => {

  let obtainedMarks = 0;



  const evaluatedAnswers =
    answers.map((answer) => {

      const question =
        questions.find(
          (q) =>
            q._id.toString()
            ===
            answer.questionId.toString()
        );



      if(!question){

        return answer;

      }



      if(
        question.type === "MCQ"
      ){

        const isCorrect =
          question.correctAnswer
          ===
          answer.selectedOption;



        const marks =
          isCorrect
            ? question.marks
            : 0;



        obtainedMarks += marks;



        return {
          ...answer,
          marksAwarded:marks
        };

      }



      return answer;

    });



  return {
    obtainedMarks,
    evaluatedAnswers
  };

};



module.exports =
autoGradeMcqs;
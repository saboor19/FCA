import McqQuestion
from "./McqQuestion";

import TextQuestion
from "./TextQuestion";

import FileQuestion
from "./FileQuestion";



export default function
QuestionRenderer({

  question,
  index,
  answers,
  setAnswers

}){

  switch(question.type){

    case "MCQ":

      return(

        <McqQuestion
          question={question}
          index={index}
          answers={answers}
          setAnswers={setAnswers}
        />

      );



    case "TEXT":

      return(

        <TextQuestion
          question={question}
          index={index}
          answers={answers}
          setAnswers={setAnswers}
        />

      );



    case "FILE":

      return(

        <FileQuestion
          question={question}
          index={index}
          answers={answers}
          setAnswers={setAnswers}
        />

      );



    default:

      return null;

  }

}

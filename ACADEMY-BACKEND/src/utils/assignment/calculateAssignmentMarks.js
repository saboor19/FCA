const calculateAssignmentMarks =
({
  obtainedMarks,
  totalMarks,
  latePenalty = 0
}) => {

  let finalMarks =
    obtainedMarks;



  // APPLY LATE PENALTY
  if(latePenalty > 0){

    finalMarks =
      finalMarks - latePenalty;

    if(finalMarks < 0){

      finalMarks = 0;

    }

  }



  // CALCULATE PERCENTAGE
  const percentage =
    totalMarks > 0
      ? (
          (
            finalMarks /
            totalMarks
          ) * 100
        ).toFixed(2)
      : 0;



  return {
    obtainedMarks:finalMarks,
    percentage:Number(
      percentage
    )
  };

};



module.exports =
calculateAssignmentMarks;
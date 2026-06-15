const Assignment =
require("../../models/Assignment");

const AssignmentSubmission =
require("../../models/AssignmentSubmission");



const validateAssignmentAttempt =
async({
  assignmentId,
  studentId
}) => {

  const assignment =
    await Assignment.findById(
      assignmentId
    );



  if(!assignment){

    throw new Error(
      "Assignment not found"
    );

  }



  // CHECK STATUS
  if(
    assignment.status !==
    "PUBLISHED"
  ){

    throw new Error(
      "Assignment is not active"
    );

  }



  // CHECK DUE DATE
  const now = new Date();

  if(
    now > assignment.dueDate &&
    !assignment.allowLateSubmission
  ){

    throw new Error(
      "Assignment deadline passed"
    );

  }



  // CHECK ATTEMPTS
  const submissions =
    await AssignmentSubmission.find({
      assignmentId,
      studentId
    }).sort({
      attemptNumber:-1
    });



  if(
    submissions.length >=
    assignment.maxAttempts
  ){

    throw new Error(
      "Maximum attempts reached"
    );

  }



  // CHECK RETRY DELAY
  if(
    submissions.length > 0 &&
    assignment.retryDelay > 0
  ){

    const lastSubmission =
      submissions[0];



    const retryTime =
      new Date(
        lastSubmission.createdAt
      );



    retryTime.setMinutes(
      retryTime.getMinutes()
      +
      assignment.retryDelay
    );



    if(now < retryTime){

      throw new Error(
        "Retry delay not completed"
      );

    }

  }



  return {
    assignment,
    nextAttempt:
      submissions.length + 1
  };

};



module.exports =
validateAssignmentAttempt;
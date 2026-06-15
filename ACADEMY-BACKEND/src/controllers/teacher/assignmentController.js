const Assignment =
require("../../models/Assignment");

const Batch =
require("../../models/Batch");

const AssignmentSubmission = 
require("../../models/AssignmentSubmission");

const Teacher =
require("../../models/Teacher");

const Student =
require("../../models/Student");

const validateTeacherAssignment =
require("../../utils/assignment/validateTeacherAssignment");

exports.createAssignment = async(req,res) => {

  try{

    const {
      title,
      description,
      instructions,
      type,
      batchId,
      moduleId,
      questions,
      attachments,
      passingMarks,
      dueDate,
      timeLimit,
      autoSubmit,
      maxAttempts,
      retryDelay,
      allowResubmission,
      allowLateSubmission,
      latePenalty,
      shuffleQuestions,
      showResultImmediately,
      showCorrectAnswers,
      requireSafeBrowser
    } = req.body;



    // GET TEACHER
    const teacher =
      await Teacher.findOne({
        userId:req.user._id
      });



    if(!teacher){

      return res.status(404).json({
        success:false,
        message:"Teacher not found"
      });

    }



    // VALIDATE ASSIGNMENT ACCESS
    const {
      batch,
      module
    } =
    await validateTeacherAssignment({
      teacherId:teacher._id,
      batchId,
      moduleId
    });



    // CALCULATE TOTAL MARKS
    let totalMarks = 0;

    if(
      questions &&
      questions.length > 0
    ){

totalMarks =
  questions.reduce(
    (acc,question) =>
      acc + (question.marks || 0),
    0
  );
}



    // CREATE ASSIGNMENT
    const assignment =
      await Assignment.create({

        title,

        description,

        instructions,

        type,



        batchId,

        moduleId,

        courseId:
          batch.course._id,

        teacherId:
          teacher._id,



        questions:
          questions || [],

        attachments:
          attachments || [],



        totalMarks,

        passingMarks:
          passingMarks || 0,



        dueDate,

        timeLimit,

        autoSubmit,



        maxAttempts,

        retryDelay,

        allowResubmission,



        allowLateSubmission,

        latePenalty,



        shuffleQuestions,

        showResultImmediately,

        showCorrectAnswers,

        requireSafeBrowser,



        status:"DRAFT"

      });



    return res.status(201).json({

      success:true,

      message:
        "Assignment created successfully",

      assignment

    });

  }
  catch(error){
  console.log(error);

  return res.status(500).json({
    success:false,
    message:error.message,
    stack:error.stack
  });

  }

};


exports.getSingleAssignment = async(req,res) => {

  try{

    const assignment =
      await Assignment.findById(
        req.params.id
      )

      .populate(
        "batchId",
        "name"
      )

      .populate(
        "courseId",
        "title"
      )

      .populate(
        "teacherId"
      );



    if(!assignment){

      return res.status(404).json({

        success:false,

        message:
          "Assignment not found"

      });

    }
    const teacher =  await Teacher.findOne({    userId:req.user._id  });


    if(  assignment.teacherId.toString() !== teacher._id.toString()){ return res.status(403).json({

        success:false,

        message: "You do not have access to this assignment"
      }); }



    return res.status(200).json({

      success:true,

      assignment

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.getTeacherAssignments = async(req,res) => {

  try{

    const teacher =
      await Teacher.findOne({
        userId:req.user._id
      });
      



    if(!teacher){

      return res.status(404).json({
        success:false,
        message:"Teacher not found"
      });

    }



    const assignments =
      await Assignment.find({

        teacherId:
          teacher._id

      })

      .populate(
        "batchId",
        "name"
      )

      .populate(
        "courseId",
        "title"
      )

      .sort({
        createdAt:-1
      });
      console.log(assignments);

      // if( assignment.teacherId.toString()!==  teacher._id.toString()){ return res.status(403).json({

      //   success:false,

      //   message: "You do not have access to this assignment"
      // }); }



    return res.status(200).json({

    success:true,

      count:
        assignments.length,

      assignments

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.updateAssignment = async(req,res) => {

  try{

    const assignment =
      await Assignment.findById(
        req.params.id
      );



    if(!assignment){

      return res.status(404).json({

        success:false,

        message:
          "Assignment not found"

      });

    }
         const teacher =  await Teacher.findOne({    userId:req.user._id  });


    if(  assignment.teacherId.toString() !== teacher._id.toString()){ return res.status(403).json({

        success:false,

        message: "You do not have access to this assignment"
      }); }



    // BLOCK UPDATE IF CLOSED
    if(
      assignment.status ===
      "CLOSED"
    ){

      return res.status(400).json({

        success:false,

        message:
          "Closed assignment cannot be edited"

      });

    }



    const updateData =
      req.body;



    // RECALCULATE MARKS
    if(updateData.questions){

      updateData.totalMarks =
        updateData.questions.reduce(
          (acc,question) =>
            acc +
            (
              question.marks || 0
            ),
          0
        );

    }



    const updatedAssignment =
      await Assignment.findByIdAndUpdate(

        req.params.id,

        updateData,

        {
          new:true,
          runValidators:true
        }

      );



    return res.status(200).json({

      success:true,

      message:
        "Assignment updated successfully",

      assignment:
        updatedAssignment

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.publishAssignment = async(req,res) => {

  try{

    const assignment =
      await Assignment.findById(
        req.params.id
      );



    if(!assignment){

      return res.status(404).json({

        success:false,

        message:
          "Assignment not found"

      });

    }
      const teacher =  await Teacher.findOne({    userId:req.user._id  });


    if(  assignment.teacherId.toString() !== teacher._id.toString()){ return res.status(403).json({

        success:false,

        message: "You do not have access to this assignment"
      }); }


       



    assignment.status =
      "PUBLISHED";

    assignment.publishedAt =
      new Date();



    await assignment.save();



    return res.status(200).json({

      success:true,

      message:
        "Assignment published successfully",

      assignment

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.closeAssignment = async(req,res) => {

  try{

    const assignment =
      await Assignment.findById(
        req.params.id
      );



    if(!assignment){

      return res.status(404).json({

        success:false,

        message:
          "Assignment not found"

      });

    }

  const teacher =  await Teacher.findOne({    userId:req.user._id  });


    if(  assignment.teacherId.toString() !== teacher._id.toString()){ return res.status(403).json({

        success:false,

        message: "You do not have access to this assignment"
      }); }




    assignment.status =
      "CLOSED";

    assignment.closedAt =
      new Date();



    await assignment.save();



    return res.status(200).json({

      success:true,

      message:
        "Assignment closed successfully",

      assignment

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

exports.deleteAssignment = async(req,res) => {

  try{

    const assignment =
      await Assignment.findById(
        req.params.id
      );



    if(!assignment){

      return res.status(404).json({

        success:false,

        message:
          "Assignment not found"

      });

    }
      const teacher =  await Teacher.findOne({    userId:req.user._id  });


    if(  assignment.teacherId.toString() !== teacher._id.toString()){ return res.status(403).json({

        success:false,

        message: "You do not have access to this assignment"
      }); }

    

    await assignment.deleteOne();



    return res.status(200).json({

      success:true,

      message:
        "Assignment deleted successfully"

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};


exports.getAssignmentSubmissions =
async(req,res)=>{

  try{

    const teacher =
    await Teacher.findOne({
      userId:req.user._id
    });

    if(!teacher){

      return res.status(404).json({
        success:false,
        message:"Teacher not found"
      });

    }

    const assignment =
    await Assignment.findById(
      req.params.assignmentId
    );

    if(!assignment){

      return res.status(404).json({
        success:false,
        message:"Assignment not found"
      });

    }

    if(
      assignment.teacherId.toString()
      !==
      teacher._id.toString()
    ){

      return res.status(403).json({
        success:false,
        message:
          "You do not have access to this assignment"
      });

    }

const submissions =
await AssignmentSubmission.find({
  assignmentId:req.params.assignmentId
})

.populate({
  path:"studentId",
  select:"fullName email profileImage"
})

.populate({
  path:"gradedBy",
  select:"fullName"
})

.sort({
  submittedAt:-1
});



const formattedSubmissions =
submissions.map(
  (submission)=>({

    _id:
      submission._id,

    student:
      submission.studentId,

    status:
      submission.status,

    obtainedMarks:
      submission.obtainedMarks,

    percentage:
      submission.percentage,

    submittedAt:
      submission.submittedAt,

    gradedAt:
      submission.gradedAt,

    answerCount:
      submission.answers.length,

    feedback:
      submission.feedback

  })
);

    return res.status(200).json({

  success:true,

  count:
    formattedSubmissions.length,

  submissions:
    formattedSubmissions


    });

  }
  catch(error){

    return res.status(500).json({

      success:false,
      message:error.message

    });

  }

};


exports.getSingleSubmission =
async(req,res)=>{

  try{

    const teacher =
    await Teacher.findOne({
      userId:req.user._id
    });

    if(!teacher){

      return res.status(404).json({
        success:false,
        message:"Teacher not found"
      });

    }

    const submission =
    await AssignmentSubmission.findById(
      req.params.submissionId
    )

   .populate({
  path:"studentId",
  populate:{
    path:"userId",
    select:"fullName email"
  }
})

    .populate(
      "assignmentId"
    );



    if(!submission){

      return res.status(404).json({

        success:false,
        message:"Submission not found"

      });

    }



    const assignment =
      submission.assignmentId;



    if(

      assignment.teacherId.toString()
      !==
      teacher._id.toString()

    ){

      return res.status(403).json({

        success:false,
        message:
          "You do not have access to this submission"

      });

    }



    return res.status(200).json({

      success:true,

      submission

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,
      message:error.message

    });

  }

};


exports.gradeSubmission =
async(req,res)=>{

  try{

    const {
      answers,
      feedback
    } = req.body;



    const teacher =
    await Teacher.findOne({
      userId:req.user._id
    });



    if(!teacher){

      return res.status(404).json({

        success:false,
        message:"Teacher not found"

      });

    }



    const submission =
    await AssignmentSubmission.findById(
      req.params.submissionId
    )

    .populate(
      "assignmentId"
    );



    if(!submission){

      return res.status(404).json({

        success:false,
        message:"Submission not found"

      });

    }



    if(

      submission.assignmentId.teacherId.toString()
      !==
      teacher._id.toString()

    ){

      return res.status(403).json({

        success:false,
        message:
          "You do not have access to this submission"

      });

    }



    let obtainedMarks = 0;



    submission.answers =
    submission.answers.map(
      (answer)=>{

        const gradedAnswer =
        answers.find(
          (item)=>
            item.questionId ===
            answer.questionId.toString()
        );



        if(gradedAnswer){

          answer.marksAwarded =
            gradedAnswer.marksAwarded || 0;

          answer.teacherRemark =
            gradedAnswer.teacherRemark || "";



          obtainedMarks +=
            answer.marksAwarded;

        }

        return answer;

      }
    );



    submission.obtainedMarks =
      obtainedMarks;



    submission.percentage =
      submission.assignmentId
      .totalMarks > 0

      ?

      (
        obtainedMarks /
        submission.assignmentId
        .totalMarks
      ) * 100

      :

      0;



    submission.feedback =
      feedback || "";



    submission.status =
      "GRADED";



    submission.gradedBy =
      teacher._id;



    submission.gradedAt =
      new Date();



    await submission.save();



    return res.status(200).json({

      success:true,

      message:
        "Submission graded successfully",

      submission

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,
      message:error.message

    });

  }

};

const Assignment =
require("../../models/Assignment");

const AssignmentSubmission =
require("../../models/AssignmentSubmission");

const Student =
require("../../models/Student");



exports.getStudentAssignments = async(req,res)=>{

  try{

    // ---------------- STUDENT ----------------
    const student =
    await Student.findOne({
      userId:req.user.id
    });

    if(!student){
      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }
    // ---------------- ASSIGNMENTS ----------------
    const assignments =
    await Assignment.find({
      batchId:{
        $in:student.batches
      },
      status:"PUBLISHED"

    })
    .sort({
      createdAt:-1
    });

    // ---------------- SUBMISSIONS ----------------

    const submissions =
    await AssignmentSubmission.find({
      studentId:student._id
    });

    // ---------------- MAP SUBMISSIONS ----------------

    const formattedAssignments =
    assignments.map(
      (assignment)=>{
        const submission =
        submissions.find(
          (sub)=>
            sub.assignmentId.toString()
            ===
            assignment._id.toString()
        );
        return {
          _id:assignment._id,
          title:assignment.title,
          description:
            assignment.description,
          dueDate:
            assignment.dueDate,
          totalMarks:
            assignment.totalMarks,
          assignmentStatus:
            assignment.status,
          submissionStatus:
            submission
              ? submission.status
              : "NOT_STARTED",
          submittedAt:
            submission
              ? submission.submittedAt
              : null,
          obtainedMarks:
            submission
              ? submission.obtainedMarks
              : 0
        };

      }
    );

    // ---------------- RESPONSE ----------------

    return res.status(200).json({

      success:true,

      count:
        formattedAssignments.length,
      assignments:
        formattedAssignments
    });

  }

  catch(error){

    console.log(error);
    return res.status(500).json({

      success:false,
      message:"Server error"

    });

  }

};


exports.getStudentAssignmentById = async(req,res)=>{

  try{

    // ---------------- PARAMS ----------------

    const { assignmentId } =
    req.params;



    // ---------------- STUDENT ----------------

    const student =
    await Student.findOne({
      userId:req.user.id
    });



    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }



    // ---------------- ASSIGNMENT ----------------

    const assignment =
    await Assignment.findById(
      assignmentId
    );



    if(!assignment){

      return res.status(404).json({
        success:false,
        message:"Assignment not found"
      });

    }



    // ---------------- STATUS ----------------

    if(
      assignment.status !==
      "PUBLISHED"
    ){

      return res.status(400).json({
        success:false,
        message:
          "Assignment is not published"
      });

    }



    // ---------------- BATCH VALIDATION ----------------

    const isStudentInBatch =
    student.batches.some(
      (batchId)=>
        batchId.toString()
        ===
        assignment.batchId.toString()
    );



    if(!isStudentInBatch){

      return res.status(403).json({
        success:false,
        message:
          "You are not assigned to this batch"
      });

    }



    // ---------------- SUBMISSION ----------------

    const submission =
    await AssignmentSubmission.findOne({

      assignmentId,

      studentId:student._id

    })
    .sort({
      createdAt:-1
    });



    // ---------------- ATTEMPTS ----------------

    const attemptCount =
    await AssignmentSubmission.countDocuments({

      assignmentId,

      studentId:student._id,

      status:{
        $in:[
          "SUBMITTED",
          "LATE",
          "GRADED",
          "AUTO_SUBMITTED"
        ]
      }

    });



    // ---------------- REMAINING ATTEMPTS ----------------

    const remainingAttempts =
      assignment.maxAttempts
      - attemptCount;



    // ---------------- CAN ATTEMPT ----------------

    let canAttempt = true;



    if(
      remainingAttempts <= 0
    ){

      canAttempt = false;

    }



    // ---------------- DUE DATE ----------------

    const isPastDueDate =
      new Date() >
      new Date(assignment.dueDate);



    if(
      isPastDueDate &&
      !assignment.allowLateSubmission
    ){

      canAttempt = false;

    }



    // ---------------- RESPONSE ----------------

    return res.status(200).json({

      success:true,

      assignment,

      submission,

      canAttempt,

      remainingAttempts

    });

  }

  catch(error){

    console.log(error);



    return res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};


exports.startAssignmentAttempt = async(req,res)=>{

  try{

    // ---------------- PARAMS ----------------

    const { assignmentId } =
    req.params;



    // ---------------- STUDENT ----------------

    const student =
    await Student.findOne({
      userId:req.user.id
    });



    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }



    // ---------------- ASSIGNMENT ----------------

    const assignment =
    await Assignment.findById(
      assignmentId
    );



    if(!assignment){

      return res.status(404).json({
        success:false,
        message:"Assignment not found"
      });

    }



    // ---------------- STATUS VALIDATION ----------------

    if(
      assignment.status !==
      "PUBLISHED"
    ){

      return res.status(400).json({
        success:false,
        message:
          "Assignment is not published"
      });

    }



    // ---------------- BATCH VALIDATION ----------------

    const isStudentInBatch =
    student.batches.some(
      (batchId)=>
        batchId.toString() ===
        assignment.batchId.toString()
    );



    if(!isStudentInBatch){

      return res.status(403).json({
        success:false,
        message:
          "You are not assigned to this batch"
      });

    }



    // ---------------- DUE DATE VALIDATION ----------------

    const isPastDueDate =
      new Date() >
      new Date(assignment.dueDate);



    if(
      isPastDueDate &&
      !assignment.allowLateSubmission
    ){

      return res.status(400).json({
        success:false,
        message:
          "Assignment submission deadline has passed"
      });

    }



    // ---------------- EXISTING DRAFT ----------------

    const existingSubmission =
    await AssignmentSubmission.findOne({

      assignmentId,

      studentId:student._id,

      status:"IN_PROGRESS"

    });



    if(existingSubmission){

      return res.status(200).json({

        success:true,

        message:
          "Existing assignment attempt found",

        submission:existingSubmission

      });

    }



    // ---------------- ATTEMPT COUNT ----------------

    const previousAttempts =
    await AssignmentSubmission.countDocuments({

      assignmentId,

      studentId:student._id,

      status:{
        $in:[
          "SUBMITTED",
          "LATE",
          "GRADED",
          "AUTO_SUBMITTED"
        ]
      }

    });



    // ---------------- MAX ATTEMPTS ----------------

    if(
      previousAttempts >=
      assignment.maxAttempts
    ){

      return res.status(400).json({

        success:false,

        message:
          "Maximum assignment attempts reached"

      });

    }



    // ---------------- CREATE SUBMISSION ----------------

    const submission =
    await AssignmentSubmission.create({

      assignmentId,

      studentId:student._id,

      batchId:assignment.batchId,

      attemptNumber:
        previousAttempts + 1,

      startedAt:new Date(),

      status:"IN_PROGRESS"

    });



    // ---------------- RESPONSE ----------------

    return res.status(201).json({

      success:true,

      message:
        "Assignment attempt started successfully",

      submission

    });

  }

  catch(error){

    console.log(error);



    return res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};


exports.saveAssignmentAnswers = async(req,res)=>{

  try{

    // ---------------- PARAMS ----------------

    const { submissionId } =
    req.params;



    // ---------------- BODY ----------------

    const { answers } =
    req.body;



    // ---------------- STUDENT ----------------

    const student =
    await Student.findOne({
      userId:req.user.id
    });



    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }



    // ---------------- SUBMISSION ----------------

    const submission =
    await AssignmentSubmission.findById(
      submissionId
    );



    if(!submission){

      return res.status(404).json({
        success:false,
        message:"Submission not found"
      });

    }



    // ---------------- OWNERSHIP ----------------

    if(
      submission.studentId.toString()
      !==
      student._id.toString()
    ){

      return res.status(403).json({
        success:false,
        message:
          "Unauthorized submission access"
      });

    }



    // ---------------- STATUS ----------------

    if(
      submission.status !==
      "IN_PROGRESS"
    ){

      return res.status(400).json({
        success:false,
        message:
          "Cannot edit submitted assignment"
      });

    }



    // ---------------- ASSIGNMENT ----------------

    const assignment =
    await Assignment.findById(
      submission.assignmentId
    );



    if(!assignment){

      return res.status(404).json({
        success:false,
        message:"Assignment not found"
      });

    }



    // ---------------- VALID QUESTION IDS ----------------

    const validQuestionIds =
    assignment.questions.map(
      (question)=>
        question._id.toString()
    );



    for(const answer of answers){

      if(
        !validQuestionIds.includes(
          answer.questionId
        )
      ){

        return res.status(400).json({

          success:false,

          message:
            "Invalid question detected"

        });

      }

    }



    // ---------------- SAVE ANSWERS ----------------

    submission.answers = answers;



    await submission.save();



    // ---------------- RESPONSE ----------------

    return res.status(200).json({

      success:true,

      message:
        "Answers saved successfully",

      submission

    });

  }

  catch(error){

    console.log(error);



    return res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};


exports.submitAssignment = async(req,res)=>{

  try{

    // ---------------- PARAMS ----------------

    const { submissionId } =
    req.params;



    // ---------------- STUDENT ----------------

    const student =
    await Student.findOne({
      userId:req.user.id
    });



    if(!student){

      return res.status(404).json({
        success:false,
        message:"Student not found"
      });

    }



    // ---------------- SUBMISSION ----------------

    const submission =
    await AssignmentSubmission.findById(
      submissionId
    );



    if(!submission){

      return res.status(404).json({
        success:false,
        message:"Submission not found"
      });

    }



    // ---------------- OWNERSHIP ----------------

    if(
      submission.studentId.toString()
      !==
      student._id.toString()
    ){

      return res.status(403).json({
        success:false,
        message:
          "Unauthorized submission access"
      });

    }



    // ---------------- STATUS ----------------

    if(
      submission.status !==
      "IN_PROGRESS"
    ){

      return res.status(400).json({
        success:false,
        message:
          "Assignment already submitted"
      });

    }



    // ---------------- ASSIGNMENT ----------------

    const assignment =
    await Assignment.findById(
      submission.assignmentId
    );



    if(!assignment){

      return res.status(404).json({
        success:false,
        message:"Assignment not found"
      });

    }



    // ---------------- REQUIRED QUESTIONS ----------------

    const requiredQuestions =
    assignment.questions.filter(
      (question)=>
        question.required
    );



    for(const question of requiredQuestions){

      const answer =
      submission.answers.find(
        (ans)=>
          ans.questionId.toString()
          ===
          question._id.toString()
      );



      if(!answer){

        return res.status(400).json({

          success:false,

          message:
            "Please answer all required questions"

        });

      }



      // ---------------- MCQ VALIDATION ----------------

      if(
        question.type === "MCQ" &&
        !answer.selectedOption
      ){

        return res.status(400).json({

          success:false,

          message:
            "Please answer all required MCQ questions"

        });

      }



      // ---------------- TEXT VALIDATION ----------------

      if(
        question.type === "TEXT" &&
        !answer.answerText
      ){

        return res.status(400).json({

          success:false,

          message:
            "Please answer all required text questions"

        });

      }



      // ---------------- FILE VALIDATION ----------------

      if(
        question.type === "FILE" &&
        (
          !answer.uploadedFiles ||
          answer.uploadedFiles.length === 0
        )
      ){

        return res.status(400).json({

          success:false,

          message:
            "Please upload all required files"

        });

      }

    }



    // ---------------- AUTO MCQ GRADING ----------------

    let obtainedMarks = 0;



    submission.answers.forEach(
      (answer)=>{

        const question =
        assignment.questions.find(
          (q)=>
            q._id.toString()
            ===
            answer.questionId.toString()
        );



        if(!question) return;



        if(
          question.type === "MCQ"
        ){

          if(
            answer.selectedOption ===
            question.correctAnswer
          ){

            obtainedMarks +=
            question.marks;



            answer.marksAwarded =
            question.marks;

          }

        }

      }
    );



    // ---------------- PERCENTAGE ----------------

    let percentage = 0;



    if(assignment.totalMarks > 0){

      percentage =
      (
        obtainedMarks /
        assignment.totalMarks
      ) * 100;

    }



    // ---------------- LATE SUBMISSION ----------------

    const isLateSubmission =
      new Date() >
      new Date(assignment.dueDate);



    // ---------------- STATUS ----------------

    let finalStatus =
    "SUBMITTED";



    if(isLateSubmission){

      finalStatus = "LATE";

    }



    // ---------------- FINAL SAVE ----------------

    submission.obtainedMarks =
    obtainedMarks;

    submission.percentage =
    percentage;

    submission.submittedAt =
    new Date();

    submission.isLateSubmission =
    isLateSubmission;

    submission.status =
    finalStatus;



    await submission.save();



    // ---------------- RESPONSE ----------------

    return res.status(200).json({

      success:true,

      message:
        "Assignment submitted successfully",

      submission

    });

  }

  catch(error){

    console.log(error);



    return res.status(500).json({

      success:false,

      message:"Server error"

    });

  }

};




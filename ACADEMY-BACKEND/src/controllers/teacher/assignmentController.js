const Assignment =
require("../../models/Assignment");

const Batch =
require("../../models/Batch");

const Teacher =
require("../../models/Teacher");

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

      parseInt(totalMarks) =
        questions.reduce(
          (acc,question) =>
            acc +
            (
              question.marks || 0
            ),
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

    return res.status(500).json({

      success:false,

      message:error.message

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
      if( assignment.teacherId.toString()!==  teacher._id.toString()){ return res.status(403).json({

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

          if( assignment.teacherId.toString()!==  teacher._id.toString()){ return res.status(403).json({

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
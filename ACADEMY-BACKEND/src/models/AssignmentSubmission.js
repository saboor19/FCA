const mongoose = require("mongoose");



// ---------------- ANSWER SCHEMA ----------------

const answerSchema =
new mongoose.Schema({

  questionId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },



  answerText:{
    type:String
  },



  selectedOption:{
    type:String
  },



  uploadedFiles:[
    {

      fileId:{
        type:mongoose.Schema.Types.ObjectId
      },

      filename:String,

      contentType:String

    }
  ],



  marksAwarded:{
    type:Number,
    default:0
  },



  teacherRemark:{
    type:String
  }

},
{
  _id:false
});



// ---------------- SUBMISSION SCHEMA ----------------

const assignmentSubmissionSchema =
new mongoose.Schema({

  assignmentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Assignment",
    required:true
  },



  studentId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    required:true
  },



  batchId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch"
  },



  // ---------------- ATTEMPTS ----------------

  attemptNumber:{
    type:Number,
    default:1
  },



  startedAt:{
    type:Date,
    default:Date.now
  },



  submittedAt:{
    type:Date
  },



  // ---------------- STATUS ----------------

  status:{
    type:String,
    enum:[
      "IN_PROGRESS",
      "SUBMITTED",
      "LATE",
      "GRADED",
      "AUTO_SUBMITTED"
    ],
    default:"IN_PROGRESS"
  },



  // ---------------- ANSWERS ----------------

  answers:[
    answerSchema
  ],



  // ---------------- GRADING ----------------

  obtainedMarks:{
    type:Number,
    default:0
  },



  percentage:{
    type:Number,
    default:0
  },

  feedback:{
    type:String
  },

  gradedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher"
  },

  gradedAt:{
    type:Date
  },

  // ---------------- FLAGS ----------------

  isLateSubmission:{
    type:Boolean,
    default:false
  },



  plagiarismScore:{
    type:Number,
    default:0
  }

},
{
  timestamps:true
});

assignmentSubmissionSchema.index({
  assignmentId:1,
  studentId:1,
  status:1
});


module.exports =
mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
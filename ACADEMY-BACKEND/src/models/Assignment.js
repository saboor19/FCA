const mongoose = require("mongoose");



// ---------------- QUESTION SCHEMA ----------------

const questionSchema =
new mongoose.Schema({

  question:{
    type:String,
    required:true
  },



  type:{
    type:String,
    enum:[
      "MCQ",
      "TEXT",
      "FILE"
    ],
    required:true
  },



  options:[
    {
      type:String
    }
  ],



  correctAnswer:{
    type:String
  },



  marks:{
    type:Number,
    default:0
  },



  required:{
    type:Boolean,
    default:true
  }

},
{
  _id:true
});



// ---------------- ATTACHMENT SCHEMA ----------------

const attachmentSchema =
new mongoose.Schema({

  fileId:{
    type:mongoose.Schema.Types.ObjectId
  },

  filename:String,

  contentType:String

},
{
  _id:false
});



// ---------------- ASSIGNMENT SCHEMA ----------------

const assignmentSchema =
new mongoose.Schema({

  title:{
    type:String,
    required:true,
    trim:true
  },



  description:{
    type:String,
    default:""
  },



  instructions:[
    {
      type:String
    }
  ],



  type:{
    type:String,
    enum:[
      "MCQ",
      "DESCRIPTIVE",
      "FILE_UPLOAD",
      "MIXED"
    ],
    default:"DESCRIPTIVE"
  },



  // ---------------- RELATIONS ----------------

  batchId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch",
    required:true
  },



  courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
  },



  moduleId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },



  teacherId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true
  },



  // ---------------- QUESTIONS ----------------

  questions:[
    questionSchema
  ],



  // ---------------- FILES ----------------

  attachments:[
    attachmentSchema
  ],



  // ---------------- MARKS ----------------

  totalMarks:{
    type:Number,
    default:0
  },



  passingMarks:{
    type:Number,
    default:0
  },



  // ---------------- TIMING ----------------

  dueDate:{
    type:Date,
    required:true
  },



  timeLimit:{
    type:Number,
    default:null
  },



  autoSubmit:{
    type:Boolean,
    default:true
  },



  // ---------------- ATTEMPTS ----------------

  maxAttempts:{
    type:Number,
    default:1
  },



  retryDelay:{
    type:Number,
    default:0
  },



  allowResubmission:{
    type:Boolean,
    default:false
  },



  // ---------------- SUBMISSION RULES ----------------

  allowLateSubmission:{
    type:Boolean,
    default:false
  },



  latePenalty:{
    type:Number,
    default:0
  },



  // ---------------- VISIBILITY ----------------

  status:{
    type:String,
    enum:[
      "DRAFT",
      "PUBLISHED",
      "CLOSED"
    ],
    default:"DRAFT"
  },



  publishedAt:{
    type:Date
  },



  closedAt:{
    type:Date
  },



  // ---------------- SETTINGS ----------------

  shuffleQuestions:{
    type:Boolean,
    default:false
  },



  showResultImmediately:{
    type:Boolean,
    default:false
  },



  showCorrectAnswers:{
    type:Boolean,
    default:false
  },



  requireSafeBrowser:{
    type:Boolean,
    default:false
  }

},
{
  timestamps:true
});



module.exports =
mongoose.model(
  "Assignment",
  assignmentSchema
);
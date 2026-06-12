const mongoose = require("mongoose");

// ---------------- TEACHER ASSIGNMENT SCHEMA ----------------

const teacherAssignmentSchema =
new mongoose.Schema({

  teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true
  },

  modules:[

    {
      type:mongoose.Schema.Types.ObjectId,
      required:true
    }

  ]

},
{
  _id:true
});

// ---------------- BATCH SCHEMA ----------------

const batchSchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true
  },

  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },

  // ---------------- MODULE-WISE TEACHERS ----------------

  teacherAssignments:[
    teacherAssignmentSchema
  ],

  students:[

    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Student"
    }

  ],

  studyMode:{
    type:String,
    enum:[
      "ONLINE",
      "OFFLINE",
      "HYBRID"
    ],
    default:"OFFLINE"
  },

  meetingLink:String,

  roomNumber:String,

  startDate:{
    type:Date,
    required:true
  },

  endDate:{
    type:Date,
    required:true
  },

  capacity:{
    type:Number,
    default:30
  },

  isActive:{
    type:Boolean,
    default:true
  }

},
{
  timestamps:true
});

module.exports =
mongoose.model("Batch",batchSchema);
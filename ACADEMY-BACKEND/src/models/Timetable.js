const mongoose = require("mongoose");

const timetableSchema =
new mongoose.Schema({

  batch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch",
    required:true
  },

  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },

  teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true
  },

  subject:{
    type:String,
    required:true,
    trim:true
  },

  dayOfWeek:{
    type:String,
    enum:[
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    ],
    required:true
  },

  startTime:{
    type:String,
    required:true
  },

  endTime:{
    type:String,
    required:true
  },

  roomNumber:String,

  meetingLink:String,

  mode:{
    type:String,
    enum:[
      "ONLINE",
      "OFFLINE",
      "HYBRID"
    ],
    default:"OFFLINE"
  },

  isActive:{
    type:Boolean,
    default:true
  }

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "Timetable",
  timetableSchema
);
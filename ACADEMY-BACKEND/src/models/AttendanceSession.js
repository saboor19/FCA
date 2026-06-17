const mongoose = require("mongoose");

const attendanceSessionSchema =
new mongoose.Schema({

  batch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch",
    required:true
  },

  teacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true
  },

  sessionDate:{
    type:Date,
    default:Date.now
  },

  mode:{
    type:String,
    enum:[
      "ONLINE",
      "OFFLINE"
    ],
    required:true
  },

  attendanceCode:String,

  expiresAt:Date,

  isActive:{
    type:Boolean,
    default:true
  }

},
{
  timestamps:true
});

module.exports =
mongoose.model(
  "AttendanceSession",
  attendanceSessionSchema
);
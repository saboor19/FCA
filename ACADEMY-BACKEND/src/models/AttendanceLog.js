const mongoose = require("mongoose");

const attendanceLogSchema =
new mongoose.Schema({

  session:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"AttendanceSession"
  },

  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    required:true
  },

  latitude:Number,

  longitude:Number,

  markedAt:{
    type:Date,
    default:Date.now
  }

},
{
  timestamps:true
});

module.exports =
mongoose.model(
  "AttendanceLog",
  attendanceLogSchema
);
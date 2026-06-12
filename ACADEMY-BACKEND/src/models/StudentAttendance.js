const mongoose = require("mongoose");

const studentAttendanceSchema =
new mongoose.Schema({

  enrollment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Enrollment",
    required:true
  },

  markedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  date:{
    type:Date,
    required:true
  },

  status:{
    type:String,
    enum:[
      "PRESENT",
      "ABSENT",
      "LATE",
      "LEAVE"
    ],
    default:"PRESENT"
  },

  remarks:String

},{
  timestamps:true
});

studentAttendanceSchema.index(
  {
    enrollment:1,
    date:1
  },
  {
    unique:true
  }
);

module.exports =
mongoose.model(
  "StudentAttendance",
  studentAttendanceSchema
);
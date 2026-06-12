const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
{
  student:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student",
    required:true
  },

  batch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch",
    required:true
  },

  enrolledAt:{
    type:Date,
    default:Date.now
  },

  status:{
    type:String,
    enum:[
      "ACTIVE",
      "COMPLETED",
      "DROPPED"
    ],
    default:"ACTIVE"
  }
},
{
  timestamps:true
});

module.exports =
mongoose.model(
  "Enrollment",
  enrollmentSchema
);
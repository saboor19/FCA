const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    unique:true
  },

  enrollmentNo:{
    type:String,
    required:true,
    unique:true
  },

  phone:String,
  address:String,

  dateOfBirth:Date,

  admissionDate:{
    type:Date,
    default:Date.now
  },
batches:[
  {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch"
  }
],

  guardianName:String,
  guardianPhone:String,

  profileImage:String
},
{
  timestamps:true
}
);

module.exports =
mongoose.model("Student",studentSchema);
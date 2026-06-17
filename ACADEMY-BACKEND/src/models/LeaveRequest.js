const mongoose = require("mongoose");

const leaveRequestSchema =
new mongoose.Schema({

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

  fromDate:{
    type:Date,
    required:true
  },

  toDate:{
    type:Date,
    required:true
  },

  reason:{
    type:String,
    required:true
  },

teacherStatus:{
  type:String,
  enum:[
    "PENDING",
    "APPROVED",
    "REJECTED"
  ],
  default:"PENDING"
},

teacherReviewedBy:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
},

adminStatus:{
  type:String,
  enum:[
    "PENDING",
    "APPROVED",
    "REJECTED"
  ],
  default:"PENDING"
},

adminReviewedBy:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
},



  remarks:String

},
{
  timestamps:true
});

module.exports =
mongoose.model(
  "LeaveRequest",
  leaveRequestSchema
);
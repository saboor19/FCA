const mongoose = require("mongoose");

const enrollmentRequestSchema =
new mongoose.Schema({

  fullName:{
    type:String,
    required:true,
    trim:true
  },

  email:{
    type:String,
    required:true,
    lowercase:true,
    trim:true
  },

  phone:{
    type:String,
    required:true
  },

  gender:{
    type:String,
    enum:[
      "MALE",
      "FEMALE",
      "OTHER"
    ]
  },

  dateOfBirth:Date,

  address:String,

  guardianName:String,

  guardianPhone:String,

  currentEducation:String,

  institutionName:String,

  passingYear:Number,

  preferredCourse:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
  },

  interests:[
    {
      type:String
    }
  ],

  careerGoal:String,

  heardFrom:{
    type:String,
    enum:[
      "FACEBOOK",
      "INSTAGRAM",
      "WHATSAPP",
      "FRIEND",
      "GOOGLE",
      "YOUTUBE",
      "OTHER"
    ]
  },

  notes:String,

  status:{
    type:String,
    enum:[
      "PENDING",
      "APPROVED",
      "REJECTED"
    ],
    default:"PENDING"
  },

  reviewedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  reviewNotes:String

},{
  timestamps:true
});

module.exports =
mongoose.model(
  "EnrollmentRequest",
  enrollmentRequestSchema
);
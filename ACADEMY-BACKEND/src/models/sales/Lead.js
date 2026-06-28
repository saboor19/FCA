const mongoose = require("mongoose");

const {
  LEAD_STATUS,
  LEAD_PRIORITY,
  LEAD_SOURCE
} = require("../../constants/salesConstants");

const leadSchema = new mongoose.Schema(
{
  // ==================================================
  // IDENTITY
  // ==================================================

  leadNumber:{
    type:String,
    unique:true,
    trim:true
  },

  firstName:{
    type:String,
    required:true,
    trim:true
  },

  lastName:{
    type:String,
    trim:true,
    default:""
  },

  fullName:{
    type:String,
    required:true,
    trim:true
  },

  // ==================================================
  // CONTACT
  // ==================================================

  primaryPhone:{
    type:String,
    required:true,
    trim:true
  },

  alternatePhone:{
    type:String,
    trim:true
  },

  email:{
    type:String,
    lowercase:true,
    trim:true
  },

  whatsappNumber:{
    type:String,
    trim:true
  },

  // ==================================================
  // PERSONAL
  // ==================================================

  gender:{
    type:String,
    enum:[
      "MALE",
      "FEMALE",
      "OTHER"
    ]
  },

  dateOfBirth:Date,

  // ==================================================
  // ADDRESS
  // ==================================================

  country:String,

  state:String,

  city:String,

  address:String,

  pincode:String,

  // ==================================================
  // ACADEMIC
  // ==================================================

  qualification:String,

  institution:String,

  passingYear:Number,

  occupation:String,

  experience:{
    type:Number,
    default:0
  },

  // ==================================================
  // COURSE INTEREST
  // ==================================================

  interestedCourse:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course"
  },

  preferredBatch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch"
  },

  studyMode:{
    type:String,
    enum:[
      "ONLINE",
      "OFFLINE",
      "HYBRID"
    ]
  },

  preferredTiming:String,

  budget:Number,

  expectedJoiningDate:Date,

  // ==================================================
  // MARKETING
  // ==================================================

  source:{
    type:String,
    enum:LEAD_SOURCE,
    default:"OTHER"
  },

  subSource:String,

  campaign:String,

  referredBy:String,

  // ==================================================
  // OWNERSHIP
  // ==================================================

  leadOwner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam",
    required:true
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam",
    required:true
  },

  updatedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam"
  },

  // ==================================================
  // PIPELINE
  // ==================================================

  status:{
    type:String,
    enum:LEAD_STATUS,
    default:"NEW"
  },

  priority:{
    type:String,
    enum:LEAD_PRIORITY,
    default:"MEDIUM"
  },

  leadScore:{
    type:Number,
    min:0,
    max:100,
    default:0
  },

  // ==================================================
  // TRACKING
  // ==================================================

  lastContactedAt:Date,

  lastFollowupAt:Date,

  nextFollowupAt:Date,

  // ==================================================
  // CONVERSION
  // ==================================================

  isConverted:{
    type:Boolean,
    default:false
  },

  convertedUser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  convertedStudent:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Student"
  },

  convertedAt:Date,

  convertedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam"
  },

  // ==================================================
  // LOST
  // ==================================================

  lostReason:String,

  lostTo:String,

  // ==================================================
  // REMARKS
  // ==================================================

  initialRemarks:{
    type:String,
    trim:true
  },

  // ==================================================
  // SOFT DELETE
  // ==================================================

  isDeleted:{
    type:Boolean,
    default:false
  },

  deletedAt:Date,

  deletedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }

},
{
  timestamps:true
});

// ==================================================
// INDEXES
// ==================================================

// Search

leadSchema.index({
  primaryPhone:1,
  interestedCourse:1,
  isDeleted:1
});

leadSchema.index({
  email:1
});

// Dashboard

leadSchema.index({
  leadOwner:1,
  status:1,
  priority:1
});

leadSchema.index({
  status:1,
  nextFollowupAt:1
});

leadSchema.index({
  source:1,
  status:1
});

leadSchema.index({
  interestedCourse:1,
  status:1
});

// Conversion

leadSchema.index({
  isConverted:1
});

// Soft Delete

leadSchema.index({
  isDeleted:1
});

// Full Text Search

leadSchema.index({
  firstName:"text",
  lastName:"text",
  fullName:"text",
  email:"text",
  primaryPhone:"text",
  alternatePhone:"text"
});

module.exports = mongoose.model(
  "Lead",
  leadSchema
);
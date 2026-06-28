const mongoose = require("mongoose");

const {

FOLLOWUP_TYPE,

FOLLOWUP_STATUS,

CUSTOMER_RESPONSE,

LEAD_STATUS

} = require("../../constants/salesConstants");

// --------------------------------------------------
// ATTACHMENT SCHEMA
// --------------------------------------------------

const attachmentSchema =
new mongoose.Schema({

  fileId:{
    type:mongoose.Schema.Types.ObjectId
  },

  filename:String,

  contentType:String

},{
  _id:false
});

// --------------------------------------------------
// FOLLOWUP SCHEMA
// --------------------------------------------------

const leadFollowUpSchema =
new mongoose.Schema({

  // --------------------------------------------------
  // RELATIONS
  // --------------------------------------------------

  lead:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Lead",
    required:true
  },

  salesPerson:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam",
    required:true
  },

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SalesTeam",
    required:true
  },

  // --------------------------------------------------
  // SCHEDULE
  // --------------------------------------------------

  scheduledAt:{
    type:Date,
    required:true
  },

  completedAt:Date,

  nextFollowupAt:Date,

  // --------------------------------------------------
  // FOLLOWUP
  // --------------------------------------------------

  type:{
    type:String,
    enum:FOLLOWUP_TYPE,
    required:true
  },

  status:{
    type:String,
    enum:FOLLOWUP_STATUS,
    default:"PENDING"
  },

  customerResponse:{
    type:String,
    enum:CUSTOMER_RESPONSE
  },

  updatedLeadStatus:{
    type:String,
    enum:LEAD_STATUS
  },

  // --------------------------------------------------
  // DISCUSSION
  // --------------------------------------------------

  discussion:{
    type:String,
    trim:true
  },

  internalRemarks:{
    type:String,
    trim:true
  },

  duration:{
    type:Number,
    default:0
  },

  // --------------------------------------------------
  // ATTACHMENTS
  // --------------------------------------------------

  attachments:[
    attachmentSchema
  ]

},{
  timestamps:true
});

// --------------------------------------------------
// INDEXES
// --------------------------------------------------

leadFollowUpSchema.index({

  lead:1,

  completedAt:-1

});

leadFollowUpSchema.index({

  salesPerson:1,

  status:1

});

leadFollowUpSchema.index({

  status:1,

  scheduledAt:1

});

leadFollowUpSchema.index({

  status:1,

  nextFollowupAt:1

});

module.exports =
mongoose.model(
"LeadFollowUp",
leadFollowUpSchema
);
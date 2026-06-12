const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({

  title:{
    type:String,
    required:true,
    trim:true
  },

  description:{
    type:String,
    required:true
  },

  type:{
    type:String,
    enum:[
      "GENERAL",
      "ACADEMIC",
      "EXAM",
      "HOLIDAY",
      "EVENT",
      "FEE",
      "URGENT"
    ],
    default:"GENERAL"
  },
  views:{
  type:Number,
  default:0
},



  targetAudience:{
    type:String,
    enum:[
      "ALL",
      "STUDENTS",
      "TEACHERS",
      "STAFF",
      "BATCH"
    ],
    default:"ALL"
  },

  batches:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Batch"
    }
  ],

  publishedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  attachments:[
    {
      fileName:String,
      fileUrl:String
    }
  ],

  priority:{
    type:String,
    enum:[
      "LOW",
      "MEDIUM",
      "HIGH"
    ],
    default:"MEDIUM"
  },

  isPublished:{
    type:Boolean,
    default:true
  },

  publishDate:{
    type:Date,
    default:Date.now
  },

  expiryDate:{
    type:Date
  },

  createdAt:{
    type:Date,
    default:Date.now
  },readBy:[
  {
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },

    readAt:{
      type:Date,
      default:Date.now
    }
  }
]

});

module.exports =
mongoose.model(
  "Notice",
  noticeSchema
);
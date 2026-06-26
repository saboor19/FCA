const mongoose = require("mongoose");

// ---------------- ATTACHMENT SCHEMA ----------------

const attachmentSchema =
new mongoose.Schema(
{

fileId:{
type:mongoose.Schema.Types.ObjectId,
required:true
},

filename:{
type:String,
required:true
},

originalName:{
type:String,
required:true
},

contentType:{
type:String,
required:true
},

extension:{
type:String
},

size:{
type:Number,
default:0
},

uploadedBy:{
type:mongoose.Schema.Types.ObjectId,
ref:"Teacher",
required:true
},

uploadedAt:{
type:Date,
default:Date.now
},

downloadCount:{
type:Number,
default:0
},

isPreviewable:{
type:Boolean,
default:false
}

},
{
_id:true
}
);

// ---------------- STUDY MATERIAL SCHEMA ----------------

const studyMaterialSchema = new mongoose.Schema(
{

  // Auto Generated
  materialNumber:{
    type:String,
    unique:true
  },

  title:{
    type:String,
    required:true,
    trim:true
  },

  summary:{
    type:String,
    default:"",
    trim:true
  },

  body:{
    type:String,
    default:""
  },

  type:{
    type:String,
    enum:[
      "NOTES",
      "PDF",
      "VIDEO",
      "SLIDES",
      "DOCUMENT",
      "CHEATSHEET",
      "CODE",
      "LAB",
      "REFERENCE",
      "OTHER"
    ],
    default:"NOTES"
  },

  // ---------------- COURSE ----------------

  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true
  },

  // Embedded module inside Course
  moduleId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },

  // ---------------- BATCH ----------------

  sourceBatch:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Batch",
    required:true
  },

  sharedBatches:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Batch"
    }
  ],

  visibility:{
    type:String,
    enum:[
      "BATCH_ONLY",
      "SHARED_BATCHES"
    ],
    default:"BATCH_ONLY"
  },

  // ---------------- STATUS ----------------

  status:{
    type:String,
    enum:[
      "DRAFT",
      "PUBLISHED",
      "ARCHIVED"
    ],
    default:"DRAFT"
  },

  difficulty:{
    type:String,
    enum:[
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED"
    ],
    default:"BEGINNER"
  },

  // Order inside module
  serialOrder:{
    type:Number,
    default:1
  },

  attachments:[
    attachmentSchema
  ],

  thumbnail:{
    type:String,
    default:""
  },

  tags:[
    {
      type:String,
      trim:true
    }
  ],

  estimatedReadTime:{
    type:Number,
    default:0
  },

  isDownloadable:{
    type:Boolean,
    default:true
  },

  // ---------------- ANALYTICS ----------------

  downloadCount:{
    type:Number,
    default:0
  },

  viewCount:{
    type:Number,
    default:0
  },

  // ---------------- AUDIT ----------------

  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true
  },

  updatedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher"
  },

  publishedAt:{
    type:Date
  },

  version:{
    type:Number,
    default:1
  },

  // ---------------- SOFT DELETE ----------------

  isDeleted:{
    type:Boolean,
    default:false
  },

  deletedAt:{
    type:Date
  },

  deletedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }

},
{
  timestamps:true
});

// ---------------- INDEXES ----------------

studyMaterialSchema.index({
  course:1,
  moduleId:1
});

studyMaterialSchema.index({
  sourceBatch:1
});

studyMaterialSchema.index({
  status:1
});

// studyMaterialSchema.index({
//   materialNumber:1
// });

studyMaterialSchema.index({

createdBy:1,

status:1

});

studyMaterialSchema.index({

course:1,

status:1

});

studyMaterialSchema.index({

type:1

});

studyMaterialSchema.index({

title:"text",

summary:"text",

tags:"text"

});

module.exports =
mongoose.model(
  "StudyMaterial",
  studyMaterialSchema
);
const mongoose =
require("mongoose");

const APIFeatures = require("../../utils/apiFeatures");

const StudyMaterial =
require("../../models/StudyMaterial");

const Batch =
require("../../models/Batch");

const Course =
require("../../models/Course");

const Teacher =
require("../../models/Teacher");

const {
getGridFSBucket
}=
require("../../config/gridfs");

const {
generateMaterialNumber
} =
require("../../utils/materialNumberGenerator");

const { isPreviewable} = require("../../utils/fileHelpers");

const { formatFileSize }=require("../../utils/fileUtils");


//-----------CREATE STUDY MATERIAL AS DRAFT---------
exports.createStudyMaterial = async (req, res, next) => {

try {

const teacher =
await Teacher.findOne({
userId: req.user.id
});

if (!teacher) {

return res.status(404).json({
success: false,
message: "Teacher not found."
});

}

const {

title,
summary,
body,
type,
course,
moduleId,
sourceBatch,
sharedBatches = [],
visibility,
difficulty,
serialOrder,
tags,
estimatedReadTime,
isDownloadable

} = req.body;

// ----------------------------------------------------
// Validate Source Batch
// ----------------------------------------------------

const batch =
await Batch.findById(sourceBatch);

if (!batch) {

return res.status(404).json({
success: false,
message: "Batch not found."
});

}

// ----------------------------------------------------
// Validate Course
// ----------------------------------------------------

if (batch.course.toString() !== course) {

return res.status(400).json({
success: false,
message: "Selected batch does not belong to the selected course."
});

}

// ----------------------------------------------------
// Verify Teacher Assignment
// ----------------------------------------------------

const teacherAssignment =
batch.teacherAssignments.find(

assignment =>

assignment.teacher.toString() ===
teacher._id.toString()

);

if (!teacherAssignment) {

return res.status(403).json({
success: false,
message: "You are not assigned to this batch."
});

}

// ----------------------------------------------------
// Verify Module Permission
// ----------------------------------------------------

const hasModulePermission =
teacherAssignment.modules.some(

id => id.toString() === moduleId

);

if (!hasModulePermission) {

return res.status(403).json({
success: false,
message: "You are not assigned to teach this module."
});

}

// ----------------------------------------------------
// Validate Course
// ----------------------------------------------------

const courseExists =
await Course.findById(course);

if (!courseExists) {

return res.status(404).json({
success: false,
message: "Course not found."
});

}

// ----------------------------------------------------
// Validate Module
// ----------------------------------------------------

const moduleExists =
courseExists.modules.some(

module =>

module._id.toString() === moduleId

);

if (!moduleExists) {

return res.status(404).json({
success: false,
message: "Module not found."
});

}

// ----------------------------------------------------
// Validate Shared Batches
// ----------------------------------------------------

if (sharedBatches.length) {

const batches =
await Batch.find({

_id: {
$in: sharedBatches
}

});

if (batches.length !== sharedBatches.length) {

return res.status(404).json({
success: false,
message: "One or more shared batches do not exist."
});

}

const invalidBatch =
batches.find(

batch =>

batch.course.toString() !== course

);

if (invalidBatch) {

return res.status(400).json({
success: false,
message: "Study material can only be shared with batches of the same course."
});

}

}

// ----------------------------------------------------
// Generate Material Number
// ----------------------------------------------------

const materialNumber =
await generateMaterialNumber();

// ----------------------------------------------------
// Create Material
// ----------------------------------------------------

const material =
await StudyMaterial.create({

materialNumber,

title,

summary,

body,

type,

course,

moduleId,

sourceBatch,

sharedBatches,

visibility,

difficulty,

serialOrder,

tags,

estimatedReadTime,

isDownloadable,

createdBy: teacher._id,

updatedBy: teacher._id,

version: 1

});

// ----------------------------------------------------
// Response
// ----------------------------------------------------

return res.status(201).json({

success: true,

message: "Study material created successfully.",

material

});

} catch (error) {

next(error);

}

};


//======================ATTACHMENTTS==============
exports.downloadStudyMaterialAttachment = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Attachment
// ----------------------------------------------------

const attachment =
material.attachments.id(

req.params.attachmentId

);

if(!attachment){

return res.status(404).json({

success:false,

message:"Attachment not found."

});

}

// ----------------------------------------------------
// GridFS
// ----------------------------------------------------

const bucket =
getGridFSBucket();

const fileId =
new mongoose.Types.ObjectId(

attachment.fileId

);

const downloadStream =
bucket.openDownloadStream(

fileId

);

// ----------------------------------------------------
// Headers
// ----------------------------------------------------

res.set({

"Content-Type":
attachment.contentType,

"Content-Disposition":
`attachment; filename="${attachment.originalName}"`

});

// ----------------------------------------------------
// Analytics
// ----------------------------------------------------

attachment.downloadCount +=1;

await StudyMaterial.updateOne(
{
_id:material._id,
"attachments._id":attachment._id
},
{
$inc:{
"attachments.$.downloadCount":1
}
}
);

// ----------------------------------------------------
// Error Handling
// ----------------------------------------------------

downloadStream.on(

"error",

()=>{

if(!res.headersSent){

return res.status(404).json({

success:false,

message:"File not found in storage."

});

}

}

);

// ----------------------------------------------------
// Stream
// ----------------------------------------------------

downloadStream.pipe(res);

}catch(error){

next(error);

}

};

exports.uploadStudyMaterialAttachment = async(req,res,next)=>{

try{

// ------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ------------------------------------------------

if(!req.file){

return res.status(400).json({

success:false,

message:"No file uploaded."

});

}

// ------------------------------------------------

if(

material.attachments.length >=

MAX_ATTACHMENTS

){

const bucket =
getGridFSBucket();

await bucket.delete(
req.file.id
);

return res.status(400).json({

success:false,

message:`Maximum ${MAX_ATTACHMENTS} attachments allowed.`

});

}

// ------------------------------------------------

if(

!ALLOWED_TYPES.includes(

req.file.contentType

)

){

const bucket =
getGridFSBucket();

await bucket.delete(
req.file.id
);

return res.status(400).json({

success:false,

message:"Unsupported file type."

});

}

// ------------------------------------------------

// Duplicate Detection

const duplicate =

material.attachments.find(

attachment=>

attachment.originalName===

req.file.originalname &&

attachment.size===

req.file.size

);

if(duplicate){

const bucket =
getGridFSBucket();

await bucket.delete(
req.file.id
);

return res.status(409).json({

success:false,

message:"File already attached."

});

}

// ------------------------------------------------

const extension=

path.extname(

req.file.originalname

)

.replace(".","")

.toLowerCase();

material.attachments.push({

fileId:
req.file.id,

filename:
req.file.filename,

originalName:
req.file.originalname,

contentType:
req.file.contentType,

extension,

size:
req.file.size,

uploadedBy:
teacher._id,

isPreviewable:isPreviewable(req.file.contentType)

});

material.updatedBy=
teacher._id;

material.version +=1;

await material.save();

// ------------------------------------------------

return res.status(201).json({

success:true,

message:"Attachment uploaded successfully.",

attachment:

material.attachments[
material.attachments.length-1
]

});

}catch(error){

next(error);

}

};


exports.removeStudyMaterialAttachment = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Attachment
// ----------------------------------------------------

const attachment =
material.attachments.id(

req.params.attachmentId

);

if(!attachment){

return res.status(404).json({

success:false,

message:"Attachment not found."

});

}

// ----------------------------------------------------
// Delete From GridFS
// ----------------------------------------------------

const bucket =
getGridFSBucket();

try{

await bucket.delete(

new mongoose.Types.ObjectId(

attachment.fileId

)

);

}catch(error){

return res.status(404).json({

success:false,

message:"File not found in storage."

});

}

// ----------------------------------------------------
// Remove Metadata
// ----------------------------------------------------

attachment.deleteOne();

// ----------------------------------------------------
// Audit
// ----------------------------------------------------

material.updatedBy=
teacher._id;

material.version +=1;

await material.save();

// ----------------------------------------------------
// Response
// ----------------------------------------------------

return res.status(200).json({

success:true,

message:"Attachment removed successfully."

});

}catch(error){

next(error);

}

};

exports.getMaterialAttachments = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

)
.select("createdBy attachments isDeleted").populate({

path:"attachments.uploadedBy",

populate:{
path:"userId",
select:"fullName"
}

});

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Sort Attachments
// ----------------------------------------------------

const attachments =
material.attachments.map(file=>({

_id:file._id,

originalName:file.originalName,

extension:file.extension,

contentType:file.contentType,

size:file.size,

uploadedAt:file.uploadedAt,

downloadCount:file.downloadCount,

isPreviewable:file.isPreviewable

}));
// ----------------------------------------------------
// Response
// ----------------------------------------------------

return res.status(200).json({

success:true,

count:
attachments.length,

attachments

});

}catch(error){

next(error);

}

};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//-----------PUBLISH STUDY MATERIAL-----------------
exports.publishStudyMaterial = async(req,res,next)=>{

try{

const teacher =
await Teacher.findOne({
userId:req.user.id
});

const material =
await StudyMaterial.findById(req.params.id);

if(!material){

return res.status(404).json({
success:false,
message:"Study material not found."
});

}

if(
material.createdBy.toString() !==
teacher._id.toString()
){

return res.status(403).json({
success:false,
message:"Unauthorized."
});

}

if(material.status==="PUBLISHED"){

return res.status(400).json({

success:false,

message:"Material is already published."

});

}

material.status="PUBLISHED";

material.publishedAt=new Date();

material.updatedBy=teacher._id;

await material.save();

return res.status(200).json({

success:true,

message:"Study material published successfully.",

material

});

}catch(error){

next(error);

}

};


//------------SHARING WITH BATCHES WITH SIMILAR COURSE -----------
exports.shareStudyMaterial = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Validate Request
// ----------------------------------------------------

const { batchIds } = req.body;

if(
!Array.isArray(batchIds) ||
batchIds.length===0
){

return res.status(400).json({

success:false,

message:"Please provide at least one batch."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Remove Source Batch
// ----------------------------------------------------

const uniqueBatchIds =

[...new Set(batchIds)]

.filter(

id=>

id.toString() !==

material.sourceBatch.toString()

);

// ----------------------------------------------------
// Fetch Batches
// ----------------------------------------------------

const batches =
await Batch.find({

_id:{
$in:uniqueBatchIds
}

});

if(
batches.length !==
uniqueBatchIds.length
){

return res.status(404).json({

success:false,

message:"One or more batches do not exist."

});

}

// ----------------------------------------------------
// Validate Course
// ----------------------------------------------------

const invalidCourse =
batches.find(

batch=>

batch.course.toString()

!==

material.course.toString()

);

if(invalidCourse){

return res.status(400).json({

success:false,

message:"Study material can only be shared with batches of the same course."

});

}

// ----------------------------------------------------
// Teacher Assignment
// ----------------------------------------------------

for(const batch of batches){

const assignment =

batch.teacherAssignments.find(

item=>

item.teacher.toString()

===

teacher._id.toString()

);

if(!assignment){

return res.status(403).json({

success:false,

message:`You are not assigned to batch ${batch.name}.`

});

}

}

// ----------------------------------------------------
// Atomic Update
// ----------------------------------------------------

await StudyMaterial.updateOne(

{

_id:material._id

},

{

$addToSet:{

sharedBatches:{

$each:uniqueBatchIds

}

},

$set:{

updatedBy:teacher._id

},

$inc:{

version:1

}

}

);

// ----------------------------------------------------
// Response
// ----------------------------------------------------

return res.status(200).json({

success:true,

message:"Study material shared successfully.",

sharedWith:

uniqueBatchIds.length

});

}catch(error){

next(error);

}

};


//--------------UNSHARE ------------
exports.unshareStudyMaterial = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Validate Request
// ----------------------------------------------------

const { batchIds } = req.body;

if(
!Array.isArray(batchIds) ||
batchIds.length===0
){

return res.status(400).json({

success:false,

message:"Please provide at least one batch."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Remove Source Batch
// ----------------------------------------------------

const removableBatchIds =

batchIds.filter(

id=>

id.toString()!==

material.sourceBatch.toString()

);

// ----------------------------------------------------
// Existing Shared
// ----------------------------------------------------

const existingBatchIds =

material.sharedBatches.map(

id=>id.toString()

);

// ----------------------------------------------------
// Actually Shared
// ----------------------------------------------------

const batchesToRemove =

removableBatchIds.filter(

id=>

existingBatchIds.includes(

id.toString()

)

);

// ----------------------------------------------------
// Atomic Update
// ----------------------------------------------------

await StudyMaterial.updateOne(

{

_id:material._id

},

{

$pull:{

sharedBatches:{

$in:batchesToRemove

}

},

$set:{

updatedBy:teacher._id

},

$inc:{

version:1

}

}

);

// ----------------------------------------------------
// Response
// ----------------------------------------------------

return res.status(200).json({

success:true,

message:"Study material unshared successfully.",

removed:batchesToRemove.length,

notShared:

removableBatchIds.length-

batchesToRemove.length

});

}catch(error){

next(error);

}

};

//-----------GET BATCHES CONTENT CAN BE SHARED WITH ----
exports.getShareableBatches = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Existing Batch IDs
// ----------------------------------------------------

const excludedBatchIds=[

material.sourceBatch.toString(),

...material.sharedBatches.map(

id=>id.toString()

)

];

// ----------------------------------------------------
// Eligible Batches
// ----------------------------------------------------

const batches =
await Batch.find({

course:material.course,

isActive:true,

_id:{

$nin:excludedBatchIds

},

teacherAssignments:{

$elemMatch:{

teacher:teacher._id

}

}

})

.select(

"name startDate endDate students"

)

.lean();

// ----------------------------------------------------
// Format Response
// ----------------------------------------------------

const formattedBatches=

batches.map(batch=>({

_id:batch._id,

name:batch.name,

startDate:batch.startDate,

endDate:batch.endDate,

studentCount:

batch.students.length

}));

// ----------------------------------------------------
// Response
// ----------------------------------------------------

return res.status(200).json({

success:true,

count:

formattedBatches.length,

batches:

formattedBatches

});

}catch(error){

next(error);

}

};


//---------CLONE OR DUPLICATE ----------------
exports.duplicateStudyMaterial = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Options
// ----------------------------------------------------

const{

includeAttachments=true,

includeSharedBatches=false

}=req.body;

// ----------------------------------------------------
// Generate Number
// ----------------------------------------------------

const materialNumber=

await generateMaterialNumber();

// ----------------------------------------------------
// Create Duplicate
// ----------------------------------------------------

const duplicatedMaterial=

await StudyMaterial.create({

materialNumber,

title:

`${material.title} (Copy)`,

summary:
material.summary,

body:
material.body,

type:
material.type,

course:
material.course,

moduleId:
material.moduleId,

sourceBatch:
material.sourceBatch,

sharedBatches:

includeSharedBatches ?

material.sharedBatches

:[],

visibility:
material.visibility,

status:"DRAFT",

difficulty:
material.difficulty,

serialOrder:
material.serialOrder,

attachments:

includeAttachments ?

material.attachments.map(

attachment=>({

fileId:
attachment.fileId,

filename:
attachment.filename,

originalName:
attachment.originalName,

contentType:
attachment.contentType,

extension:
attachment.extension,

size:
attachment.size,

uploadedBy:
teacher._id,

uploadedAt:
new Date(),

downloadCount:0,

isPreviewable:
attachment.isPreviewable

})

)

:[],

thumbnail:
material.thumbnail,

tags:
material.tags,

estimatedReadTime:
material.estimatedReadTime,

isDownloadable:
material.isDownloadable,

createdBy:
teacher._id,

updatedBy:
teacher._id,

version:1

});

// ----------------------------------------------------
// Response
// ----------------------------------------------------

return res.status(201).json({

success:true,

message:"Study material duplicated successfully.",

material:

duplicatedMaterial

});

}catch(error){

next(error);

}

};


//------------------PREVIEW------------
exports.previewStudyMaterialAttachment = async(req,res,next)=>{

try{

// ----------------------------------------------------
// Teacher
// ----------------------------------------------------

const teacher =
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ----------------------------------------------------
// Material
// ----------------------------------------------------

const material =
await StudyMaterial.findById(

req.params.id

);

if(
!material ||
material.isDeleted
){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

// ----------------------------------------------------
// Ownership
// ----------------------------------------------------

if(

material.createdBy.toString()

!==

teacher._id.toString()

){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

// ----------------------------------------------------
// Attachment
// ----------------------------------------------------

const attachment =
material.attachments.id(

req.params.attachmentId

);

if(!attachment){

return res.status(404).json({

success:false,

message:"Attachment not found."

});

}

// ----------------------------------------------------
// Preview Validation
// ----------------------------------------------------

if(!attachment.isPreviewable){

return res.status(400).json({

success:false,

message:"This file cannot be previewed."

});

}

// ----------------------------------------------------
// GridFS
// ----------------------------------------------------

const bucket =
getGridFSBucket();

const fileId =
new mongoose.Types.ObjectId(

attachment.fileId

);

const downloadStream =
bucket.openDownloadStream(

fileId

);

// ----------------------------------------------------
// Headers
// ----------------------------------------------------

res.set({

"Content-Type":
attachment.contentType,

"Content-Disposition":
`inline; filename="${attachment.originalName}"`

});

// ----------------------------------------------------
// Error Handling
// ----------------------------------------------------

downloadStream.on(

"error",

()=>{

if(!res.headersSent){

return res.status(404).json({

success:false,

message:"File not found in storage."

});

}

}

);

// ----------------------------------------------------
// Stream
// ----------------------------------------------------

downloadStream.pipe(res);

}catch(error){

next(error);

}

};

exports.unpublishStudyMaterial = async(req,res,next)=>{

try{

const teacher =
await Teacher.findOne({
userId:req.user.id
});

const material =
await StudyMaterial.findById(req.params.id);

if(!material){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

if(
material.createdBy.toString() !==
teacher._id.toString()
){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

material.status="DRAFT";

material.updatedBy=teacher._id;

await material.save();

return res.status(200).json({

success:true,

message:"Study material moved back to draft.",

material

});

}catch(error){

next(error);

}

};

// --------------GET ALL CONTENT--------------------
exports.getMyStudyMaterials= async(req,res,next)=>{
 try{

const teacher=
await Teacher.findOne({

userId:req.user.id

});

if(!teacher){

return res.status(404).json({

success:false,

message:"Teacher not found."

});

}

// ---------------------------------------------

const baseQuery={

createdBy:teacher._id,

isDeleted:false

};

const totalMaterials= await StudyMaterial.countDocuments(baseQuery);

// ---------------------------------------------

const apiFeatures=
new APIFeatures(

StudyMaterial
.find(baseQuery)
.select(

"materialNumber title status type difficulty sourceBatch course publishedAt version createdAt"

)
.populate(
"course",
"title"
)
.populate(
"sourceBatch",
"name"
),

req.query

)

.search()

.filter()

.sort()

.paginate();

// ---------------------------------------------

const materials=
await apiFeatures.query.lean();

// ---------------------------------------------

const filteredQuery={

...baseQuery

};

if(req.query.status){

filteredQuery.status=
req.query.status;

}

if(req.query.type){

filteredQuery.type=
req.query.type;

}

if(req.query.sourceBatch){

filteredQuery.sourceBatch=
req.query.sourceBatch;

}

if(req.query.moduleId){

filteredQuery.moduleId=
req.query.moduleId;

}

if(req.query.difficulty){

filteredQuery.difficulty=
req.query.difficulty;

}

if(req.query.search){

filteredQuery.$text={

$search:req.query.search

};

}

const filteredCount=
await StudyMaterial.countDocuments(

filteredQuery

);

// ---------------------------------------------

return res.status(200).json({

success:true,

currentPage:
apiFeatures.page,

totalPages:
Math.ceil(
filteredCount/
apiFeatures.limit
),

totalMaterials:
filteredCount,

hasNextPage:
apiFeatures.page<
Math.ceil(filteredCount/apiFeatures.limit),

hasPreviousPage:
apiFeatures.page>1,

materials

});

}catch(error){

next(error);

}

};


//--------------GET SINGLE COMTENT NY ID------------
exports.getSingleStudyMaterial = async(req,res,next)=>{

try{

const material =
await StudyMaterial

.findById(

req.params.id

)

.populate(
"course",
"title modules"
)

.populate(
"sourceBatch",
"name"
)

.populate(
"sharedBatches",
"name"
)

.populate(
"createdBy"
);

if(!material){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

return res.json({

success:true,

material

});

}catch(error){

next(error);

}
};


//--------------UPDATE CONTENT --------------------
exports.updateStudyMaterial = async(req,res,next)=>{

try{

const teacher =
await Teacher.findOne({
    userId:req.user.id
});

if(!teacher){

return res.status(404).json({
success:false,
message:"Teacher not found."
});

}

const material =
await StudyMaterial.findById(req.params.id);

if(!material || material.isDeleted){

return res.status(404).json({
success:false,
message:"Study material not found."
});

}

if(
material.createdBy.toString() !==
teacher._id.toString()
){

return res.status(403).json({
success:false,
message:"Unauthorized."
});

}

const allowedFields=[

"title",
"summary",
"body",
"type",
"visibility",
"difficulty",
"serialOrder",
"tags",
"estimatedReadTime",
"isDownloadable",
"thumbnail",
"sharedBatches"

];

allowedFields.forEach(field=>{

if(req.body[field]!==undefined){

material[field]=req.body[field];

}

});

// Validate shared batches

if(material.sharedBatches.length){

const batches =
await Batch.find({

_id:{
$in:material.sharedBatches
}

});

const invalidBatch =
batches.find(

batch=>

batch.course.toString() !==
material.course.toString()

);

if(invalidBatch){

return res.status(400).json({

success:false,

message:"Shared batches must belong to the same course."

});

}

}

material.updatedBy=
teacher._id;

material.version +=1;

await material.save();

return res.status(200).json({

success:true,

message:"Study material updated successfully.",

material

});

}catch(error){

next(error);

}

};

//-------------ARCHIVE MATERIAL -----------------
exports.archiveStudyMaterial = async(req,res,next)=>{

try{

const teacher =
await Teacher.findOne({
userId:req.user.id
});

const material =
await StudyMaterial.findById(req.params.id);

if(!material){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

if(
material.createdBy.toString() !==
teacher._id.toString()
){

return res.status(403).json({

success:false,

message:"Unauthorized."

});

}

material.status="ARCHIVED";

material.updatedBy=teacher._id;

await material.save();

return res.status(200).json({

success:true,

message:"Study material archived successfully."

});

}catch(error){

next(error);

}

};

//--------------RESTORE STUDY MATERIAL ------------
exports.restoreStudyMaterial = async(req,res,next)=>{

try{

const material =
await StudyMaterial.findById(req.params.id);

if(!material){

return res.status(404).json({

success:false,

message:"Study material not found."

});

}

material.isDeleted=false;

material.deletedAt=null;

material.deletedBy=null;

await material.save();

return res.status(200).json({

success:true,

message:"Study material restored successfully."

});

}catch(error){

next(error);

}

};
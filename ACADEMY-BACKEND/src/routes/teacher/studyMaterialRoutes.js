const express =
require("express");

const router =
express.Router();

const {

protect,

authorizeRoles

}=
require("../../middlewares/authMiddleware");

const upload =
  require("../../middlewares/uploadMiddleware");


const {

createStudyMaterial,

updateStudyMaterial,

publishStudyMaterial,

unpublishStudyMaterial,

archiveStudyMaterial,

deleteStudyMaterial,

restoreStudyMaterial,

getMyStudyMaterials,

getSingleStudyMaterial,

uploadStudyMaterialAttachment,

downloadStudyMaterialAttachment,

previewStudyMaterialAttachment,

removeStudyMaterialAttachment,

getMaterialAttachments,

shareStudyMaterial,

unshareStudyMaterial,

getShareableBatches,

duplicateStudyMaterial

}=require("../../controllers/teacher/studyMaterialController");


router.post(
"/",
protect,
authorizeRoles("TEACHER"),
createStudyMaterial
);

router.get(
"/",
protect,
authorizeRoles("TEACHER"),
getMyStudyMaterials
);

router.get(
"/:id",
protect,
authorizeRoles("TEACHER"),
getSingleStudyMaterial
);

router.put(
"/:id",
protect,
authorizeRoles("TEACHER"),
updateStudyMaterial
);



router.patch(
"/:id/restore",
protect,
authorizeRoles("TEACHER"),
restoreStudyMaterial
);

router.patch(
"/:id/publish",
protect,
authorizeRoles("TEACHER"),
publishStudyMaterial
);

router.patch(
"/:id/unpublish",
protect,
authorizeRoles("TEACHER"),
unpublishStudyMaterial
);

router.patch(
"/:id/archive",
protect,
authorizeRoles("TEACHER"),
archiveStudyMaterial
);


router.post(
"/:id/attachments",
protect,
authorizeRoles("TEACHER"),
upload.single("file"),
uploadStudyMaterialAttachment
);

router.get(
"/:id/attachments",
protect,
authorizeRoles("TEACHER"),
getMaterialAttachments
);

router.get(
"/:id/attachments/:attachmentId/download",
protect,
authorizeRoles("TEACHER"),
downloadStudyMaterialAttachment
);

router.get(
"/:id/attachments/:attachmentId/preview",
protect,
authorizeRoles("TEACHER"),
previewStudyMaterialAttachment
);

router.delete(
"/:id/attachments/:attachmentId",
protect,
authorizeRoles("TEACHER"),
removeStudyMaterialAttachment
);

router.patch(
"/:id/share",
protect,
authorizeRoles("TEACHER"),
shareStudyMaterial
);

router.patch(
"/:id/unshare",
protect,
authorizeRoles("TEACHER"),
unshareStudyMaterial
);

router.get(
"/:id/shareable-batches",
protect,
authorizeRoles("TEACHER"),
getShareableBatches
);

router.post(
"/:id/duplicate",
protect,
authorizeRoles("TEACHER"),
duplicateStudyMaterial
);


router.delete("/:id", protect,
authorizeRoles("TEACHER"),deleteStudyMaterial);


module.exports=
router;
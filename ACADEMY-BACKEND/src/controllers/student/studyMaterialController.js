// controllers/student/studyMaterialController.js
const mongoose = require("mongoose");
const StudyMaterial = require("../../models/StudyMaterial");
const Student = require("../../models/Student");
const { getGridFSBucket } = require("../../config/gridfs");

// Helper: verify student batch access
const verifyAccess = (student, material) => {
  const studentBatchIds = student.batches.map((id) => id.toString());
  const sourceBatchId =
    material.sourceBatch?._id?.toString() || material.sourceBatch?.toString();

  return (
    studentBatchIds.includes(sourceBatchId) ||
    (material.visibility === "SHARED_BATCHES" &&
      material.sharedBatches?.some((b) =>
        studentBatchIds.includes(b._id?.toString() || b.toString())
      ))
  );
};

// ---------------- LIST ALL ----------------
exports.getStudentStudyMaterials = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.batches || student.batches.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        materials: [],
      });
    }

    const materials = await StudyMaterial.find({
      status: "PUBLISHED",
      isDeleted: false,
      $or: [
        { sourceBatch: { $in: student.batches } },
        {
          sharedBatches: { $in: student.batches },
          visibility: "SHARED_BATCHES",
        },
      ],
    })
      .select(
        "materialNumber title summary type difficulty sourceBatch course sharedBatches visibility publishedAt createdAt estimatedReadTime attachments"
      )
      .populate("course", "title")
      .populate("sourceBatch", "name")
      .populate("sharedBatches", "name")
      .sort({ createdAt: -1 })
      .lean();

    const formattedMaterials = materials.map((mat) => ({
      _id: mat._id,
      materialNumber: mat.materialNumber,
      title: mat.title,
      summary: mat.summary,
      type: mat.type,
      difficulty: mat.difficulty,
      course: mat.course,
      sourceBatch: mat.sourceBatch,
      sharedBatches: mat.sharedBatches,
      visibility: mat.visibility,
      publishedAt: mat.publishedAt,
      createdAt: mat.createdAt,
      estimatedReadTime: mat.estimatedReadTime,
      attachmentCount: mat.attachments?.length || 0,
    }));

    return res.status(200).json({
      success: true,
      count: formattedMaterials.length,
      materials: formattedMaterials,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- GET SINGLE ----------------
exports.getStudentStudyMaterialById = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const material = await StudyMaterial.findById(req.params.id)
      .populate("course", "title modules")
      .populate("sourceBatch", "name")
      .populate("sharedBatches", "name")
      .populate({
        path: "attachments.uploadedBy",
        populate: {
          path: "userId",
          select: "fullName",
        },
      })
      .lean();

    if (!material || material.isDeleted || material.status !== "PUBLISHED") {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    if (!verifyAccess(student, material)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this study material",
      });
    }

    // Increment view count
    await StudyMaterial.updateOne(
      { _id: material._id },
      { $inc: { viewCount: 1 } }
    );

    // Resolve module name
    const module = material.course?.modules?.find(
      (m) =>
        m._id?.toString() === material.moduleId?.toString() ||
        m._id === material.moduleId
    );

    const formattedMaterial = {
      ...material,
      moduleName: module?.title || "—",
      attachments: (material.attachments || []).map((file) => ({
        _id: file._id,
        originalName: file.originalName,
        filename: file.filename,
        extension: file.extension,
        contentType: file.contentType,
        size: file.size,
        uploadedAt: file.uploadedAt,
        downloadCount: file.downloadCount,
        isPreviewable: file.isPreviewable,
        uploadedBy: file.uploadedBy?.userId?.fullName || "Teacher",
      })),
    };

    return res.status(200).json({
      success: true,
      material: formattedMaterial,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------- PREVIEW ----------------
exports.previewStudyMaterialAttachment = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const material = await StudyMaterial.findById(req.params.id).lean();

    if (!material || material.isDeleted || material.status !== "PUBLISHED") {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    if (!verifyAccess(student, material)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const attachment = material.attachments?.find(
      (a) => a._id.toString() === req.params.attachmentId
    );

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found",
      });
    }

    if (!attachment.isPreviewable) {
      return res.status(400).json({
        success: false,
        message: "This file cannot be previewed",
      });
    }

    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(attachment.fileId);
    const downloadStream = bucket.openDownloadStream(fileId);

    res.set({
      "Content-Type": attachment.contentType,
      "Content-Disposition": `inline; filename="${attachment.originalName}"`,
    });

    downloadStream.on("error", () => {
      if (!res.headersSent) {
        return res.status(404).json({
          success: false,
          message: "File not found in storage",
        });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// ---------------- DOWNLOAD ----------------
exports.downloadStudyMaterialAttachment = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const material = await StudyMaterial.findById(req.params.id).lean();

    if (!material || material.isDeleted || material.status !== "PUBLISHED") {
      return res.status(404).json({
        success: false,
        message: "Study material not found",
      });
    }

    if (!verifyAccess(student, material)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const attachment = material.attachments?.find(
      (a) => a._id.toString() === req.params.attachmentId
    );

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found",
      });
    }

    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(attachment.fileId);
    const downloadStream = bucket.openDownloadStream(fileId);

    res.set({
      "Content-Type": attachment.contentType,
      "Content-Disposition": `attachment; filename="${attachment.originalName}"`,
    });

    await StudyMaterial.updateOne(
      { _id: material._id, "attachments._id": attachment._id },
      { $inc: { "attachments.$.downloadCount": 1 } }
    );

    downloadStream.on("error", () => {
      if (!res.headersSent) {
        return res.status(404).json({
          success: false,
          message: "File not found in storage",
        });
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
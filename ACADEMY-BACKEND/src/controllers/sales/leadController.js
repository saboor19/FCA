const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Lead = require("../../models/sales/Lead");
const SalesTeam = require("../../models/sales/SalesTeam");
const LeadActivity = require("../../models/sales/LeadActivity");
const User = require("../../models/User");
const Course = require("../../models/Course");
const Batch = require("../../models/Batch");
const Counter = require("../../models/Counter");
const Student = require("../../models/Student");
const { generateEnrollmentNumber } = require("../../utils/generateEnrollmentNumber");
const { ACTIVITY_TYPE } = require("../../constants/salesConstants");
const { createLeadActivity } = require("../../utils/sales/createLeadActivity");

// ======================================================
// GENERATE LEAD NUMBER
// ======================================================

const generateLeadNumber = async (session) => {

  const counter =
    await Counter.findOneAndUpdate(

      {
        name: "lead"
      },

      {
        $inc: {
          sequence: 1
        }
      },

      {
        new: true,
        upsert: true,
        session
      }

    );

  return `LD-${String(counter.sequence).padStart(6, "0")}`;

};

// ======================================================
// CREATE LEAD
// ======================================================

exports.createLead = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      firstName,
      lastName,
      primaryPhone,
      alternatePhone,
      email,
      whatsappNumber,
      gender,
      dateOfBirth,
      country,
      state,
      city,
      address,
      pincode,
      qualification,
      institution,
      passingYear,
      occupation,
      experience,
      interestedCourse,
      preferredBatch,
      studyMode,
      preferredTiming,
      budget,
      expectedJoiningDate,
      source,
      subSource,
      campaign,
      referredBy,
      lostReason,
      lostTo,
      initialRemarks
    } = req.body;

    // --------------------------------------------------
    // SALES PERSON
    // --------------------------------------------------
    const salesPerson = await SalesTeam.findOne({
      userId: req.user.id
    }).session(session);

    if (!salesPerson) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Sales team member not found."
      });
    }

    // --------------------------------------------------
    // COURSE VALIDATION
    // --------------------------------------------------
    if (interestedCourse) {
      const course = await Course.findById(interestedCourse).session(session);
      if (!course) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Course not found."
        });
      }
    }

    // --------------------------------------------------
    // BATCH VALIDATION
    // --------------------------------------------------
    if (preferredBatch) {
      const batch = await Batch.findById(preferredBatch).session(session);
      if (!batch) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: "Batch not found."
        });
      }
    }

    // --------------------------------------------------
    // LEAD NUMBER
    // --------------------------------------------------
    const leadNumber = await generateLeadNumber(session);

    // --------------------------------------------------
    // FULL NAME
    // --------------------------------------------------
    const fullName = `${firstName} ${lastName || ""}`.trim();

    // --------------------------------------------------
    // CREATE LEAD
    // --------------------------------------------------
    const lead = await Lead.create([{
      leadNumber,
      firstName,
      lastName,
      fullName,
      primaryPhone,
      alternatePhone,
      email,
      whatsappNumber,
      gender,
      dateOfBirth,
      country,
      state,
      city,
      address,
      pincode,
      qualification,
      institution,
      passingYear,
      occupation,
      experience,
      interestedCourse: interestedCourse || undefined,
      preferredBatch: preferredBatch || undefined,
      studyMode,
      preferredTiming,
      budget,
      expectedJoiningDate,
      source,
      subSource,
      campaign,
      referredBy,
      leadOwner: salesPerson._id,
      createdBy: salesPerson._id,
      status: "NEW",
      priority: "MEDIUM",
      leadScore: 0,
      isConverted: false,
      lostReason,
      lostTo,
      initialRemarks
    }], { session });

    const createdLeadId = lead[0]._id;

    // --------------------------------------------------
    // ACTIVITY 1 — Inside Transaction
    // --------------------------------------------------
    await LeadActivity.create([{
      lead: createdLeadId,
      performedBy: salesPerson._id,
      type: ACTIVITY_TYPE.CREATED,
      title: "Lead Created",
      description: "Lead created successfully.",
      metadata: {
        leadNumber,
        status: "NEW",
        owner: salesPerson._id
      }
    }], { session });

    // --------------------------------------------------
    // COMMIT
    // --------------------------------------------------
    await session.commitTransaction();
    session.endSession();

    // --------------------------------------------------
    // ACTIVITY 2 — After Commit (non-transactional, fire-and-forget safe)
    // --------------------------------------------------
    // Use try/catch so failure here doesn't affect the response
    try {
      await createLeadActivity({
        lead: createdLeadId,
        performedBy: salesPerson._id,
        type: "CREATED",
        title: "Lead Created",
        description: `${fullName} was added as a new lead.`,
        source: "SYSTEM",
        metadata: {
          status: "NEW",
          priority: "MEDIUM",
          source: source || "OTHER"
        }
      });
    } catch (activityErr) {
      // Log but don't fail — lead is already created
      console.error("Post-commit activity creation failed:", activityErr.message);
    }

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------
    const createdLead = await Lead.findById(createdLeadId)
      .populate("leadOwner", "employeeId designation")
      .populate("interestedCourse", "title")
      .populate("preferredBatch", "name");

    return res.status(201).json({
      success: true,
      message: "Lead created successfully.",
      data: createdLead
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ======================================================
// GET all LEADs
// ======================================================


exports.getLeads = async (req, res, next) => {

  try {

    const { page = 1, limit = 10, search, status, priority, source, course, owner, sort = "latest" } = req.query;

    // --------------------------------------------------

    const salesPerson = await SalesTeam.findOne({ userId: req.user.id });

    if (!salesPerson) {
      return res.status(404).json({
        success: false, message: "Sales team member not found."
      });
    }

    const query = { isDeleted: false, leadOwner: salesPerson._id };

    // --------------------------------------------------
    // FILTERS
    // --------------------------------------------------

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (source) {
      query.source = source;
    }
    if (course) {
      query.interestedCourse = course;

    }

    if (owner) {
      query.leadOwner = owner;
    }

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    if (search) {

      query.$text = {

        $search: search

      };

    }

    // --------------------------------------------------
    // SORT
    // --------------------------------------------------

    let sortOption = {

      createdAt: -1

    };

    switch (sort) {

      case "oldest":

        sortOption = {

          createdAt: 1

        };

        break;

      case "name":

        sortOption = {

          fullName: 1

        };

        break;

      case "score":

        sortOption = {

          leadScore: -1

        };

        break;

      case "nextFollowup":

        sortOption = {

          nextFollowupAt: 1

        };

        break;

      default:

        sortOption = {

          createdAt: -1

        };

    }

    // --------------------------------------------------

    const currentPage =
      Number(page);

    const perPage =
      Number(limit);

    const skip =
      (currentPage - 1) * perPage;

    // --------------------------------------------------

    const total =
      await Lead.countDocuments(query);

    const leads =
      await Lead.find(query)

        .populate(

          "leadOwner",

          "employeeId designation"

        )

        .populate(

          "interestedCourse",

          "title"

        )

        .populate(

          "preferredBatch",

          "name"

        )

        .sort(sortOption)

        .skip(skip)

        .limit(perPage)

        .lean();

    // --------------------------------------------------

    return res.status(200).json({

      success: true,

      count: leads.length,

      page: currentPage,

      pages: Math.ceil(total / perPage),

      total,

      data: leads

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};


// ======================================================
// GET LEAD BY ID
// ======================================================

exports.getLeadById = async (req, res) => {

  try {

    // --------------------------------------------------
    // SALES PERSON
    // --------------------------------------------------

    const salesPerson =
      await SalesTeam.findOne({

        userId: req.user.id

      });

    if (!salesPerson) {

      return res.status(404).json({

        success: false,

        message: "Sales team member not found."

      });

    }

    // --------------------------------------------------
    // LEAD
    // --------------------------------------------------

    const lead =
      await Lead.findOne({

        _id: req.params.id,

        leadOwner: salesPerson._id,

        isDeleted: false

      })

        .populate(

          "leadOwner",

          "employeeId designation"

        )

        .populate(

          "interestedCourse",

          "title duration fee"

        )

        .populate(

          "preferredBatch",

          "name batchCode"

        )

        .populate(

          "convertedStudent",

          "studentId"

        )

        .lean();

    // --------------------------------------------------

    if (!lead) {

      return res.status(404).json({

        success: false,

        message: "Lead not found."

      });

    }

    // --------------------------------------------------

    return res.status(200).json({

      success: true,

      data: lead

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ======================================================
// UPDATE LEAD
// ======================================================

exports.updateLead = async (req, res) => {

  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {

    // --------------------------------------------------
    // SALES PERSON
    // --------------------------------------------------

    const salesPerson =
      await SalesTeam.findOne({

        userId: req.user.id

      }).session(session);

    if (!salesPerson) {

      await session.abortTransaction();

      session.endSession();

      return res.status(404).json({

        success: false,

        message: "Sales team member not found."

      });

    }

    // --------------------------------------------------
    // LEAD
    // --------------------------------------------------

    const lead =
      await Lead.findOne({

        _id: req.params.id,

        leadOwner: salesPerson._id,

        isDeleted: false

      }).session(session);

    if (!lead) {

      await session.abortTransaction();

      session.endSession();

      return res.status(404).json({

        success: false,

        message: "Lead not found."

      });

    }

    // --------------------------------------------------
    // ALLOWED FIELDS
    // --------------------------------------------------

    const allowedUpdates = [

      "firstName",

      "lastName",

      "primaryPhone",

      "alternatePhone",

      "email",

      "whatsappNumber",

      "gender",

      "dateOfBirth",

      "country",

      "state",

      "city",

      "address",

      "pincode",

      "qualification",

      "institution",

      "passingYear",

      "occupation",

      "experience",

      "interestedCourse",

      "preferredBatch",

      "studyMode",

      "preferredTiming",

      "budget",

      "expectedJoiningDate",

      "source",

      "subSource",

      "campaign",

      "referredBy",

      "status",

      "priority",

      "lostReason",

      "lostTo",

      "initialRemarks"

    ];

    // --------------------------------------------------
    // UPDATE FIELDS
    // --------------------------------------------------

    allowedUpdates.forEach(field => {

      if (req.body[field] !== undefined) {

        lead[field] = req.body[field];

      }

    });

    // --------------------------------------------------
    // VALIDATE COURSE
    // --------------------------------------------------

    if (req.body.interestedCourse) {

      const course =
        await Course.findById(

          req.body.interestedCourse

        ).session(session);

      if (!course) {

        await session.abortTransaction();

        session.endSession();

        return res.status(404).json({

          success: false,

          message: "Course not found."

        });

      }

    }

    // --------------------------------------------------
    // VALIDATE BATCH
    // --------------------------------------------------

    if (req.body.preferredBatch) {

      const batch =
        await Batch.findById(

          req.body.preferredBatch

        ).session(session);

      if (!batch) {

        await session.abortTransaction();

        session.endSession();

        return res.status(404).json({

          success: false,

          message: "Batch not found."

        });

      }

    }

    // --------------------------------------------------
    // SYSTEM FIELDS
    // --------------------------------------------------

    lead.fullName =

      `${lead.firstName} ${lead.lastName || ""}`.trim();

    lead.updatedBy =

      salesPerson._id;

    // --------------------------------------------------
    // SAVE
    // --------------------------------------------------

    await lead.save({

      session

    });

    // --------------------------------------------------
    // ACTIVITY
    // --------------------------------------------------

    await LeadActivity.create([{

      lead: lead._id,

      performedBy: salesPerson._id,

      type: ACTIVITY_TYPE.UPDATED,

      title: "Lead Updated",

      description: "Lead information updated.",

      metadata: {

        leadNumber: lead.leadNumber

      }

    }], {

      session

    });

    // --------------------------------------------------
    // COMMIT
    // --------------------------------------------------

    await session.commitTransaction();

    session.endSession();

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    const updatedLead =
      await Lead.findById(

        lead._id

      )

        .populate(

          "leadOwner",

          "employeeId designation"

        )

        .populate(

          "interestedCourse",

          "title"

        )

        .populate(

          "preferredBatch",

          "name"

        );




    //----------------ACTIVITY----------------
    await createLeadActivity({

      lead: lead._id,

      performedBy: salesTeam._id,

      type: "UPDATED",

      title: "Lead Updated",

      description: "Lead information was updated.",

      source: "SYSTEM"

    });

    return res.status(200).json({

      success: true,

      message: "Lead updated successfully.",

      data: updatedLead

    });

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    return res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

exports.convertLead = async (req, res, next) => {

  try {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      // ----------------------------------------------------
      // LEAD
      // ----------------------------------------------------

      const lead = await Lead.findById(req.params.id).session(session);

      if (!lead || lead.isDeleted) {
        await session.abortTransaction();

        session.endSession();

        return res.status(404).json({

          success: false,

          message: "Lead not found."

        });

      }

      if (lead.isConverted) {

        await session.abortTransaction();

        session.endSession();

        return res.status(400).json({

          success: false,

          message: "Lead has already been converted."

        });

      }

      // ----------------------------------------------------
      // EMAIL CHECK
      // ----------------------------------------------------

      if (lead.email) {

        const existingUser =
          await User.findOne({

            email: lead.email

          }).session(session);

        if (existingUser) {

          await session.abortTransaction();

          session.endSession();

          return res.status(400).json({

            success: false,

            message: "Email already exists."

          });

        }

      }

      // ----------------------------------------------------
      // ENROLLMENT NUMBER
      // ----------------------------------------------------

      const enrollmentNo =
        await generateEnrollmentNumber(
          session
        );

      // ----------------------------------------------------
      // PASSWORD
      // ----------------------------------------------------

      const hashedPassword =
        await bcrypt.hash(
          "Fusion@123",
          10
        );

      // ----------------------------------------------------
      // USER
      // ----------------------------------------------------

      const users =
        await User.create([{

          fullName: lead.fullName,

          email: lead.email,

          phone: lead.primaryPhone,

          password: hashedPassword,

          role: "STUDENT"

        }], {

          session

        });

      const user = users[0];

      // ----------------------------------------------------
      // STUDENT
      // ----------------------------------------------------

      const students =
        await Student.create([{

          userId: user._id,

          enrollmentNo,

          phone: lead.primaryPhone,

          address: lead.address,

          dateOfBirth: lead.dateOfBirth

        }], {

          session

        });

      const student = students[0];

      const salesTeam = await SalesTeam.findOne({
        userId: req.user.id
      });

      // ----------------------------------------------------
      // UPDATE LEAD
      // ----------------------------------------------------

      lead.status = "CONVERTED";

      lead.isConverted = true;

      lead.convertedUser = user._id;

      lead.convertedStudent = student._id;

      lead.convertedAt = new Date();

      lead.convertedBy = salesTeam._id;

      await lead.save({

        session

      });

      // ----------------------------------------------------

      await session.commitTransaction();

      session.endSession();

      await createLeadActivity({

        lead: lead._id,

        performedBy: salesTeam._id,

        type: "CONVERTED",

        title: "Lead Converted",

        description: "Lead converted into student.",

        source: "SYSTEM",

        metadata: {

          studentId: student._id,

          userId: user._id,

          enrollmentNo: student.enrollmentNo

        }

      });

      return res.status(200).json({

        success: true,

        message: "Lead converted successfully.",

        data: {

          lead,
          user,

          student

        }

      });

    } catch (error) {

      await session.abortTransaction();

      session.endSession();

      throw error;

    }

  } catch (error) {

    next(error);

  }

};

exports.createLeadActivity = async (req, res, next) => {

  try {

    // --------------------------------------------------
    // SALES TEAM
    // --------------------------------------------------

    const salesTeam =
      await SalesTeam.findOne({

        userId: req.user.id

      });

    if (!salesTeam) {

      return res.status(404).json({

        success: false,

        message: "Sales team member not found."

      });

    }

    // --------------------------------------------------
    // LEAD
    // --------------------------------------------------

    const lead =
      await Lead.findById(
        req.params.id
      );

    if (
      !lead ||
      lead.isDeleted
    ) {

      return res.status(404).json({

        success: false,

        message: "Lead not found."

      });

    }

    // --------------------------------------------------
    // BODY
    // --------------------------------------------------

    const {

      type,

      title,

      description,

      outcome,

      scheduledAt,

      completedAt,

      metadata

    } = req.body;

    // --------------------------------------------------
    // CREATE
    // --------------------------------------------------

    const activity =
      await LeadActivity.create({

        lead: lead._id,

        performedBy: salesTeam._id,

        type,

        title,

        description,

        outcome,

        scheduledAt,

        completedAt,

        metadata,

        source: "USER"

      });

    // --------------------------------------------------

    return res.status(201).json({

      success: true,

      message: "Activity created successfully.",

      data: activity

    });

  } catch (error) {

    next(error);

  }

};


exports.getLeadActivities = async (req, res, next) => {

  try {

    // --------------------------------------------------
    // LEAD
    // --------------------------------------------------

    const lead =
      await Lead.findById(
        req.params.id
      );

    if (
      !lead ||
      lead.isDeleted
    ) {

      return res.status(404).json({

        success: false,

        message: "Lead not found."

      });

    }

    // --------------------------------------------------
    // PAGINATION
    // --------------------------------------------------

    const page =
      Math.max(
        1,
        Number(req.query.page) || 1
      );

    const limit =
      Math.max(
        1,
        Number(req.query.limit) || 10
      );

    const skip =
      (page - 1) * limit;

    // --------------------------------------------------
    // FILTER
    // --------------------------------------------------

    const filter = {

      lead: lead._id,

      isDeleted: false

    };

    if (req.query.type) {

      filter.type =
        req.query.type;

    }

    // --------------------------------------------------
    // DATA
    // --------------------------------------------------

    const [
      activities,
      total
    ] = await Promise.all([

      LeadActivity.find(filter)

        .populate({

          path: "performedBy",

          populate: {

            path: "userId",

            select: "fullName email"

          }

        })

        .sort({

          createdAt: -1

        })

        .skip(skip)

        .limit(limit)

        .lean(),

      LeadActivity.countDocuments(
        filter
      )

    ]);

    // --------------------------------------------------

    return res.status(200).json({

      success: true,

      data: activities,

      pagination: {

        page,

        limit,

        total,

        pages: Math.ceil(
          total / limit
        )

      }

    });

  } catch (error) {

    next(error);

  }

};

exports.getLeadActivity = async (req, res, next) => {

  try {

    const activity =
      await LeadActivity.findOne({

        _id: req.params.activityId,

        isDeleted: false

      })

        .populate({

          path: "lead",

          select: "leadNumber fullName status"

        })

        .populate({

          path: "performedBy",

          populate: {

            path: "userId",

            select: "fullName email"

          }

        });

    if (!activity) {

      return res.status(404).json({

        success: false,

        message: "Activity not found."

      });

    }

    return res.status(200).json({

      success: true,

      data: activity

    });

  } catch (error) {

    next(error);

  }

};


exports.updateLeadActivity = async (req, res, next) => {

  try {

    const activity =
      await LeadActivity.findOne({

        _id: req.params.activityId,

        isDeleted: false

      });

    if (!activity) {

      return res.status(404).json({

        success: false,

        message: "Activity not found."

      });

    }

    const {

      type,

      title,

      description,

      outcome,

      scheduledAt,

      completedAt,

      metadata,

      isVisible

    } = req.body;

    if (type !== undefined)
      activity.type = type;

    if (title !== undefined)
      activity.title = title;

    if (description !== undefined)
      activity.description = description;

    if (outcome !== undefined)
      activity.outcome = outcome;

    if (scheduledAt !== undefined)
      activity.scheduledAt = scheduledAt;

    if (completedAt !== undefined)
      activity.completedAt = completedAt;

    if (metadata !== undefined)
      activity.metadata = metadata;

    if (isVisible !== undefined)
      activity.isVisible = isVisible;

    await activity.save();

    return res.status(200).json({

      success: true,

      message: "Activity updated successfully.",

      data: activity

    });

  } catch (error) {

    next(error);

  }

};


exports.deleteLeadActivity = async (req, res, next) => {

  try {

    const activity =
      await LeadActivity.findOne({

        _id: req.params.activityId,

        isDeleted: false

      });

    if (!activity) {

      return res.status(404).json({

        success: false,

        message: "Activity not found."

      });

    }

    activity.isDeleted = true;

    activity.deletedAt = new Date();

    await activity.save();

    return res.status(200).json({

      success: true,

      message: "Activity deleted successfully."

    });

  } catch (error) {

    next(error);

  }

};
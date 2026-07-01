const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const SalesTeam = require("../../models/sales/SalesTeam");

// ======================================================
// CREATE SALES TEAM MEMBER
// ======================================================

exports.createSalesTeamMember = async (req, res) => {

    const session =
        await mongoose.startSession();

    session.startTransaction();

    try {

        const {

            fullName,

            email,

            password,

            employeeId,

            designation,

            department,

            manager,

            phone,

            address,

            gender,

            dateOfBirth,

            joiningDate,

            dailyLeadTarget,

            monthlyLeadTarget,

            employmentStatus,

            bio,

            experience

        } = req.body;

        if (!manager) {
            req.body.manager = undefined;
        }

        // --------------------------------------------------
        // EMAIL CHECK
        // --------------------------------------------------

        const existingUser =
            await User.findOne({

                email: email.toLowerCase()

            }).session(session);

        if (existingUser) {

            await session.abortTransaction();

            session.endSession();

            return res.status(400).json({

                success: false,

                message: "Email already exists."

            });

        }

        // --------------------------------------------------
        // EMPLOYEE ID CHECK
        // --------------------------------------------------

        const existingEmployee =
            await SalesTeam.findOne({

                employeeId

            }).session(session);

        if (existingEmployee) {

            await session.abortTransaction();

            session.endSession();

            return res.status(400).json({

                success: false,

                message: "Employee ID already exists."

            });

        }

        // --------------------------------------------------
        // MANAGER VALIDATION
        // --------------------------------------------------

        if (manager) {

            const managerExists =
                await SalesTeam.findById(manager)
                    .session(session);

            if (!managerExists) {

                await session.abortTransaction();

                session.endSession();

                return res.status(404).json({

                    success: false,

                    message: "Manager not found."

                });

            }

        }

        // --------------------------------------------------
        // PASSWORD
        // --------------------------------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);

        // --------------------------------------------------
        // CREATE USER
        // --------------------------------------------------

        const user =
            await User.create([{

                fullName,

                email: email.toLowerCase(),

                password: hashedPassword,

                role: "SALES_TEAM",

                phone

            }], {

                session

            });

        // --------------------------------------------------
        // CREATE SALES PROFILE
        // --------------------------------------------------

        const salesTeam =
            await SalesTeam.create([{

                userId: user[0]._id,

                employeeId,

                designation,

                department,

                manager,

                phone,

                address,

                gender,

                dateOfBirth,

                joiningDate,

                dailyLeadTarget,

                monthlyLeadTarget,

                employmentStatus,

                bio,

                experience

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

        const createdSalesPerson =
            await SalesTeam.findById(

                salesTeam[0]._id

            )

                .populate(

                    "userId",

                    "fullName email role isActive"

                )

                .populate(

                    "manager",

                    "employeeId designation"

                );

        return res.status(201).json({

            success: true,

            message: "Sales team member created successfully.",

            data: createdSalesPerson

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
// GET ALL SALES TEAM MEMBERS
// ======================================================

exports.getSalesTeamMembers = async (req, res) => {

    try {

        const {

            page = 1,

            limit = 10,

            search = "",

            department,

            designation,

            employmentStatus,

            manager,

            isActive

        } = req.query;

        const filter = {};

        if (department)
            filter.department = department;

        if (designation)
            filter.designation = designation;

        if (employmentStatus)
            filter.employmentStatus = employmentStatus;

        if (manager)
            filter.manager = manager;

        const userFilter = {};

        if (search) {

            userFilter.$or = [

                {
                    fullName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }

        if (isActive !== undefined)
            userFilter.isActive = isActive === "true";

        const users =
            await User.find(userFilter).select("_id");

        filter.userId = {
            $in: users.map(user => user._id)
        };

        const total =
            await SalesTeam.countDocuments(filter);

        const salesTeam =
            await SalesTeam.find(filter)

                .populate(
                    "userId",
                    "fullName email phone role isActive"
                )

                .populate(
                    "manager",
                    "employeeId designation"
                )

                .sort({
                    createdAt: -1
                })

                .skip((page - 1) * limit)

                .limit(Number(limit));

        return res.status(200).json({

            success: true,

            data: salesTeam,

            pagination: {

                total,

                page: Number(page),

                pages: Math.ceil(total / limit),

                limit: Number(limit)

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// GET SINGLE SALES TEAM MEMBER
// ======================================================

exports.getSalesTeamMember = async (req, res) => {

    try {

        const salesPerson =
            await SalesTeam.findById(req.params.id)

                .populate(
                    "userId",
                    "-password"
                )

                .populate(
                    "manager",
                    "employeeId designation userId"
                );

        if (!salesPerson) {

            return res.status(404).json({

                success: false,

                message: "Sales team member not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: salesPerson

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// UPDATE SALES TEAM MEMBER
// ======================================================

exports.updateSalesTeamMember = async (req, res) => {

    const session =
        await mongoose.startSession();

    session.startTransaction();

    try {

        const salesPerson =
            await SalesTeam.findById(req.params.id)
                .session(session);

        if (!salesPerson) {

            await session.abortTransaction();

            session.endSession();

            return res.status(404).json({

                success: false,

                message: "Sales team member not found."

            });

        }

        const user =
            await User.findById(
                salesPerson.userId
            ).session(session);

        if (req.body.email) {

            const exists =
                await User.findOne({

                    email: req.body.email.toLowerCase(),

                    _id: {
                        $ne: user._id
                    }

                }).session(session);

            if (exists) {

                await session.abortTransaction();

                session.endSession();

                return res.status(400).json({

                    success: false,

                    message: "Email already exists."

                });

            }

            user.email =
                req.body.email.toLowerCase();

        }

        if (req.body.fullName)
            user.fullName = req.body.fullName;

        if (req.body.phone !== undefined)
            user.phone = req.body.phone;

        await user.save({ session });

        const fields = [

            "employeeId",

            "designation",

            "department",

            "manager",

            "phone",

            "address",

            "gender",

            "dateOfBirth",

            "joiningDate",

            "dailyLeadTarget",

            "monthlyLeadTarget",

            "employmentStatus",

            "bio",

            "experience"

        ];

        fields.forEach(field => {

            if (req.body[field] !== undefined) {

                salesPerson[field] =
                    req.body[field];

            }

        });

        await salesPerson.save({

            session

        });

        await session.commitTransaction();

        session.endSession();

        const updated =
            await SalesTeam.findById(
                salesPerson._id
            )

                .populate(
                    "userId",
                    "-password"
                )

                .populate(
                    "manager",
                    "employeeId designation"
                );

        return res.status(200).json({

            success: true,

            message: "Sales team member updated successfully.",

            data: updated

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
// DELETE SALES TEAM MEMBER
// ======================================================

exports.deleteSalesTeamMember = async (req, res) => {

    const session =
        await mongoose.startSession();

    session.startTransaction();

    try {

        const salesPerson =
            await SalesTeam.findById(req.params.id)
                .session(session);

        if (!salesPerson) {

            await session.abortTransaction();

            session.endSession();

            return res.status(404).json({

                success: false,

                message: "Sales team member not found."

            });

        }

        await User.findByIdAndDelete(

            salesPerson.userId,

            { session }

        );

        await SalesTeam.findByIdAndDelete(

            salesPerson._id,

            { session }

        );

        await session.commitTransaction();

        session.endSession();

        return res.status(200).json({

            success: true,

            message: "Sales team member deleted successfully."

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
// TOGGLE SALES TEAM STATUS
// ======================================================

exports.toggleSalesTeamStatus = async (req, res) => {

    try {

        const salesPerson =
            await SalesTeam.findById(req.params.id);

        if (!salesPerson) {

            return res.status(404).json({

                success: false,

                message: "Sales team member not found."

            });

        }

        const user =
            await User.findById(
                salesPerson.userId
            );

        user.isActive = !user.isActive;

        await user.save();

        return res.status(200).json({

            success: true,

            message: `Sales team member ${user.isActive ? "activated" : "deactivated"} successfully.`,

            data: {

                isActive: user.isActive

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
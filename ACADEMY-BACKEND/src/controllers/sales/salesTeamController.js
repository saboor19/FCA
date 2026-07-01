const SalesTeam = require("../../models/sales/SalesTeam");
const User = require("../../models/User");
exports.getSalesTeam = async (req, res, next) => {

    try {

        const {
            search = "",
            status
        } = req.query;

        const filter = {};

        if (status) {

            filter.employmentStatus = status;

        }

        let query = SalesTeam.find(filter)
            .populate({
                path: "userId",
                select: "fullName email"
            })
            .select(
                "employeeId designation employmentStatus userId"
            );

        const salesTeam = await query;

        let filteredSalesTeam = salesTeam;

        if (search) {

            const searchRegex = new RegExp(search, "i");

            filteredSalesTeam = salesTeam.filter((member) =>

                searchRegex.test(member.employeeId) ||

                searchRegex.test(member.userId?.fullName || "") ||

                searchRegex.test(member.userId?.email || "")

            );

        }

        filteredSalesTeam.sort((a, b) =>
            (a.userId?.fullName || "").localeCompare(
                b.userId?.fullName || ""
            )
        );

        res.status(200).json({

            success: true,

            count: filteredSalesTeam.length,

            salesTeam: filteredSalesTeam

        });

    } catch (error) {

        next(error);

    }

};

exports.getSalesTeamMember = async (req, res, next) => {

    try {

        const member = await SalesTeam
            .findById(req.params.id);

        if (!member) {

            return res.status(404).json({
                success: false,
                message: "Sales team member not found"
            });

        }

        res.status(200).json({
            success: true,
            member
        });

    } catch (error) {

        next(error);

    }

};
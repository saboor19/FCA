const StudentFee = require("../../models/StudentFee");

// ---------------------------------------------------
// HELPERS
// ---------------------------------------------------

// Build a base match object from optional query params:
// ?batchId=  ?status=  ?paymentType=  ?month= (1-12)

function buildMatchFilter(query){

  const match = {};

  if(query.batchId){
    const mongoose = require("mongoose");
    match.batch = new mongoose.Types.ObjectId(
      query.batchId
    );
  }

  if(query.status){
    match.status = query.status;
  }

  if(query.paymentType){
    match.paymentType = query.paymentType;
  }

  if(query.month){

    const month  = parseInt(query.month, 10);
    const year   = query.year
      ? parseInt(query.year, 10)
      : new Date().getFullYear();

    const start  = new Date(year, month - 1, 1);
    const end    = new Date(year, month,     1);

    // match fees that have at least one payment in the
    // requested calendar month
    match["payments.paymentDate"] = {
      $gte: start,
      $lt:  end
    };

  }

  return match;

}

// ---------------------------------------------------
// FINANCE OVERVIEW
// GET /api/admin/finance/overview
// Query params (all optional):
//   batchId, status, paymentType, month, year
// ---------------------------------------------------

exports.getFinanceOverview =
async(req, res, next) => {

  try{

    const filter = buildMatchFilter(req.query);

    // ---------------------------------------------------
    // TOTAL REVENUE  (filtered)
    // ---------------------------------------------------

    const revenueResult =
      await StudentFee.aggregate([

        { $match: filter },

        {
          $group:{
            _id:       null,
            totalRevenue: { $sum: "$paidAmount" }
          }
        }

      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    // ---------------------------------------------------
    // TOTAL PENDING  (filtered)
    // ---------------------------------------------------

    const pendingResult =
      await StudentFee.aggregate([

        { $match: filter },

        {
          $group:{
            _id:          null,
            totalPending: { $sum: "$dueAmount" }
          }
        }

      ]);

    const totalPending =
      pendingResult[0]?.totalPending || 0;

    // ---------------------------------------------------
    // TOTAL DISCOUNTS  (filtered)
    // ---------------------------------------------------

    const discountResult =
      await StudentFee.aggregate([

        { $match: filter },

        {
          $group:{
            _id:           null,
            totalDiscount: { $sum: "$discount" }
          }
        }

      ]);

    const totalDiscount =
      discountResult[0]?.totalDiscount || 0;

    // ---------------------------------------------------
    // OVERDUE COUNT  (filtered)
    // ---------------------------------------------------

    const overdueCount =
      await StudentFee.countDocuments({
        ...filter,
        status: "OVERDUE"
      });

    // ---------------------------------------------------
    // ACTIVE EMI COUNT  (filtered)
    // ---------------------------------------------------

    const activeEMIs =
      await StudentFee.countDocuments({
        ...filter,
        paymentType: "EMI",
        status:      { $ne: "PAID" }
      });

    // ---------------------------------------------------
    // COLLECTION RATE  (filtered)
    // Total revenue as % of total final fee
    // ---------------------------------------------------

    const totalFeeResult =
      await StudentFee.aggregate([

        { $match: filter },

        {
          $group:{
            _id:      null,
            totalFee: { $sum: "$finalFee" }
          }
        }

      ]);

    const totalFee =
      totalFeeResult[0]?.totalFee || 0;

    const collectionRate = totalFee > 0
      ? Math.round((totalRevenue / totalFee) * 100)
      : 0;

    // ---------------------------------------------------
    // STATUS BREAKDOWN  (filtered)
    // Used by the donut chart
    // ---------------------------------------------------

    const statusBreakdown =
      await StudentFee.aggregate([

        { $match: filter },

        {
          $group:{
            _id:   "$status",
            count: { $sum: 1 }
          }
        }

      ]);

    // ---------------------------------------------------
    // BATCH SUMMARY  (filtered)
    // Used by the grouped bar chart
    // ---------------------------------------------------

    const batchSummary =
      await StudentFee.aggregate([

        { $match: filter },

        {
          $group:{
            _id:       "$batch",
            collected: { $sum: "$paidAmount" },
            pending:   { $sum: "$dueAmount"  }
          }
        },

        {
          $lookup:{
            from:         "batches",
            localField:   "_id",
            foreignField: "_id",
            as:           "batchInfo"
          }
        },

        {
          $project:{
            batchName: {
              $arrayElemAt: ["$batchInfo.name", 0]
            },
            collected: 1,
            pending:   1
          }
        }

      ]);

    // ---------------------------------------------------
    // RECENT TRANSACTIONS  (filtered, newest-first)
    // ---------------------------------------------------

    const recentFees =
      await StudentFee.find({
        ...filter,
        payments: { $exists: true, $ne: [] }
      })

      .populate({
        path:     "student",
        populate: {
          path:   "userId",
          select: "fullName"
        }
      })

      .populate("batch", "name")

      .sort({ updatedAt: -1 })

      .limit(50);   // fetch more so flatten+sort gives top 10

    const recentTransactions =

      recentFees

        .flatMap((fee) =>
          fee.payments.map((payment) => ({
            student:       fee.student?.userId?.fullName,
            batch:         fee.batch?.name,
            amount:        payment.amount,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            paymentDate:   payment.paymentDate,
            remarks:       payment.remarks
          }))
        )

        .sort((a, b) =>
          new Date(b.paymentDate) - new Date(a.paymentDate)
        )

        .slice(0, 10);

    // ---------------------------------------------------
    // UPCOMING EMI DUES  (filtered, soonest-first)
    // ---------------------------------------------------

    const upcomingDues =
      await StudentFee.find({
        ...filter,
        paymentType: "EMI",
        dueAmount:   { $gt: 0   },
        nextDueDate: { $ne: null }
      })

      .populate({
        path:     "student",
        populate: {
          path:   "userId",
          select: "fullName"
        }
      })

      .populate("batch", "name")

      .sort({ nextDueDate: 1 })

      .limit(10);

    // ---------------------------------------------------
    // RESPONSE
    // ---------------------------------------------------

    res.status(200).json({

      success: true,

      data:{
        totalRevenue,
        totalPending,
        totalDiscount,
        totalOverdue:    overdueCount,
        activeEMIs,
        collectionRate,
        statusBreakdown,
        batchSummary,
        recentTransactions,
        upcomingDues
      }

    });

  }catch(error){

    next(error);

  }

};
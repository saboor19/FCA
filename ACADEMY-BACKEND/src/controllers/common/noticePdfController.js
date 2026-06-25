const Notice = require("../../models/Notice");
const generateNoticePdf = require("../../utils/pdf/generateNoticePdf");

exports.downloadNoticePdf = async (req, res, next) => {

  try {

    const notice = await Notice.findById(req.params.id)
      .populate(
        "publishedBy",
        "name email"
      );

    if (!notice) {

      res.status(404);

      throw new Error(
        "Notice not found"
      );

    }

    if (!notice.isPublished) {

      res.status(400);

      throw new Error(
        "Notice is not published"
      );

    }

    if (
      notice.expiryDate &&
      notice.expiryDate < new Date()
    ) {

      res.status(400);

      throw new Error(
        "Notice has expired"
      );

    }

    generateNoticePdf(
      notice,
      res
    );

  }

  catch (error) {

    next(error);

  }

};
const errorHandler = (err, req, res, next) => {

  let statusCode = res.statusCode === 200
    ? 500
    : res.statusCode;

  let message = err.message;


  // Mongoose Invalid ID
  if (err.name === "CastError") {

    statusCode = 404;
    message = "Resource not found";

  }

  res.status(statusCode).json({
    success: false,
    message
  });

};

module.exports = errorHandler;

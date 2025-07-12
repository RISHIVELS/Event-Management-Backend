const errorHandlerMiddleware = (err, req, res, next) => {
  let error = {
    msg: err.message || "Server error please try again later",
    status: err.status || 500,
  };

  if (err?.errorResponse?.code == 11000) {
    error.msg = `Duplicate value for the field ${Object.keys(err.keyValue)}`;
    error.status = 500;
  }

  if (err?.name == "ValidationError") {
    error.msg = `Validation error for the field ${Object.keys(err.errors).join(
      ","
    )}`;
    error.status = 400;
  }
  if (err?.name == "CaseError") {
    error.msg = `Invalid id`;
    error.status = 400;
  }
  res.status(error.status).json({ msg: error.msg });
};

module.exports = errorHandlerMiddleware;

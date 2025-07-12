const CustomError = require("./../error/customError.js");
const { StatusCodes: code } = require("http-status-codes");

const verifyPermission = (currentUserId, resourceId) => {
  if (currentUserId == resourceId.toString()) return;

  throw new CustomError(
    "you are not allowed to do this operation",
    code.FORBIDDEN
  );
};

module.exports = verifyPermission;

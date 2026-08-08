const sendResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  return sendResponse(
    res,
    err.statusCode || 500,
    false,
    err.message || "Internal Server Error"
  );
};

module.exports = errorHandler;
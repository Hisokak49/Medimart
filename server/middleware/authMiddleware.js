const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User (Exclude Password)
      req.user = await User.findById(decoded.id).select("-password");

      return next();
    }

    const error = new Error("Not authorized. No token provided.");
    error.statusCode = 401;
    return next(error);
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      error.statusCode = 401;
    }
    return next(error);
  }
};

module.exports = {
  protect,
};
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // console.log("Cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = await User
      .findById(decoded.id)
      .select("-password");

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Token failed"
    });

  }
};

const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied"
      });

    }

    next();

  };

};

module.exports = {
  protect,
  authorizeRoles
};
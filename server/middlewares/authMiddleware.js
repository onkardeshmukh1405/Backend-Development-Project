const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports = async (req, res, next) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    try {
      if (err) {
        return res.status(401).json({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.userId = decoded.id;
        next();
      }
    } catch (error) {
      return res.status(401).json({
        message: "Authentication failed",
        success: false,
      });
    }
  });
};

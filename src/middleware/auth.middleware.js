const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklist.model");

const authMiddleware = async (req, res, next) => {
  try {
    // Accept token from cookie OR Authorization: Bearer <token>
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token has been logged out" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;

const { verifyToken } = require("../jwt");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Authentication token required." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).send({ message: "User not found." });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "cipherschools_jwt_secret_2026";

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, verifyToken };

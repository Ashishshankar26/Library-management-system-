const express = require("express");
const router = express.Router();
const { signUp, login, getMe } = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");

router.post("/sign-up", signUp);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);

module.exports = router;

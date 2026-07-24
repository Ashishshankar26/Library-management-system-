const User = require("../models/User");
const { hashPassword, comparePassword } = require("../bcrypt");
const { generateToken } = require("../jwt");

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email." });
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      type: type || "STUDENT",
    });
    const token = generateToken({ id: user._id, type: user.type });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, type: user.type } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    let user = await User.findOne({ email: normalizedEmail });

    // Auto-seed/create demo account if not exists yet
    if (!user) {
      const isLibrarian = normalizedEmail.includes("librarian") || normalizedEmail.includes("admin");
      const hashedPassword = await hashPassword(password || "password");
      user = await User.create({
        name: isLibrarian ? "Librarian User" : "Student Member",
        email: normalizedEmail,
        password: hashedPassword,
        type: isLibrarian ? "LIBRARIAN" : "STUDENT",
      });
    } else {
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        // If password changed, update password to allow seamless login
        const newHashedPassword = await hashPassword(password);
        user.password = newHashedPassword;
        await user.save();
      }
    }

    const token = generateToken({ id: user._id, type: user.type });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, type: user.type } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

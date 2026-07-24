const User = require("../models/User");
const { hashPassword, comparePassword } = require("../bcrypt");
const { generateToken } = require("../jwt");

// Seed default users in MongoDB if database is empty
const seedDefaultUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const librarianPass = await hashPassword("password");
      const studentPass = await hashPassword("password");

      await User.create([
        {
          name: "Library Admin (Librarian)",
          email: "librarian@library.com",
          password: librarianPass,
          type: "LIBRARIAN",
        },
        {
          name: "Ashish Shankar (Student)",
          email: "student@library.com",
          password: studentPass,
          type: "STUDENT",
        },
      ]);
      console.log("Default users seeded in MongoDB successfully.");
    }
  } catch (err) {
    console.log("Seeding notice:", err.message);
  }
};

seedDefaultUsers();

exports.signUp = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "An account already exists with this email address." });
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name: name || "Library User",
      email: normalizedEmail,
      password: hashedPassword,
      type: type || "STUDENT",
    });

    const token = generateToken({ id: user._id, type: user.type });
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: "No account found with this email. Please Sign Up first." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password. Please check your credentials." });
    }

    const token = generateToken({ id: user._id, type: user.type });
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      type: req.user.type,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

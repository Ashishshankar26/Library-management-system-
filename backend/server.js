const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoute = require("./routes/user-route");
const bookRoute = require("./routes/book-route");
const bookIssueRoute = require("./routes/book-issue-route");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/user", userRoute);
app.use("/book", bookRoute);
app.use("/book-issue", bookIssueRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Library App Backend is running on Port ${PORT}`);
});

module.exports = app;

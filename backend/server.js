const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const issueRoutes = require('./routes/issueRoutes');

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/issues', issueRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'CipherSchools Library Management API is running...' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Library API Server running on port ${PORT}`);
});

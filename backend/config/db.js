const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cipherschools_library');
    console.log(`Library MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Library MongoDB Error: ${error.message}`);
  }
};

module.exports = connectDB;

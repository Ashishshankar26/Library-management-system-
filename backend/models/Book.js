const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Computer Science', 'Fiction', 'Science & Tech', 'Mathematics', 'History', 'Self-Help'],
    default: 'Computer Science',
  },
  totalCopies: {
    type: Number,
    required: true,
    min: 1,
    default: 5,
  },
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    default: 5,
  },
  coverUrl: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Book', bookSchema);

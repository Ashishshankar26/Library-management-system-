const mongoose = require('mongoose');

const issueRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue'],
    default: 'issued',
  },
  fineAmount: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('IssueRecord', issueRecordSchema);

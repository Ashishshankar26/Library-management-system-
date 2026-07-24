const mongoose = require('mongoose');

const issueRecordSchema = new mongoose.Schema({
  isbn: { type: String, required: true },
  studentId: { type: String, required: true },
  issueDate: { type: String, required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
}, { timestamps: true });

module.exports = mongoose.model('IssueRecord', issueRecordSchema);

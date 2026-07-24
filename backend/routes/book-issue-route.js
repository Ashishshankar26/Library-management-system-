const express = require('express');
const router = express.Router();
const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');

// GET /book-issue
router.get('/', async (req, res) => {
  try {
    const issues = await IssueRecord.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /book-issue
router.post('/', async (req, res) => {
  try {
    const { isbn, studentId, issueDate, bookId } = req.body;

    const issue = await IssueRecord.create({
      isbn: isbn || '12345',
      studentId: studentId || '64bce14088f0b38643a177f1',
      issueDate: issueDate || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      book: bookId || null,
    });

    if (bookId) {
      await Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: -1 } });
    } else if (isbn) {
      await Book.findOneAndUpdate({ isbn }, { $inc: { availableCopies: -1 } });
    }

    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /book-issue/:id
router.delete('/:id', async (req, res) => {
  try {
    const issue = await IssueRecord.findByIdAndDelete(req.params.id);
    if (issue && issue.isbn) {
      await Book.findOneAndUpdate({ isbn: issue.isbn }, { $inc: { availableCopies: 1 } });
    }
    res.json({ message: 'Book returned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

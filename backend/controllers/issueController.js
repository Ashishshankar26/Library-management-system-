const IssueRecord = require('../models/IssueRecord');
const Book = require('../models/Book');

// @desc    Issue a book to user
// @route   POST /api/issues
exports.issueBook = async (req, res) => {
  try {
    const { bookId, days } = req.body;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No available copies left' });
    }

    // Check if user already has an active issue for this book
    const existingIssue = await IssueRecord.findOne({
      user: userId,
      book: bookId,
      status: 'issued',
    });

    if (existingIssue) {
      return res.status(400).json({ success: false, message: 'You already have an active loan for this book' });
    }

    const loanDays = days || 14; // Default 14 days loan
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);

    const record = await IssueRecord.create({
      user: userId,
      book: bookId,
      dueDate,
      status: 'issued',
    });

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Return an issued book
// @route   POST /api/issues/:id/return
exports.returnBook = async (req, res) => {
  try {
    const record = await IssueRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Issue record not found' });
    }

    if (record.status === 'returned') {
      return res.status(400).json({ success: false, message: 'Book is already returned' });
    }

    record.status = 'returned';
    record.returnDate = new Date();

    // Check fine if returned after due date
    if (record.returnDate > record.dueDate) {
      const diffTime = Math.abs(record.returnDate - record.dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      record.fineAmount = diffDays * 5; // $5 / Rs 5 per overdue day
    }

    await record.save();

    // Increase available copies back
    const book = await Book.findById(record.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's issue history
// @route   GET /api/issues/my-issues
exports.getMyIssues = async (req, res) => {
  try {
    const records = await IssueRecord.find({ user: req.user._id })
      .populate('book', 'title author coverUrl isbn')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all issues (Admin only)
// @route   GET /api/issues
exports.getAllIssues = async (req, res) => {
  try {
    const records = await IssueRecord.find()
      .populate('user', 'name email')
      .populate('book', 'title author isbn')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

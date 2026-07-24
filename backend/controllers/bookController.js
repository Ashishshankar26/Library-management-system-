const Book = require('../models/Book');

// @desc    Get all books with optional search & filtering
// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new book (Admin only)
// @route   POST /api/books
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, totalCopies, coverUrl, description } = req.body;

    const bookExists = await Book.findOne({ isbn });
    if (bookExists) {
      return res.status(400).json({ success: false, message: 'Book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalCopies: totalCopies || 5,
      availableCopies: totalCopies || 5,
      coverUrl,
      description,
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update book (Admin only)
// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete book (Admin only)
// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

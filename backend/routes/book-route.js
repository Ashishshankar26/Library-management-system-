const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /book
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, availableCopies, totalCopies } = req.body;
    const book = await Book.create({
      title,
      author,
      isbn: isbn || String(Date.now()),
      totalCopies: Number(totalCopies) || 5,
      availableCopies: Number(availableCopies || totalCopies) || 5,
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /book/:id
router.delete('/:id', async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

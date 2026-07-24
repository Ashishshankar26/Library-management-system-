const express = require('express');
const router = express.Router();
const {
  issueBook,
  returnBook,
  getMyIssues,
  getAllIssues,
} = require('../controllers/issueController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getAllIssues)
  .post(protect, issueBook);

router.get('/my-issues', protect, getMyIssues);
router.post('/:id/return', protect, returnBook);

module.exports = router;

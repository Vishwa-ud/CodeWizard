// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/problems/:id/comments', authMiddleware, CommentController.addComment);
router.get('/problems/:id/comments', CommentController.getCommentsForProblem);
// Add a reply to a comment
router.post('/comments/:commentId/replies', CommentController.addReply);

module.exports = router;

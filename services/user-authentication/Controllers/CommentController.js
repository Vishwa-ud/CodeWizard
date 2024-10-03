// controllers/CommentController.js
const Comment = require('../models/Comment');

// Add a new comment
exports.addComment = async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  try {
    const newComment = new Comment({
      problemId: id,
      text,
    });

    await newComment.save();
    res.status(201).json({ msg: 'Comment added successfully', comment: newComment });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get comments for a problem
exports.getCommentsForProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await Comment.find({ problemId: id }).populate('replies');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add a reply to a comment
exports.addReply = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
  
    try {
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ msg: 'Comment not found' });
      }
  
      comment.replies.push({ text });
      await comment.save();
  
      res.status(201).json({ msg: 'Reply added successfully', comment });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  };
const express = require('express');
const Comment = require('../models/Comment');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

// Create a comment
router.post('/comments', isAuthenticated, async (req, res) => {
  try {
    const comment = await Comment.create({ ...req.body, author: req.session.userId });
    console.log(`Comment created with ID: ${comment._id}`);
    res.status(201).json(comment);
  } catch (error) {
    console.error(`Error creating comment: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

// Read comments for a post
router.get('/comments/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('author');
    console.log(`Fetched comments for post ID: ${req.params.postId}`);
    res.json(comments);
  } catch (error) {
    console.error(`Error fetching comments for post ID: ${req.params.postId}: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

// Update a comment
router.put('/comments/:commentId', isAuthenticated, async (req, res) => {
  try {
    const updatedComment = await Comment.findOneAndUpdate({ _id: req.params.commentId, author: req.session.userId }, req.body, { new: true });
    if (!updatedComment) {
      console.log('Comment not found or user not authorized to update');
      return res.status(404).send('Comment not found or user not authorized to update');
    }
    console.log(`Comment updated with ID: ${req.params.commentId}`);
    res.json(updatedComment);
  } catch (error) {
    console.error(`Error updating comment with ID: ${req.params.commentId}: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

// Delete a comment
router.delete('/comments/:commentId', isAuthenticated, async (req, res) => {
  try {
    const deletedComment = await Comment.findOneAndDelete({ _id: req.params.commentId, author: req.session.userId });
    if (!deletedComment) {
      console.log('Comment not found or user not authorized to delete');
      return res.status(404).send('Comment not found or user not authorized to delete');
    }
    console.log(`Comment deleted with ID: ${req.params.commentId}`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting comment with ID: ${req.params.commentId}: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
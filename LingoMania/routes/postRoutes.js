const express = require('express');
const Post = require('../models/Post');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

// Create a post
router.post('/posts', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, author: req.session.userId });
    console.log(`Post created with ID: ${post._id} by User ID: ${req.session.userId}`);
    res.status(201).json(post);
  } catch (error) {
    console.error(`Error creating post: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

// Read posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author');
    console.log(`Fetched ${posts.length} posts.`);
    res.status(200).json(posts);
  } catch (error) {
    console.error(`Error fetching posts: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

// Update a post
router.put('/posts/:postId', isAuthenticated, async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate({ _id: req.params.postId, author: req.session.userId }, req.body, { new: true });
    if (!updatedPost) {
      console.log(`Post not found or user not authorized to update. Post ID: ${req.params.postId}`);
      return res.status(404).send('Post not found or user not authorized to update');
    }
    console.log(`Post updated with ID: ${req.params.postId}`);
    res.json(updatedPost);
  } catch (error) {
    console.error(`Error updating post: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

// Delete a post
router.delete('/posts/:postId', isAuthenticated, async (req, res) => {
  try {
    const deletedPost = await Post.findOneAndDelete({ _id: req.params.postId, author: req.session.userId });
    if (!deletedPost) {
      console.log(`Post not found or user not authorized to delete. Post ID: ${req.params.postId}`);
      return res.status(404).send('Post not found or user not authorized to delete');
    }
    console.log(`Post deleted with ID: ${req.params.postId}`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting post: ${error.message}`, error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
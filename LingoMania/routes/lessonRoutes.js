const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const { isAuthenticated } = require('./middleware/authMiddleware');

// Create a lesson
router.post('/lessons', isAuthenticated, async (req, res) => {
  try {
    const lesson = await Lesson.create(req.body);
    console.log(`Lesson created: ${lesson._id}`);
    res.status(201).json(lesson);
  } catch (error) {
    console.error(`Error creating lesson: ${error.message}`, error);
    res.status(400).json({ error: error.message });
  }
});

// Read all lessons for a language
router.get('/lessons/:languageId', async (req, res) => {
  try {
    const lessons = await Lesson.find({ language: req.params.languageId }).sort('order');
    console.log(`Fetched lessons for language ID: ${req.params.languageId}`);
    res.status(200).json(lessons);
  } catch (error) {
    console.error(`Error fetching lessons for language ID: ${req.params.languageId}: ${error.message}`, error);
    res.status(400).json({ error: error.message });
  }
});

// Update a lesson
router.put('/lessons/:id', isAuthenticated, async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log(`Lesson updated: ${req.params.id}`);
    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error(`Error updating lesson: ${req.params.id}: ${error.message}`, error);
    res.status(400).json({ error: error.message });
  }
});

// Delete a lesson
router.delete('/lessons/:id', isAuthenticated, async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    console.log(`Lesson deleted: ${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting lesson: ${req.params.id}: ${error.message}`, error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
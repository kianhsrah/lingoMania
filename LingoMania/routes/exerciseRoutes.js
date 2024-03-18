const express = require('express');
const Exercise = require('../models/Exercise');
const { isAuthenticated } = require('./middleware/authMiddleware');

const router = express.Router();

// Get exercises by lesson ID
router.get('/exercises/:lessonId', isAuthenticated, async (req, res) => {
  try {
    const exercises = await Exercise.find({ lessonId: req.params.lessonId });
    console.log(`Fetched exercises for lesson ID: ${req.params.lessonId}`);
    res.json(exercises);
  } catch (error) {
    console.error(`Error fetching exercises for lesson ID: ${req.params.lessonId}:`, error);
    res.status(500).send(error.message);
  }
});

// Submit an answer for validation
router.post('/exercises/validate/:exerciseId', isAuthenticated, async (req, res) => {
  try {
    const { answer } = req.body;
    const exercise = await Exercise.findById(req.params.exerciseId);

    if(!exercise) {
      console.log(`Exercise with ID: ${req.params.exerciseId} not found`);
      return res.status(404).send('Exercise not found');
    }

    const isCorrect = exercise.answer === answer;
    console.log(`Validation result for exercise ID: ${req.params.exerciseId} - Answer is correct: ${isCorrect}`);
    res.json({ correct: isCorrect });
  } catch (error) {
    console.error(`Error validating answer for exercise ID: ${req.params.exerciseId}:`, error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
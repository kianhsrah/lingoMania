const express = require('express');
const Quiz = require('../models/Quiz');
const UserProgress = require('../models/UserProgress');
const { isAuthenticated } = require('./middleware/authMiddleware');

const router = express.Router();

// Generate a quiz for a user based on the language code
router.get('/quizzes/:languageCode', isAuthenticated, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ languageCode: req.params.languageCode });
    // For simplicity, return the first quiz found
    if (quizzes.length > 0) {
      console.log(`Quiz fetched for language code: ${req.params.languageCode}`);
      res.json(quizzes[0]);
    } else {
      console.log(`No quizzes found for language code: ${req.params.languageCode}`);
      res.status(404).send('No quizzes found for the specified language code.');
    }
  } catch (error) {
    console.error(`Error fetching quizzes for language code ${req.params.languageCode}: ${error.message}`, error);
    res.status(500).send(error.message);
  }
});

// Submit quiz results and update user progress
router.post('/quizzes/submit', isAuthenticated, async (req, res) => {
  const { quizId, score, passed } = req.body;
  try {
    const updatedProgress = await UserProgress.findOneAndUpdate(
      { userId: req.session.userId },
      { $push: { quizzesCompleted: { quiz: quizId, score, passed } } },
      { new: true, upsert: true }
    );
    console.log(`Quiz results saved for user: ${req.session.userId}`);
    res.status(200).send('Quiz results saved successfully.');
  } catch (error) {
    console.error(`Error saving quiz results for user: ${req.session.userId}: ${error.message}`, error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
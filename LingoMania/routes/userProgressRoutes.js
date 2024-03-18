const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const { isAuthenticated } = require('./middleware/authMiddleware');

// Fetch user progress
router.get('/progress/:userId', isAuthenticated, async (req, res) => {
  try {
    const userProgress = await UserProgress.find({ userId: req.params.userId })
      .populate('lessonsCompleted')
      .populate('exercisesCompleted');
    console.log(`Successfully fetched user progress for userId: ${req.params.userId}`);
    res.status(200).json(userProgress);
  } catch (error) {
    console.error(`Error fetching user progress for userId: ${req.params.userId}: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

// Update progress (generic, should be called with specific details from client side)
router.post('/progress/update', isAuthenticated, async (req, res) => {
  try {
    const { userId, languageCode, lessonId, exerciseId } = req.body;
    let update = {};
    if(lessonId) update = { $addToSet: { lessonsCompleted: lessonId } };
    if(exerciseId) update = { $addToSet: { exercisesCompleted: exerciseId } };
    
    const userProgress = await UserProgress.findOneAndUpdate(
      { userId, languageCode },
      update,
      { new: true, upsert: true }
    );
    console.log(`User progress updated for userId: ${userId}, languageCode: ${languageCode}`);
    res.status(200).json(userProgress);
  } catch (error) {
    console.error(`Error updating user progress for userId: ${req.body.userId}: ${error.message}`, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;
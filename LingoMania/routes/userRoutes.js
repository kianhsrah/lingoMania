const express = require('express');
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

// Endpoint to get user profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password'); // Exclude password from the result
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }
    console.log('User profile fetched successfully');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

// Endpoint to update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { email, displayName, learningLanguages } = req.body;
    const user = await User.findByIdAndUpdate(req.session.userId, {
      email,
      displayName,
      learningLanguages
    }, { new: true }).select('-password');
    if (!user) {
      console.log('User not found during profile update');
      return res.status(404).send('User not found');
    }
    console.log('User profile updated successfully');
    res.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error.message, error.stack);
    res.status(500).send(error.message);
  }
});

module.exports = router;
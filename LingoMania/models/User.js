const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: false }, // Make username not strictly required
  password: { type: String, required: false }, // Make password not strictly required
  email: { type: String, required: false }, // Remove unique constraint and not strictly required
  displayName: { type: String },
  learningLanguages: [{ type: String }],
  googleId: { type: String } // Add Google ID field
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password') || !user.password) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
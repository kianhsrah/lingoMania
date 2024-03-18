const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  languageCode: { type: String, required: true },
  lessonsCompleted: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  exercisesCompleted: [{ type: Schema.Types.ObjectId, ref: 'Exercise' }]
});

userProgressSchema.pre('save', function(next) {
  console.log('Saving user progress for userId:', this.userId);
  next();
});

userProgressSchema.post('save', function(doc, next) {
  console.log(`User progress saved for userId: ${doc.userId}`);
  next();
});

userProgressSchema.post('findOneAndUpdate', function(doc, next) {
  if (!doc) {
    console.error('User progress update failed, document not found.');
  } else {
    console.log(`User progress updated for userId: ${doc.userId}`);
  }
  next();
});

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = UserProgress;
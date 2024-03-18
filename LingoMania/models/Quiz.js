const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  languageCode: { type: String, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Exercise', required: true }],
  passingScore: { type: Number, required: true }
});

quizSchema.pre('save', function(next) {
  console.log(`Saving quiz for languageCode: ${this.languageCode}`);
  next();
});

quizSchema.post('save', function(doc, next) {
  console.log(`Quiz saved with ID: ${doc._id}`);
  next();
});

quizSchema.post('findOneAndUpdate', function(doc, next) {
  if (!doc) {
    console.error('Quiz update failed, document not found.');
  } else {
    console.log(`Quiz updated for quiz ID: ${doc._id}`);
  }
  next();
});

quizSchema.post('findOneAndDelete', function(doc, next) {
  if (!doc) {
    console.error('Quiz delete failed, document not found.');
  } else {
    console.log(`Quiz deleted for quiz ID: ${doc._id}`);
  }
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
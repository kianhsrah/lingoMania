const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  question: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['fill-in-the-blank', 'multiple-choice', 'translation'],
    required: true
  },
  options: { type: [String], required: function() { return this.questionType === 'multiple-choice'; } },
  answer: { type: String, required: true }
});

exerciseSchema.pre('save', function(next) {
  if (this.questionType === 'multiple-choice' && (!this.options || this.options.length < 2)) {
    const err = new Error('Multiple-choice questions must have at least two options.');
    console.error('Error saving exercise:', err.message);
    next(err);
  } else {
    next();
  }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
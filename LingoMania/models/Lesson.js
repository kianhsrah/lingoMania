const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  title: { type: String, required: true },
  language: { type: Schema.Types.ObjectId, ref: 'Language', required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
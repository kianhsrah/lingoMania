const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  languageCode: { type: String, required: true }
});

postSchema.pre('save', function(next) {
  console.log(`Saving post by user ${this.author}`);
  next();
});

postSchema.post('save', function(doc, next) {
  console.log(`Post saved with ID: ${doc._id}`);
  next();
});

postSchema.post('findOneAndUpdate', function(doc, next) {
  if (!doc) {
    console.error('Post update failed, document not found.');
  } else {
    console.log(`Post updated for post ID: ${doc._id}`);
  }
  next();
});

postSchema.post('findOneAndDelete', function(doc, next) {
  if (!doc) {
    console.error('Post delete failed, document not found.');
  } else {
    console.log(`Post deleted for post ID: ${doc._id}`);
  }
  next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
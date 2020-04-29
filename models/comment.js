const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define commentSchema
const commentSchema = new Schema({
  comment: { type: String, required: true },
  task: { type: Schema.Types.ObjectId, required: true },
  commentedBy: { type: Schema.Types.ObjectId, required: true},
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define userSchema
const milestoneSchema = new Schema({

  milestoneName: { type: String, required: true },
  deadline: { type: String},
  status: { type: String},
  tasks: [Schema.Types.ObjectId]
});

const Milestone = mongoose.model('Milestone', milestoneSchema);
module.exports = Milestone;
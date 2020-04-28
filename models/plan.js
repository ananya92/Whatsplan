const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define userSchema
const planSchema = new Schema({

  title: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true},
  members: {type: [String], required: true} ,
  status: { type: String, required: true},
  milestones: [Schema.Types.ObjectId]
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;
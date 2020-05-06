const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskName: { type: String, required: true},
  description: String,
  asignee: {type: Schema.Types.ObjectId, required: true},
  status: { type: String, required: true},
  startDate: { type: String},
  endDate: { type: String},
  comments: [Schema.Types.ObjectId],
  planId: Schema.Types.ObjectId
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

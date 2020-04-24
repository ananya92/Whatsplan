const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  taskname: { type: String, required: true},
  description: String,
  emailId: { type: String, required: true},
  password: { type: String, required: true},
  img: { data: Buffer, contentType: String},
  plans: [Schema.Types.ObjectId]
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

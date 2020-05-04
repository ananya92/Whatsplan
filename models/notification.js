const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define notificationSchema
const notificationSchema = new Schema({
  message: { type: String, required: true },
  belongsTo: { type: Schema.Types.ObjectId, required: true},
  isRead: { type: Boolean, required: true},
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
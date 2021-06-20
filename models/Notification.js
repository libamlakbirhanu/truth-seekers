const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.ObjectId,
		ref: 'seeker',
		required: [true, 'this field can not be empty'],
	},
	message: {
		type: String,
		required: [true, 'this field can not be empty'],
	},
	targetDocument: {
		type: mongoose.Schema.ObjectId,
		ref: 'seek',
		required: [true, 'this field can not be empty'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Notification = mongoose.model(
	'notification',
	NotificationSchema
);

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
	message: {
		type: String,
		required: [true, 'this field can not be empty'],
	},
	targetDocument: {
		type: mongoose.Schema.ObjectId,
		ref: 'seek',
	},
	targetUser: {
		type: mongoose.Schema.ObjectId,
		ref: 'seeker',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

NotificationSchema.pre(/^find/, function (next) {
	this.sort('-createdAt');

	next();
});

module.exports = Notification = mongoose.model(
	'notification',
	NotificationSchema
);

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
	reporters: {
		type: mongoose.Schema.ObjectId,
		ref: 'seeker',
		required: [true, 'this field can not be empty'],
	},
	targetSeeker: {
		type: mongoose.Schema.ObjectId,
		ref: 'seeker',
		required: [true, 'this field can not be empty'],
	},
	targetDoc: {
		type: Object,
		required: [true, 'this field can not be empty'],
	},
	reason: {
		type: String,
		required: [true, 'this field can not be empty'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

ReportSchema.pre(/^find/, function (next) {
	this.sort('-createdAt');

	next();
});

module.exports = Report = mongoose.model('report', ReportSchema);

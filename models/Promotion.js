const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
	targetSeeker: {
		type: mongoose.Schema.ObjectId,
		ref: 'seeker',
		required: [true, 'this field can not be empty'],
	},
	message: {
		type: String,
		default: 'waiting for admin approval to be promoted to EXPERT rank',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

PromotionSchema.pre(/^find/, function (next) {
	this.sort('-createdAt');

	next();
});

module.exports = Report = mongoose.model('promotion', PromotionSchema);

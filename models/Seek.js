const mongoose = require('mongoose');

const SeekSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'seeker',
		required: [true, 'a seek must belong to a seeker'],
	},
	title: {
		type: String,
		required: [true, 'title can not be empty'],
	},
	body: {
		type: String,
		required: [true, 'a comment can not be empty'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	upvotes: { type: Number, default: 0 },
	downvotes: { type: Number, default: 0 },
	commentCount: { type: Number, default: 0 },
});

SeekSchema.virtual('comments', {
	ref: 'comment',
	foreignField: 'seek',
	localField: '_id',
});

module.exports = Seek = mongoose.model('seek', SeekSchema);

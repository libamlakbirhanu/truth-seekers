const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
	seek: {
		type: mongoose.Schema.ObjectId,
		ref: 'seek',
		required: [true, 'a comment must belong to a seek'],
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'seeker',
		required: [true, 'a comment must belong to a seeker'],
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
});

CommentSchema.pre('find', function (next) {
	this.sort('-createdAt');
	this.populate({
		path: 'author',
		select: 'name photo rank',
	});

	next();
});

CommentSchema.methods.incrementUpvotes = function () {
	return ++this.upvotes;
};

CommentSchema.methods.decrementUpvotes = function () {
	return --this.upvotes;
};

CommentSchema.methods.incrementDownvotes = function () {
	return ++this.downvotes;
};

CommentSchema.methods.decrementDownvotes = function () {
	return --this.downvotes;
};

module.exports = Comment = mongoose.model('comment', CommentSchema);

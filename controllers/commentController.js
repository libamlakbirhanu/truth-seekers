const Comment = require('./../models/Comment');
const Seek = require('./../models/Seek');
const { errorMessage, customErrorMessage } = require('./../utils/ErrorMessage');
const docBelongsToCurrentUser = require('./../utils/ownerCheck');

exports.createComment = async (req, res, next) => {
	try {
		const body = req.body;
		body.author = req.user._id;

		const seek = await Seek.findById(body.seek);

		if (!seek) return customErrorMessage('seek does not exist', 400, res);

		seek.commentCount++;
		await seek.save();

		const comment = new Comment({ ...body });

		comment.populate('author', (err) => err && console.error(err));

		const doc = await comment.save();

		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 400, res);
	}
};

exports.getComment = async (req, res, next) => {
	try {
		const doc = await Comment.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.getComments = async (req, res, next) => {
	try {
		const docs = await Comment.find({ seek: req.params.id });
		res.status(200).json({
			status: 'success',
			length: docs.length,
			result: { docs },
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.updateComment = async (req, res, next) => {
	try {
		if (!(await docBelongsToCurrentUser(Comment, req.params.id, req.user.id)))
			return customErrorMessage(
				'the comment does not belong to the current user or the comment does not exist',
				403,
				res
			);

		const newDoc = await Comment.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			result: newDoc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.deleteComment = async (req, res, next) => {
	try {
		if (!(await docBelongsToCurrentUser(Comment, req.params.id, req.user.id)))
			return customErrorMessage(
				'the comment does not belong to the current user or the comment does not exist',
				403,
				res
			);

		const doc = await Comment.findByIdAndDelete(req.params.id);

		const seek = await Seek.findById(doc.seek);

		seek.commentCount--;
		await seek.save();

		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.upvote = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		const seeker = await Seeker.findById(req.user.id);

		const liked = seeker.likedComments.find((item) => item == req.params.id);
		const disliked = seeker.dislikedComments.find(
			(item) => item == req.params.id
		);

		if (liked)
			return customErrorMessage(
				'You have already upvoted this comment',
				400,
				res
			);

		if (disliked) {
			comment.downvotes = comment.decrementDownvotes();
			seeker.dislikedComments.splice(
				seeker.dislikedComments.indexOf(req.params.id),
				1
			);
		}

		comment.upvotes = comment.incrementUpvotes();
		seeker.likedComments = seeker.likedComments.concat([req.params.id]);

		await seeker.save();
		const doc = await comment.save();
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.downvote = async (req, res, next) => {
	try {
		const comment = await Comment.findById(req.params.id);
		const seeker = await Seeker.findById(req.user.id);

		const disliked = seeker.dislikedComments.find(
			(item) => item == req.params.id
		);
		const liked = seeker.likedComments.find((item) => item == req.params.id);

		if (disliked)
			return customErrorMessage(
				'You have already downvoted this comment',
				400,
				res
			);

		if (liked) {
			comment.upvotes = comment.decrementUpvotes();
			seeker.likedComments.splice(
				seeker.likedComments.indexOf(req.params.id),
				1
			);
		}

		comment.downvotes = comment.incrementDownvotes();
		seeker.dislikedComments = seeker.dislikedComments.concat([req.params.id]);

		await seeker.save();
		const doc = await comment.save();
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

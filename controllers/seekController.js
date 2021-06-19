const Seek = require('./../models/Seek');
const Seeker = require('./../models/Seeker');
const { customErrorMessage, errorMessage } = require('./../utils/errorMessage');

const seekBelongsToCurrentUser = async (sid, uid) => {
	const seek = await Seek.findById(sid).find({
		author: { $ne: uid },
	});

	if (seek) return false;
	return true;
};

exports.getSeeks = async (req, res, next) => {
	try {
		const docs = await Seek.find().sort('-createdAt');

		res.status(200).json({
			status: 'success',
			result: docs.length,
			data: { docs },
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.getSeek = async (req, res, next) => {
	try {
		const doc = await Seek.findById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: doc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.createSeek = async (req, res, next) => {
	try {
		const body = req.body;
		body.author = req.user._id;
		const doc = await Seek.create(body);
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.updateSeek = async (req, res, next) => {
	try {
		if (!(await seekBelongsToCurrentUser(req.params.id, req.user.id)))
			return customErrorMessage(
				'the seek does not belong to the current user or the seek does not exist',
				400,
				res
			);

		const doc = await Seek.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		console.error(err);
		return errorMessage(err, 500, res);
	}
};

exports.deleteSeek = async (req, res, next) => {
	try {
		if (!(await seekBelongsToCurrentUser(req.params.id, req.user.id)))
			return customErrorMessage(
				'the seek does not belong to the current user or the seek does not exist',
				400,
				res
			);

		await Seek.findByIdAndDelete(req.params.id);

		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		console.log(err);
		return errorMessage(err, 500, res);
	}
};

exports.upvote = async (req, res, next) => {
	try {
		const seek = await Seek.findById(req.params.id);
		const seeker = await Seeker.findById(req.user.id);

		const liked = seeker.likedSeeks.find((item) => item == req.params.id);
		const disliked = seeker.dislikedSeeks.find((item) => item == req.params.id);

		if (liked)
			return customErrorMessage('You have already upvoted this seek', 400, res);

		if (disliked) {
			seek.downvotes = seek.decrementDownvotes();
			seeker.dislikedSeeks.splice(
				seeker.dislikedSeeks.indexOf(req.params.id),
				1
			);
		}

		seek.upvotes = seek.incrementUpvotes();
		seeker.likedSeeks = seeker.likedSeeks.concat([req.params.id]);

		await seeker.save();
		const doc = await seek.save();
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
		const seek = await Seek.findById(req.params.id);
		const seeker = await Seeker.findById(req.user.id);

		const disliked = seeker.dislikedSeeks.find((item) => item == req.params.id);
		const liked = seeker.likedSeeks.find((item) => item == req.params.id);

		if (disliked)
			return customErrorMessage(
				'You have already downvoted this seek',
				400,
				res
			);

		if (liked) {
			seek.upvotes = seek.decrementUpvotes();
			seeker.likedSeeks.splice(seeker.likedSeeks.indexOf(req.params.id), 1);
		}

		seek.downvotes = seek.incrementDownvotes();
		seeker.dislikedSeeks = seeker.dislikedSeeks.concat([req.params.id]);

		await seeker.save();
		const doc = await seek.save();
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

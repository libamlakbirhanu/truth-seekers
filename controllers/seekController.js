const Seek = require('./../models/Seek');
const Comment = require('./../models/Comment');
const Seeker = require('./../models/Seeker');
const Notification = require('./../models/Notification');
const { customErrorMessage, errorMessage } = require('./../utils/errorMessage');
const docBelongsToCurrentUser = require('./../utils/ownerCheck');
const createNotifications = require('./../utils/createNotifications');

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

		const seek = new Seek({ ...body });

		seek.populate('author', (err) => err && console.error(err));

		const doc = await seek.save();

		await createNotifications(
			`${req.user.name} created a seek with a title "${doc.title}"`,
			doc.id,
			req.user.id
		);

		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		console.error(err);
		return errorMessage(err, 500, res);
	}
};

exports.updateSeek = async (req, res, next) => {
	try {
		if (!(await docBelongsToCurrentUser(Seek, req.params.id, req.user.id)))
			return customErrorMessage(
				'the seek does not belong to the current user or the seek does not exist',
				403,
				res
			);

		const doc = await Seek.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		await createNotifications(
			`${req.user.name} has updated his/her seek with the title "${doc.title}"`,
			doc.id,
			req.user.id
		);

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
		if (!(await docBelongsToCurrentUser(Seek, req.params.id, req.user.id)))
			return customErrorMessage(
				'the seek does not belong to the current user or the seek does not exist',
				403,
				res
			);

		const seekers = await Seeker.find();

		seekers.map(async (seeker) => {
			seeker.likedSeeks.splice(seeker.likedSeeks.indexOf(req.params.id), 1);
			seeker.dislikedSeeks.splice(
				seeker.dislikedSeeks.indexOf(req.params.id),
				1
			);
			await seeker.save();
		});

		await Comment.deleteMany({ seek: req.params.id });

		const doc = await Seek.findByIdAndDelete(req.params.id);

		res.status(200).json({
			status: 'success',
			doc,
		});
	} catch (err) {
		console.error(err);
		return errorMessage(err, 500, res);
	}
};

exports.upvote = async (req, res, next) => {
	try {
		const seek = await Seek.findById(req.params.id);
		const seeker = await Seeker.findById(req.user.id);

		if (!seek) return customErrorMessage('seek does not exist', 404, res);

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

		const sender =
			req.user.id === seek.author.id ? 'his/her' : `${seek.author.name}'s`;
		await seeker.save();
		const doc = await seek.save();

		await createNotifications(
			`${req.user.name} upvoted ${sender} seek with the title "${seek.title}"`,
			seek.id,
			req.user.id
		);

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

		if (!seek) return customErrorMessage('seek does not exist', 404, res);

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

		const sender =
			req.user.id === seek.author.id ? 'his/her' : `${seek.author.name}'s`;
		await seeker.save();
		const doc = await seek.save();

		await createNotifications(
			`${req.user.name} downvoted ${sender} seek with the title "${seek.title}"`,
			seek.id,
			req.user.id
		);

		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

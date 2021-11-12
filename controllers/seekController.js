const Seek = require('./../models/Seek');
const Comment = require('./../models/Comment');
const Seeker = require('./../models/Seeker');
const Report = require('./../models/Report');
const Promotion = require('./../models/Promotion');
const Notification = require('./../models/Notification');
const { customErrorMessage, errorMessage } = require('./../utils/errormessage');
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
		res.status(400).json({
			status: 'error',
			error: err,
		});
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
			`${req.user.name} updated his/her seek with the title "${doc.title}"`,
			doc.id,
			req.user.id
		);

		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		res.status(400).json({
			status: 'error',
			error: err,
		});
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
		await Notification.deleteMany({ targetDocument: req.params.id });

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

exports.createReport = async (req, res, next, model) => {
	try {
		const { targetDoc, targetSeeker, reason, reporterId } = req.body;
		const doc = await model.findById(targetDoc);
		const reporter = await Report.findOne({ reporters: reporterId });

		if (!reporter) {
			const report = await Report.create({
				reporters: [req.body.reporterId],
				targetSeeker,
				targetDoc: doc,
				reason,
			});

			res.status(200).json({
				status: 'success',
				doc: {
					report,
				},
			});
		} else {
			res.status(400).json({
				status: 'error',
				message: 'you have already reported this document',
			});
		}
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.upvote = async (req, res, next) => {
	try {
		const seek = await Seek.findById(req.params.id);
		const seeker = await Seeker.findById(req.user.id);
		const author = await Seeker.findById(seek.author.id);
		const request = await Promotion.findOne({ targetSeeker: author._id });

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

		author.points++;
		if (author.points < 500) {
			if (author.points >= 150) {
				author.rank = 'shaman';
			} else if (author.points >= 50) {
				author.rank = 'apprentice';
			}
		} else if (!request) await Promotion.create({ targetSeeker: author._id });

		seek.upvotes = seek.incrementUpvotes();
		seeker.likedSeeks = seeker.likedSeeks.concat([req.params.id]);

		const sender =
			req.user.id === seek.author.id ? 'his/her' : `${seek.author.name}'s`;

		await author.save();
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
		const author = await Seeker.findById(seek.author._id);

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

		author.points--;
		if (author.rank === 'apprentice' && author.points < 50 - 10) {
			author.rank = 'user';
		} else if (author.rank === 'shaman' && author.points < 150 - 10) {
			author.rank = 'apprentice';
		} else if (author.rank === 'expert' && author.points < 500 - 10) {
			author.rank = 'shaman';
		}

		seek.downvotes = seek.incrementDownvotes();
		seeker.dislikedSeeks = seeker.dislikedSeeks.concat([req.params.id]);

		const sender =
			req.user.id === seek.author.id ? 'his/her' : `${seek.author.name}'s`;

		await author.save();
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

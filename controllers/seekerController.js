const Seeker = require('./../models/Seeker');
const { errorMessage, customErrorMessage } = require('./../utils/errormessage');

exports.getMe = async (req, res, next) => {
	try {
		const doc = req.user;
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

exports.getSeekers = async (req, res, next) => {
	try {
		const doc = await Seeker.find();
		res.status(200).json({
			status: 'success',
			length: doc.length,
			results: doc,
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

exports.updateMe = async (req, res, next) => {
	try {
		const userId = req.user._id;

		const doc = await Seeker.findByIdAndUpdate(userId, req.body, {
			new: true,
			runValidators: true,
		});

		if (!doc)
			return customErrorMessage('there is no user with the given Id', 404, res);

		res.status(203).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 400, res);
	}
};

exports.deleteMe = async (req, res, next) => {
	try {
		const doc = await Seeker.findByIdAndUpdate(req.user._id, { active: false });

		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

exports.getSeeker = async (req, res, next) => {
	try {
		const doc = await Seeker.findById(req.params.id);
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

const Seeker = require('./../models/Seeker');

exports.getSeeker = async (req, res, next) => {
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

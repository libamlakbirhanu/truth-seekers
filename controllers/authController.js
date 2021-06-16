const Seeker = require('./../models/Seeker');

exports.signup = async (req, res, next) => {
	try {
		const doc = await Seeker.create(req.body);
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

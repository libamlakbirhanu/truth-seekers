const Seek = require('./../models/Seek');

exports.getSeeks = async (req, res, next) => {
	try {
		const docs = await Seek.find();

		res.status(200).json({
			status: 'success',
			result: docs.length,
			data: { docs },
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

exports.createSeek = async (req, res, next) => {
	try {
		const doc = await Seek.create(req.body);
		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return res.status(500).json({ err: err.message });
	}
};

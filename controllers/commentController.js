const Comment = require('./../models/Comment');

exports.createComment = async (req, res, next) => {
	try {
		const doc = await Comment.create(req.body);
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

exports.getComment = async (req, res, next) => {
	try {
		const doc = await Comment.findById(req.params.id);
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

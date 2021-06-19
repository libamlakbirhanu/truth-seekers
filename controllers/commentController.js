const Comment = require('./../models/Comment');
const { errorMessage } = require('./../utils/ErrorMessage');

exports.createComment = async (req, res, next) => {
	try {
		const body = req.body;
		body.author = req.user._id;

		const doc = await Comment.create(body);

		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		errorMessage(err, 400, res);
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

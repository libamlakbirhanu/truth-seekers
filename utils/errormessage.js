exports.errorMessage = (err, statusCode, res) => {
	const message = err.message.split(':')[2].trim();

	return res.status(statusCode).json({
		status: 'error',
		message,
	});
};

exports.customErrorMessage = (err, statusCode, res) => {
	return res.status(statusCode).json({
		status: 'error',
		message: err,
	});
};

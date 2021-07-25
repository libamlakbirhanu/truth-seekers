exports.errorMessage = (err, statusCode, res) => {
	let message = err.message
		? err.message.split(':')[2].trim()
		: 'something went wrong';

	if (message.indexOf(',') !== -1) message = message.split(',')[0].trim();

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

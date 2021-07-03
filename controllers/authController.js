const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Seeker = require('./../models/Seeker');
const { errorMessage, customErrorMessage } = require('../utils/errormessage');

const isEmpty = (value) => {
	if (typeof value === 'undefined' || value.trim() === '') return true;
	return false;
};

const createToken = (id) => {
	const payload = {
		user: { id },
	};
	return jwt.sign(payload, process.env.jwtsecret, {
		expiresIn: 90 * 24 * 60 * 60,
	});
};

const sendToken = (user, statusCode, req, res) => {
	const token = createToken(user.id);
	const cookieOptions = {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		// secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
	};

	res.cookie('authToken', token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: user,
	});
};

exports.signup = async (req, res, next) => {
	try {
		const newUser = await Seeker.create(req.body);
		sendToken(newUser, 201, req, res);
	} catch (err) {
		return errorMessage(err, 400, res);
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await Seeker.findOne({ email }).select('+password');

	if (isEmpty(email) || isEmpty(password))
		return customErrorMessage('fields can not be empty', 400, res);

	if (!user || !(await bcrypt.compare(password, user.password)))
		return customErrorMessage('incorrect credentials', 400, res);

	sendToken(user, 200, req, res);
};

exports.logout = (req, res, next) => {
	const cookieOptions = {
		expires: new Date(Date.now()),
		httpOnly: true,
	};

	res.cookie('authToken', '', cookieOptions);

	res.status(200).json({ status: 'success' });
};

exports.forgotPassword = async (req, res, next) => {
	const { email } = req.body;
	const seeker = await Seeker.findOne({ email });

	if (!seeker) return customErrorMessage('Seeker not found', 404, res);

	const resetToken = seeker.createPasswordResetToken();
	await seeker.save({ validateBeforeSave: false });

	res.status(200).json({
		status: 'success',
		data: { resetToken },
		message: 'token sent successfully',
	});
};

exports.resetPassword = async (req, res, next) => {
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');
	const seeker = await Seeker.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!seeker)
		return customErrorMessage(
			'Seeker not found or the reset token has expired. please try forgetting your password again',
			404,
			res
		);

	try {
		seeker.password = req.body.password;
		seeker.confirmPassword = req.body.confirmPassword;
		seeker.passwordResetToken = undefined;
		seeker.passwordResetExpires = undefined;
		await seeker.save();
	} catch (err) {
		return errorMessage(err, 300, res);
	}

	sendToken(seeker, 200, req, res);
};

exports.updatePassword = async (req, res, next) => {
	const seeker = await Seeker.findById(req.user.id).select('+password');
	const { oldPassword, newPassword, confirmPassword } = req.body;

	if (!(await bcrypt.compare(oldPassword, seeker.password)))
		return customErrorMessage('incorrect credentials', 401, res);

	seeker.password = newPassword;
	seeker.confirmPassword = confirmPassword;
	await seeker.save();

	sendToken(seeker, 200, req, res);
};

exports.protect = async (req, res, next) => {
	try {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer ')
		)
			token = req.headers.authorization.split(' ')[1];
		else if (req.cookies.authToken) token = req.cookies.authToken;

		if (!token)
			return customErrorMessage(
				'You are not logged in. Please log in to get access.',
				300,
				res
			);

		const decoded = jwt.verify(token, process.env.JWTSECRET);
		const currentUser = await Seeker.findById(decoded.user.id);

		if (!currentUser)
			return customErrorMessage('Seeker does not exist anymore.', 401, res);

		req.user = currentUser;
		// res.locals.user = currentUser;

		next();
	} catch (err) {
		return customErrorMessage(err.message, 500, res);
	}
};

exports.isLoggedIn = async (req, res, next) => {
	try {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer ')
		)
			token = req.headers.authorization.split(' ')[1];
		else if (req.cookies.authToken) token = req.cookies.authToken;

		if (!token) return;

		const decoded = jwt.verify(token, process.env.JWTSECRET);
		const currentUser = await Seeker.findById(decoded.user.id);

		if (currentUser && token)
			return res.status(200).json({
				status: 'success',
				user: currentUser,
			});
	} catch (err) {
		return customErrorMessage(err.message, 500, res);
	}
};

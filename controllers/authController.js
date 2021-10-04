const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

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
		expiresIn: 1 * 24 * 60 * 60,
	});
};

const sendToken = (user, statusCode, req, res) => {
	const token = createToken(user.id);
	const cookieOptions = {
		expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
		httpOnly: true,
		secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
	};

	res.cookie('authToken', token, cookieOptions);

	user.password = undefined;

	res.status(statusCode).json({
		status: 'success',
		token,
		data: user,
	});
};

const sendMail = async (email, subject, message, emailHtml, res, cb) => {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASSWORD,
		},
	});

	let mailOptions = {
		from: 'realweirdo904@gmail.com',
		to: email,
		subject: subject,
		text: message,
		html: emailHtml,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return customErrorMessage(
				'something went wrong. please try again',
				500,
				res
			);
		} else {
			cb();
			return res
				.status(200)
				.json({ status: 'success', message: 'Email sent successfully' });
		}
	});
};

const structureAndSendEmail = (token, email, file, subject, res, cb) => {
	const ogEmailText = fs
		.readFileSync(path.join(__dirname, 'emailTemplate', file))
		.toString();
	const emailText = ogEmailText.replace('resetToken', token);
	fs.writeFile(
		path.join(__dirname, 'emailTemplate', file),
		emailText,
		(err) => {
			if (err)
				return customErrorMessage(
					'Something went wrong please try again',
					500,
					res
				);
			const emailHtml = fs.readFileSync(
				path.join(__dirname, 'emailTemplate', file)
			);
			fs.writeFile(
				path.join(__dirname, 'emailTemplate', file),
				ogEmailText,
				(err) => {
					if (err)
						return customErrorMessage(
							'Something went wrong please try again',
							500,
							res
						);
				}
			);
			return sendMail(email, subject, emailText, emailHtml, res, cb);
		}
	);
};

const verifyUser = async (req, res, next) => {
	try {
		const decoded = jwt.verify(req.params.token, process.env.jwtsecret);
		const newUser = await Seeker.findOneAndUpdate(
			{ email: decoded.user.id },
			{
				verified: true,
				newUserToken: undefined,
			}
		);

		if (newUser) return sendToken(newUser, 201, req, res);
		return customErrorMessage('something went wong please try again', 500, res);
	} catch (err) {
		return customErrorMessage('invalid key', 400, res);
	}
};

const signup = async (req, res, next) => {
	try {
		const newUser = new Seeker({
			...req.body,
		});
		const token = createToken(newUser.email);
		newUser.newUserToken = token;

		const user = await Seeker.findOne({ email: req.body.email });

		if (user) return customErrorMessage('Email already exists', 400, res);
		else if (req.body.password !== req.body.confirmPassword)
			return customErrorMessage("passwords don't match", 400, res);
		else {
			structureAndSendEmail(
				token,
				newUser.email,
				'verify.html',
				'Email verification',
				res,
				async () => {
					await newUser.save();
				}
			);
		}
	} catch (err) {
		return errorMessage(err, 400, res);
	}
};

const login = async (req, res, model, verify) => {
	const { email, password } = req.body;
	const user = await model.findOne({ email }).select('+password');

	if (isEmpty(email) || isEmpty(password))
		return customErrorMessage('fields can not be empty', 400, res);

	if (!user || !(await bcrypt.compare(password, user.password)))
		return customErrorMessage('incorrect credentials', 400, res);

	if (verify && !user.verified)
		return customErrorMessage('account needs to be verified first', 400, res);

	sendToken(user, 200, req, res);
};

const logout = (req, res, next) => {
	const cookieOptions = {
		expires: new Date(Date.now()),
		httpOnly: true,
	};

	res.cookie('authToken', '', cookieOptions);

	res.status(200).json({ status: 'success' });
};

const forgotPassword = async (req, res, next, model) => {
	const { email } = req.body;
	const user = await model.findOne({ email });

	if (!user) return customErrorMessage('Email does not exist', 404, res);

	const resetToken = user.createPasswordResetToken();

	structureAndSendEmail(
		resetToken,
		email,
		'email.html',
		'Password reset confirmation',
		res,
		async () => {
			await user.save({ validateBeforeSave: false });
		}
	);
};

const resetPassword = async (req, res, next, model) => {
	const hashedToken = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');
	const user = await model.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user)
		return customErrorMessage(
			'user not found or the reset token has expired. please try forgetting your password again',
			404,
			res
		);

	try {
		user.password = req.body.password;
		user.confirmPassword = req.body.confirmPassword;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
	} catch (err) {
		return errorMessage(err, 300, res);
	}

	sendToken(user, 200, req, res);
};

const updatePassword = async (req, res, next, model, admin) => {
	try {
		const user = await model.findById(req.user.id).select('+password');
		const { oldPassword, newPassword, confirmPassword } = req.body;

		if (!oldPassword || oldPassword.trim() === '')
			return customErrorMessage(
				'You have to provide your current password to proceed with the current operation',
				401,
				res
			);

		if (!(await bcrypt.compare(oldPassword, user.password)))
			return customErrorMessage('incorrect credentials', 401, res);

		user.password = newPassword;
		user.confirmPassword = confirmPassword;
		if (admin) user.potentialEmail = undefined;
		await user.save();

		sendToken(user, 200, req, res);
	} catch (err) {
		return errorMessage(err, 400, res);
	}
};

const protect = async (req, res, next, model) => {
	try {
		let token;

		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer ')
		)
			token = req.headers.authorization.split(' ')[1];
		else if (req.cookies.authToken) token = req.cookies.authToken;

		if (!token) return;

		const decoded = jwt.verify(token, process.env.jwtsecret);
		const currentUser = await model.findById(decoded.user.id);

		if (!currentUser)
			return customErrorMessage('User does not exist anymore.', 401, res);
		req.user = currentUser;

		next();
	} catch (err) {
		return customErrorMessage(err.message, 500, res);
	}
};

const isLoggedIn = async (req, res, next, model) => {
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
				'You need to login in order to proceed with the current operation',
				403,
				res
			);

		const decoded = jwt.verify(token, process.env.jwtsecret);
		const currentUser = await model.findById(decoded.user.id);

		if (!currentUser) {
			return customErrorMessage('user does not exist', 404, res);
		}

		if (currentUser && token)
			return res.status(200).json({
				status: 'success',
				user: currentUser,
			});
		else next();
	} catch (err) {
		return customErrorMessage(err.message, 500, res);
	}
};

module.exports = {
	isEmpty,
	createToken,
	sendToken,
	structureAndSendEmail,
	verifyUser,
	signup,
	login,
	logout,
	forgotPassword,
	resetPassword,
	updatePassword,
	protect,
	isLoggedIn,
};

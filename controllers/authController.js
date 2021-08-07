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
		expiresIn: 90 * 24 * 60 * 60,
	});
};

const sendToken = (user, statusCode, req, res) => {
	const token = createToken(user.id);
	const cookieOptions = {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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

const sendMail = (email, subject, message, emailHtml, res) => {
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
			return res
				.status(200)
				.json({ status: 'success', message: 'Email sent successfully' });
		}
	});
};

const structureAndSendEmail = (token, email, file, subject, res) => {
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

			return sendMail(email, subject, emailText, emailHtml, res);
		}
	);
};

exports.verifyUser = async (req, res) => {
	try {
		const decoded = jwt.verify(req.params.token, process.env.jwtsecret);
		const newUser = await Seeker.findByIdAndUpdate(decoded.user.id, {
			verified: true,
			newUserToken: undefined,
		});

		if (newUser) return sendToken(newUser, 201, req, res);
		return customErrorMessage('something went wong please try again', 500, res);
	} catch (err) {
		return customErrorMessage('invalid key', 400, res);
	}
};

exports.signup = async (req, res, next) => {
	try {
		const newUser = new Seeker({
			...req.body,
		});
		const token = createToken(newUser._id);
		newUser.newUserToken = token;

		await newUser.save();

		structureAndSendEmail(
			token,
			newUser.email,
			'verify.html',
			'Email verification',
			res
		);
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

	if (!user.verified)
		return customErrorMessage('account needs to be verified first', 400, res);

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

	if (!seeker) return customErrorMessage('Email does not exist', 404, res);

	const resetToken = seeker.createPasswordResetToken();
	await seeker.save({ validateBeforeSave: false });

	structureAndSendEmail(
		resetToken,
		email,
		'email.html',
		'Password reset confirmation',
		res
	);
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
	try {
		const seeker = await Seeker.findById(req.user.id).select('+password');
		const { oldPassword, newPassword, confirmPassword } = req.body;

		if (!(await bcrypt.compare(oldPassword, seeker.password)))
			return customErrorMessage('incorrect credentials', 401, res);

		seeker.password = newPassword;
		seeker.confirmPassword = confirmPassword;
		await seeker.save();

		sendToken(seeker, 200, req, res);
	} catch (err) {
		return errorMessage(err, 400, res);
	}
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

		if (!token) return;

		const decoded = jwt.verify(token, process.env.jwtsecret);
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

		const decoded = jwt.verify(token, process.env.jwtsecret);
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

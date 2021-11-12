const jwt = require('jsonwebtoken');
const Admin = require('./../models/Admin');
const Seeker = require('./../models/Seeker');
const Report = require('./../models/Report');
const Promotion = require('./../models/Promotion');
const {
	isEmpty,
	structureAndSendEmail,
	createToken,
} = require('./authController');
const { errorMessage, customErrorMessage } = require('../utils/errormessage');

exports.changeEmail = async (req, res, next) => {
	if (!req.body || isEmpty(req.body.email))
		return customErrorMessage('Email can not be empty', 403, res);

	try {
		const user = await Admin.findOne({
			email: req.body.email,
		});
		const seeker = await Seeker.findOne({
			email: req.body.email,
		});

		if (user || seeker)
			return customErrorMessage('Email already exists', 400, res);
		else {
			const token = createToken(req.body.email);

			structureAndSendEmail(
				token,
				req.body.email,
				'verify.html',
				'Email verification',
				res,
				async () => {
					await Admin.findOneAndUpdate(
						{ email: req.user.email },
						{ potentialEmail: req.body.email }
					);
				},
				true
			);
		}
	} catch (err) {
		return errorMessage(err, 400, res);
	}
};

exports.verifyUser = async (req, res, next) => {
	try {
		const decoded = jwt.verify(req.params.token, process.env.jwtsecret);
		const newUser = await Admin.findOneAndUpdate(
			{ potentialEmail: decoded.user.id },
			{
				email: decoded.user.id,
				verified: true,
				potentialEmail: undefined,
			},
			{
				new: true,
			}
		);

		if (newUser) return sendToken(newUser, 201, req, res);
		return customErrorMessage('something went wong please try again', 500, res);
	} catch (err) {
		return customErrorMessage('invalid key', 400, res);
	}
};

exports.reports = async (req, res, next) => {
	try {
		if (!req.user) return;

		const docs = await Report.find();

		return res.status(200).json({
			status: 'success',
			length: docs.length,
			data: { docs },
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.getPromotions = async (req, res, next) => {
	try {
		if (!req.user) return;

		const docs = await Promotion.find();

		return res.status(200).json({
			status: 'success',
			length: docs.length,
			data: { docs },
		});
	} catch (err) {
		console.log(err);
		return errorMessage(err, 500, res);
	}
};

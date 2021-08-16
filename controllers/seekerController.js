const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const Seeker = require('./../models/Seeker');
const Notification = require('./../models/Notification');
const { errorMessage, customErrorMessage } = require('./../utils/errormessage');

const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};

// const multerStorage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, 'assets/image/seekers');
// 	},
// 	filename: (req, file, cb) => {
// 		cb(
// 			null,
// 			`${file.fieldname}-${req.user.id}-${Date.now()}.${
// 				file.mimetype.split('/')[1]
// 			}`
// 		);
// 	},
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.split('/')[0] === 'image') cb(null, true);
	else cb(new Error('the file you uploaded is not an image'), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = (req, res, next) => {
	if (!req.file) return next();

	req.file.filename = `${req.file.fieldname}-${req.user.id}-${Date.now()}.jpeg`;

	sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(`client/build/static/assets/image/seekers/${req.file.filename}`)
		.then(() => next())
		.catch((err) => console.error(err));
};

exports.getMe = async (req, res, next) => {
	try {
		const doc = req.user;
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

exports.getSeekers = async (req, res, next) => {
	try {
		const doc = await Seeker.find();
		res.status(200).json({
			status: 'success',
			length: doc.length,
			results: doc,
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

exports.updateMe = async (req, res, next) => {
	try {
		const userId = req.user._id;
		const filteredBody = filterObj(req.body, 'name', 'email');

		if (req.file) filteredBody.photo = req.file.filename;

		if (
			req.user.photo !== 'default.jpg' &&
			fs.existsSync(
				`client/build/static/assets/image/seekers/${req.user.photo}`
			) &&
			req.file
		)
			fs.unlink(
				`client/build/static/assets/image/seekers/${req.user.photo}`,
				(err) => {
					if (err) console.error(err);
				}
			);

		const doc = await Seeker.findByIdAndUpdate(userId, filteredBody, {
			new: true,
			runValidators: true,
		});

		if (!doc)
			return customErrorMessage('there is no user with the given Id', 404, res);

		res.status(200).json({
			status: 'success',
			result: doc,
		});
	} catch (err) {
		return errorMessage(err, 400, res);
	}
};

exports.deleteMe = async (req, res, next) => {
	try {
		const doc = await Seeker.findByIdAndDelete(req.user._id);
    const cookieOptions = {
      expires: new Date(Date.now()),
      httpOnly: true,
    };

    res.cookie('authToken', '', cookieOptions);

		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

exports.getSeeker = async (req, res, next) => {
	try {
		const doc = await Seeker.findById(req.params.id);

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

exports.notifications = async (req, res, next) => {
	try {
		if (!req.user) return;
		const docs = await Notification.find({
			sender: { $ne: req.user.id },
			createdAt: { $gte: req.user.date },
		});

		docs.map((doc) => {
			doc.message = doc.message.replace(`${req.user.name}'s`, 'your');
		});

		return res.status(200).json({
			status: 'success',
			length: docs.length,
			data: { notifications: docs },
		});
	} catch (err) {
		return errorMessage(err, 500, res);
	}
};

exports.markNotificationsRead = async (req, res, next) => {
	const docs = await Notification.updateMany(
		{ sender: { $ne: req.user.id } },
		{ $addToSet: { readBy: [req.user._id] } }
	);
};

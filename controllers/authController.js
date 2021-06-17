const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Seeker = require('./../models/Seeker');

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
		data:
			statusCode === 201
				? {
						user,
				  }
				: null,
	});
};

exports.signup = async (req, res, next) => {
	try {
		const newUser = await Seeker.create(req.body);
		sendToken(newUser, 201, req, res);
	} catch (err) {
		return res.status(500).json({
			err: err.message,
		});
	}
};

exports.login = async (req, res, next) => {
	const { email, password } = req.body;
	const user = await Seeker.findOne({ email }).select('+password');

	if (!user || !(await bcrypt.compare(password, user.password)))
		return res.status(401).json({
			status: 'error',
			message: 'incorrect credentials',
		});
};

exports.logout = (req, res, next) => {
	const cookieOptions = {
		expires: new Date(Date.now()),
		httpOnly: true,
	};

	res.cookie('authToken', '', cookieOptions);

	res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	)
		token = req.headers.authorization.split(' ')[1];
	else if (req.cookies.authToken) token = req.cookies.authToken;

	if (!token)
		res.status(300).json({
			status: 'Error',
			message: 'You are not logged in. Please log in to get access.',
		});

	const decoded = jwt.verify(token, process.env.JWTSECRET);
	const currentUser = await Seeker.findById(decoded.user.id);

	if (!currentUser)
		res.status(401).json({
			status: 'Error',
			message: 'Seeker does not exist anymore.',
		});

	req.user = currentUser;
	// res.locals.user = currentUser;

	next();
};

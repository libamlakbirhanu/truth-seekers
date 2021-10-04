const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const AdminSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'user name can not be empty'],
		default: 'admin',
	},
	email: {
		type: String,
		required: [true, 'email is required'],
		unique: [true, 'email is already taken'],
		lowercase: true,
		validate: [validator.isEmail, 'email is not valid'],
		default: 'admin@gmail.com',
	},
	potentialEmail: {
		type: String,
		required: false,
		lowercase: true,
		validate: [validator.isEmail, 'email is not valid'],
	},
	rank: {
		type: String,
		default: 'admin',
	},
	password: {
		type: String,
		required: [true, 'password is required'],
		minlength: [8, 'password has to be atleast 8 characters long'],
		select: false,
	},
	confirmPassword: {
		type: String,
		required: [true, 'please confirm your password'],
		validate: {
			validator: function (el) {
				return el === this.password;
			},
			message: "passwords don't match",
		},
		select: false,
	},
	photo: { type: String, default: 'default.jpg' },
	date: {
		type: Date,
		default: Date.now,
	},
	passwordResetToken: String,
	passwordResetExpires: Date,
	adminToken: {
		type: String,
	},
	verified: {
		type: Boolean,
		default: false,
	},
	defaultCredentials: {
		type: Boolean,
		default: true,
	},
});

AdminSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);

	this.confirmPassword = undefined;
	next();
});

AdminSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = Admin = mongoose.model('admin', AdminSchema);

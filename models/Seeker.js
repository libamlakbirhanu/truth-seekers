const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const SeekerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'name is required'],
	},
	email: {
		type: String,
		required: [true, 'email is required'],
		unique: [true, 'email is already taken'],
		lowercase: true,
		validate: [validator.isEmail, 'email is not valid'],
	},
	password: {
		type: String,
		required: [true, 'password is required'],
		minlength: 8,
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
	date: {
		type: Date,
		default: Date.now,
	},
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
});

SeekerSchema.pre(/^find/, async function (next) {
	this.find({ active: { $ne: false } });

	next();
});

SeekerSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	const salt = await bcrypt.genSalt(12);
	this.password = await bcrypt.hash(this.password, salt);

	this.confirmPassword = undefined;
	next();
});

module.exports = Seeker = mongoose.model('seeker', SeekerSchema);

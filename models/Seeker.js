const mongoose = require('mongoose');
const validator = require('validator');

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
});

module.exports = Seeker = mongoose.model('seeker', SeekerSchema);

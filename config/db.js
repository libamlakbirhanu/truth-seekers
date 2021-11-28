const mongoose = require('mongoose');

module.exports = connectDB = async () => {
	try {
		await mongoose.connect(
			process.env.mongoURI,
			{
				useCreateIndex: true,
				useUnifiedTopology: true,
				useNewUrlParser: true,
				useFindAndModify: false,
			},
			() => {
				console.log('mongodb connected successfully');
			}
		);
	} catch (err) {
		console.error(err);
	}
};

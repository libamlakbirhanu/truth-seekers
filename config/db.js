const mongoose = require('mongoose');

module.exports = connectDB = async () => {
	try {
		await mongoose.connect(
			process.env.mongoURI_local,
			{
				useCreateIndex: true,
				useUnifiedTopology: true,
				useNewUrlParser: true,
			},
			() => {
				console.log('mongodb connected successfully');
			}
		);
	} catch (err) {
		console.error(err);
	}
};

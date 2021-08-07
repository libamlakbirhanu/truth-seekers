const dotenv = require('dotenv');

const app = require('./app');
const connectDB = require('./config/db');

process.on('uncaughtException', (err) => {
	console.log({ errorName: err.name, error: err.message });
	console.log('uncaught Exception... shutting down');

	process.exit(1);
});

dotenv.config({ path: './config/Config.env' });

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, (err) => {
	if (err) return console.error('something went wrong');
	console.log(`server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
	console.log({ errorName: err.name, error: err.message });
	console.log('Unhandled Rejection... shutting down');

	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	console.log('👋 SIGTERM recieved... shutting down');
	server.close(() => {
		console.log('process terminated 😴');
	});
});

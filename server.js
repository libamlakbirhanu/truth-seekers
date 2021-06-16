const dotenv = require('dotenv');

const app = require('./app');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, (err) => {
	if (err) return console.error('something went wrong');
	console.log(`server running on port ${PORT}`);
});

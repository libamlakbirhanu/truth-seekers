const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.enable('trust proxy');

app.use('/static', express.static('assets'));
app.use(express.json({ extended: false, limit: '10kb' }));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	res.header('Access-control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

	next();
});
app.use(cookieParser());

// ROUTES
app.use('/api/seeks', require('./routes/api/seeks'));
app.use('/api/seekers', require('./routes/api/seekers'));
app.use('/api/comments', require('./routes/api/comments'));

module.exports = app;

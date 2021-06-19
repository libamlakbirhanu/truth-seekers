const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ extended: false, limit: '10kb' }));

app.use(cookieParser());

// ROUTES
app.use('/api/seeks', require('./routes/api/seeks'));
app.use('/api/seekers', require('./routes/api/seekers'));
app.use('/api/comments', require('./routes/api/comments'));

module.exports = app;

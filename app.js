const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ extended: false, limit: '10kb' }));

// ROUTES
app.use('/seeks', require('./routes/api/seeks'));
app.use('/seekers', require('./routes/api/seekers'));
app.use('/comments', require('./routes/api/comments'));

module.exports = app;

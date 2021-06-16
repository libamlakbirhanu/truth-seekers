const app = require('express')();

// ROUTES
app.get('/', (req, res) => {
	res.send('<h1>Name is libamlak</h1>');
});

module.exports = app;

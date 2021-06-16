const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('Hello from seeks');
});

module.exports = router;

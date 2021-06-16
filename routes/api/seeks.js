const router = require('express').Router();
const seekController = require('./../../controllers/seekController');

router.route('/').get(seekController.getSeeks).post(seekController.createSeek);

module.exports = router;

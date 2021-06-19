const router = require('express').Router();
const seekController = require('./../../controllers/seekController');

router.route('/').get(seekController.getSeeks).post(seekController.createSeek);
// TODO: update a seek
// TODO: upvote a seek
// TODO: downvote a seek
// TODO: delete a seek

module.exports = router;

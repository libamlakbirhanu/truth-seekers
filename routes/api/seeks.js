const router = require('express').Router();
const seekController = require('./../../controllers/seekController');
const authController = require('./../../controllers/authController');

router
	.route('/')
	.get(seekController.getSeeks)
	.post(authController.protect, seekController.createSeek);
router.patch('/:id/upvote', authController.protect, seekController.upvote);
router.patch('/:id/downvote', authController.protect, seekController.downvote);
router
	.route('/:id')
	.patch(authController.protect, seekController.updateSeek)
	.delete(authController.protect, seekController.deleteSeek)
	.get(seekController.getSeek);

module.exports = router;

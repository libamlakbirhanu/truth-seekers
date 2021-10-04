const Seeker = require('../../models/Seeker');
const router = require('express').Router();
const seekController = require('./../../controllers/seekController');
const authController = require('./../../controllers/authController');

router
	.route('/')
	.get(seekController.getSeeks)
	.post(
		(req, res, next) => authController.protect(req, res, next, Seeker),
		seekController.createSeek
	);
router.patch(
	'/:id/upvote',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekController.upvote
);
router.patch(
	'/:id/downvote',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekController.downvote
);
router
	.route('/:id')
	.patch(
		(req, res, next) => authController.protect(req, res, next, Seeker),
		seekController.updateSeek
	)
	.delete(
		(req, res, next) => authController.protect(req, res, next, Seeker),
		seekController.deleteSeek
	)
	.get(seekController.getSeek);

module.exports = router;

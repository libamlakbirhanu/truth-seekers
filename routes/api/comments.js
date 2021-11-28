const router = require('express').Router();
const Seeker = require('../../models/Seeker');
const Comment = require('../../models/Comment');
const commentController = require('./../../controllers/commentController');
const seekController = require('./../../controllers/seekController');
const authController = require('./../../controllers/authController');

router.post(
	'/',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	commentController.createComment
);
router.get('/seek/:id', commentController.getComments);
router.patch(
	'/:id/upvote',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	commentController.upvote
);
router.patch(
	'/:id/downvote',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	commentController.downvote
);
router.get('/:id', commentController.getComment);
router.patch(
	'/:id',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	commentController.updateComment
);
router.delete(
	'/:id',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	commentController.deleteComment
);

router.post(
	'/create-report',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	(req, res, next) => seekController.createReport(req, res, next, Comment)
);

module.exports = router;

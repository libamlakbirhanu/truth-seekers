const router = require('express').Router();
const commentController = require('./../../controllers/commentController');
const authController = require('./../../controllers/authController');

router.post('/', authController.protect, commentController.createComment);
router.get('/seek/:id', commentController.getComments);
// router.patch('/:id/upvote', authController.protect, commentController.upvote);
// router.patch(
// 	'/:id/downvote',
// 	authController.protect,
// 	commentController.downvote
// );
router.get('/:id', commentController.getComment);
router.patch('/:id', authController.protect, commentController.updateComment);
router.delete('/:id', authController.protect, commentController.deleteComment);

module.exports = router;

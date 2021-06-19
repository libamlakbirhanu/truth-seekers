const router = require('express').Router();
const commentController = require('./../../controllers/commentController');
const authController = require('./../../controllers/authController');

router.post('/', authController.protect, commentController.createComment);
router.get('/:id', commentController.getComment);

module.exports = router;

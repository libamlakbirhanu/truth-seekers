const router = require('express').Router();
const commentController = require('./../../controllers/commentController');
const authController = require('./../../controllers/authController');

router.get('/:id', commentController.getComment);
router.post('/', authController.protect, commentController.createComment);

module.exports = router;

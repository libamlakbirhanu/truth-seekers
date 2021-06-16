const router = require('express').Router();
const commentController = require('./../../controllers/commentController');

router.get('/:id', commentController.getComment);
router.post('/', commentController.createComment);

module.exports = router;

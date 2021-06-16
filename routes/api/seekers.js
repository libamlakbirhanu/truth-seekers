const router = require('express').Router();
const seekerController = require('./../../controllers/seekerController');

router.post('/', seekerController.createSeeker);
router.get('/:id', seekerController.getSeeker);

module.exports = router;

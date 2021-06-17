const router = require('express').Router();
const seekerController = require('./../../controllers/seekerController');
const authController = require('./../../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/_me', authController.protect, seekerController.getMe);
router.get('/:id', seekerController.getSeeker);
router.patch(
	'/update-password',
	authController.protect,
	authController.updatePassword
);

module.exports = router;

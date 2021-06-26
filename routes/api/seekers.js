const router = require('express').Router();
const seekerController = require('./../../controllers/seekerController');
const authController = require('./../../controllers/authController');

router.get('/authcheck', authController.isLoggedIn);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
	'/update-password',
	authController.protect,
	authController.updatePassword
);

router.patch(
	'/',
	authController.protect,
	seekerController.uploadPhoto,
	seekerController.resizePhoto,
	seekerController.updateMe
);
router.delete('/', authController.protect, seekerController.deleteMe);
router.get('/', authController.protect, seekerController.getSeekers);
router.get('/_me', authController.protect, seekerController.getMe);
router.get(
	'/notifications',
	authController.protect,
	seekerController.notifications
);
router.get('/:id', authController.protect, seekerController.getSeeker);

module.exports = router;

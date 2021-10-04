const router = require('express').Router();
const Seeker = require('../../models/Seeker');
const seekerController = require('./../../controllers/seekerController');
const authController = require('./../../controllers/authController');

router.get('/authcheck', (req, res, next) =>
	authController.isLoggedIn(req, res, next, Seeker)
);
router.post('/verify/:token', authController.verifyUser);
router.post('/signup', authController.signup);
router.post('/login', (req, res) =>
	authController.login(req, res, Seeker, true)
);
router.get('/logout', authController.logout);
router.post('/forgot-password', (req, res, next) =>
	authController.forgotPassword(req, res, next, Seeker)
);
router.patch('/reset-password/:token', (req, res, next) =>
	authController.resetPassword(req, res, next, Seeker)
);
router.patch(
	'/update-password',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	(req, res, next) => authController.updatePassword(req, res, next, Seeker)
);

router.patch(
	'/',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekerController.uploadPhoto,
	seekerController.resizePhoto,
	seekerController.updateMe
);
router.delete(
	'/',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekerController.deleteMe
);
router.get(
	'/',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekerController.getSeekers
);
router.get(
	'/_me',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekerController.getMe
);
router.get(
	'/notifications',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekerController.notifications
);
router.post(
	'/notifications',
	(req, res, next) => authController.protect(req, res, next, Seeker),
	seekerController.markNotificationsRead
);
router.get('/:id', seekerController.getSeeker);

module.exports = router;

const router = require('express').Router();
const Admin = require('../../models/Admin');
const authController = require('./../../controllers/authController');
const adminController = require('./../../controllers/adminController');

router.get('/authcheck', (req, res, next) =>
	authController.isLoggedIn(req, res, next, Admin)
);

router.post(
	'/verify/:token',
	(req, res, next) => authController.protect(req, res, next, Admin),
	adminController.verifyUser
);
router.patch(
	'/change-email',
	(req, res, next) => authController.protect(req, res, next, Admin),
	adminController.changeEmail
);
router.post('/login', (req, res) =>
	authController.login(req, res, Admin, false)
);
router.get('/logout', authController.logout);
router.post('/forgot-password', (req, res, next) =>
	authController.forgotPassword(req, res, next, Admin)
);
router.patch('/reset-password/:token', (req, res, next) =>
	authController.resetPassword(req, res, next, Admin)
);
router.patch(
	'/update-password',
	(req, res, next) => authController.protect(req, res, next, Admin),
	(req, res, next) => authController.updatePassword(req, res, next, Admin, true)
);

// router.patch(
// 	'/',
// 	adminController.protect,
// 	seekerController.uploadPhoto,
// 	seekerController.resizePhoto,
// 	seekerController.updateMe
// );
// router.delete('/', adminController.protect, seekerController.deleteMe);
// router.get('/', adminController.protect, seekerController.getSeekers);
// router.get('/_me', adminController.protect, seekerController.getMe);
// router.get(
// 	'/notifications',
// 	adminController.protect,
// 	seekerController.notifications
// );
// router.post(
// 	'/notifications',
// 	adminController.protect,
// 	seekerController.markNotificationsRead
// );
// router.get('/:id', seekerController.getSeeker);

module.exports = router;

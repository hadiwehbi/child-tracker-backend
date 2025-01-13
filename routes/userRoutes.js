const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

const User = require('../models/userModel');
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/test', (req, res) => res.send('<h1> Hello from Child Tracker Backend Server</h1>'));

router.post('/getAllDataJson', async (req, res) => {
	try {
		const { username, password } = req.body;
		if (username !== 'datadmin' || password !== 'neo@23@pp') {
			return res.send('Invalid username or password.');
		}
		const users = await User.find({}).populate('children');
		res.json(users);
	} catch (error) {
		console.error('Failed to fetch users:', error);
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});


router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/account', userController.getMe, userController.getUser);
// router.get('/me', userController.getMe, userController.getUser);

router.patch(
	'/update',
	// userController.uploadUserPhoto,
	// userController.resizeUserPhoto,
	userController.update
);

// router.delete('/deleteMe', userController.deleteMe);

// router.use(authController.restrictTo('admin'));

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;

//////////////////// TO BE DELETED ////////////////
// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;

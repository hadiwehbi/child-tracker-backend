const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const childController = require('../controllers/childController');

const router = express.Router();


// Protect all routes after this middleware
router.use(authController.protect);

router.post('/add',childController.addChild);
router.patch('/update',childController.updateChild);
router.get('/get',childController.getChild);
router.delete('/delete',childController.deleteChild);

module.exports = router;

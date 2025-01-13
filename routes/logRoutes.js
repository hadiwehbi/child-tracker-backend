const express = require('express');
const authController = require('../controllers/authController');
const logController = require('../controllers/logController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post('/add', logController.addLog);
router.get('/getAllLogs', logController.getAllLogsForUsers);

module.exports = router;

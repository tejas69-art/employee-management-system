const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/requestOTP', authController.requestOTP);
router.post('/verifyOTP', authController.verifyOTP);

module.exports = router;

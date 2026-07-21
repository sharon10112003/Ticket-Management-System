const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/seed-admin', authController.seedSuperAdmin);

module.exports = router;

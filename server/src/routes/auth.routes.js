const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import Middleware
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// --- PERBAIKAN DI SINI ---
// Tambahkan authMiddleware di tengah sebelum authController.getMe
router.get('/me', authMiddleware, authController.getMe); 
// -------------------------

module.exports = router;
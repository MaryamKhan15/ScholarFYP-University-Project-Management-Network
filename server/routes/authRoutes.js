const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getSupervisors, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);
router.get('/supervisors', verifyToken, getSupervisors);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;

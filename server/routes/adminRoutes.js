const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, assignSupervisor } = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/analytics', verifyToken, authorizeRoles('admin'), getAnalytics);
router.get('/users', verifyToken, authorizeRoles('admin'), getAllUsers);
router.put('/projects/:id/assign-supervisor', verifyToken, authorizeRoles('admin'), assignSupervisor);

module.exports = router;

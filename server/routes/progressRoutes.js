const express = require('express');
const router = express.Router();
const {
  submitProgressReport,
  getProjectReports,
  getSupervisorReports,
  reviewProgressReport,
} = require('../controllers/progressController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.post('/', verifyToken, authorizeRoles('student'), submitProgressReport);
router.get('/supervisor', verifyToken, authorizeRoles('supervisor', 'admin'), getSupervisorReports);
router.get('/project/:projectId', verifyToken, getProjectReports);
router.put('/:id/review', verifyToken, authorizeRoles('supervisor', 'admin'), reviewProgressReport);

module.exports = router;

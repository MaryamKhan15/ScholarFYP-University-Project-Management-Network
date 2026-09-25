const express = require('express');
const router = express.Router();
const {
  getMyProject,
  getAllProjects,
  getProjectById,
  updateProject,
  createTask,
  updateTask,
  deleteTask,
  updateMilestone,
  regenerateAiMilestones,
} = require('../controllers/projectController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.get('/my', verifyToken, authorizeRoles('student'), getMyProject);
router.get('/', verifyToken, authorizeRoles('supervisor', 'admin'), getAllProjects);
router.get('/:id', verifyToken, getProjectById);
router.put('/:id', verifyToken, updateProject);

// Task routes
router.post('/tasks', verifyToken, createTask);
router.put('/tasks/:id', verifyToken, updateTask);
router.delete('/tasks/:id', verifyToken, deleteTask);

// Milestone routes
router.put('/milestones/:id', verifyToken, updateMilestone);
router.post('/:projectId/milestones/regenerate', verifyToken, regenerateAiMilestones);

module.exports = router;

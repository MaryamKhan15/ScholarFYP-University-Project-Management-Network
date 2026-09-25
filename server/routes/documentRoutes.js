const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');
const {
  uploadDocument,
  getProjectDocuments,
  deleteDocument,
} = require('../controllers/documentController');

router.post('/upload', verifyToken, upload.single('file'), uploadDocument);
router.get('/project/:projectId', verifyToken, getProjectDocuments);
router.delete('/:id', verifyToken, deleteDocument);

module.exports = router;

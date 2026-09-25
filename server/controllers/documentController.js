const Document = require('../models/Document');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const path = require('path');

// @desc    Upload Project Document
// @route   POST /api/documents/upload
// @access  Private
const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { projectId, documentType } = req.body;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Determine document version count
    const existingCount = await Document.countDocuments({ projectId, documentType });

    const doc = await Document.create({
      projectId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      documentType: documentType || 'Other',
      fileUrl: `/uploads/${req.file.filename}`,
      fileSize: req.file.size,
      version: existingCount + 1,
      uploadedBy: req.user._id,
    });

    // Notify recipient (if student uploaded, notify supervisor; if supervisor uploaded, notify student)
    const recipientId = req.user.role === 'student' ? project.supervisorId : project.studentId;
    await Notification.create({
      userId: recipientId,
      title: 'New Document Uploaded',
      message: `${req.user.name} uploaded ${doc.documentType}: "${doc.originalName}" (v${doc.version}).`,
      type: 'task',
      link: req.user.role === 'student' ? `/supervisor/projects/${project._id}` : '/student/documents',
    });

    res.status(201).json({ success: true, message: 'Document uploaded successfully', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Documents by Project
// @route   GET /api/documents/project/:projectId
// @access  Private
const getProjectDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ projectId: req.params.projectId })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

    await Document.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getProjectDocuments,
  deleteDocument,
};

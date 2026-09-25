const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: String,
    documentType: {
      type: String,
      enum: ['Proposal Document', 'SRS', 'Design Document', 'Progress Report', 'Final Thesis', 'Presentation', 'Code Repository', 'Other'],
      default: 'Other',
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: Number, // in bytes
    version: {
      type: Number,
      default: 1,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supervisorRemarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);

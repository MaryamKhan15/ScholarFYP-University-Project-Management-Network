const mongoose = require('mongoose');

const progressReportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    submissionDate: {
      type: Date,
      default: Date.now,
    },
    completedWork: {
      type: [String],
      required: true,
    },
    currentWork: {
      type: [String],
      required: true,
    },
    problemsFaced: {
      type: String,
      default: 'None',
    },
    nextWeekPlan: {
      type: [String],
      required: true,
    },
    progressPercentEstimate: {
      type: Number,
      default: 0,
    },
    supervisorFeedback: {
      comment: { type: String, default: '' },
      reviewedAt: { type: Date },
      rating: { type: Number, min: 1, max: 5 },
      status: { type: String, enum: ['Pending Review', 'Reviewed', 'Needs Discussion'], default: 'Pending Review' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProgressReport', progressReportSchema);

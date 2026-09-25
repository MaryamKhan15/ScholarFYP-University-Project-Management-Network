const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: String,
    description: String,
    technologies: [String],
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamMembers: [
      {
        name: String,
        rollNo: String,
        email: String,
      },
    ],
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Evaluation Ready', 'Completed', 'On Hold'],
      default: 'In Progress',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currentMilestone: {
      type: String,
      default: 'Milestone 1: Requirements & SRS',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetCompletionDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

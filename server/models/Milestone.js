const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    deliverables: [String],
    order: {
      type: Number,
      default: 1,
    },
    startDate: Date,
    dueDate: Date,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Delayed'],
      default: 'Pending',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Milestone', milestoneSchema);

const mongoose = require('mongoose');

const feedbackItemSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: String,
  role: String,
  message: String,
  statusGiven: String, // Approved, Changes Required, Rejected
  createdAt: { type: Date, default: Date.now },
});

const proposalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String, // AI/ML, Web App, Mobile App, IoT, Cyber Security, etc.
      required: true,
    },
    problemStatement: {
      type: String,
      required: true,
    },
    proposedSolution: {
      type: String,
      required: true,
    },
    objectives: {
      type: [String],
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    teamMembers: [
      {
        name: String,
        rollNo: String,
        email: String,
      },
    ],
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Under Review', 'Changes Required', 'Approved', 'Rejected'],
      default: 'Draft',
    },
    version: {
      type: Number,
      default: 1,
    },
    documentUrl: {
      type: String,
      default: '',
    },
    // AI analysis insights
    aiAnalysis: {
      clarityScore: { type: Number, default: 0 }, // 0 to 100
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      feasibility: String, // High, Medium, Low
      missingElements: [String],
      evaluatedAt: Date,
    },
    // Duplicate / Similarity detection score
    similarityCheck: {
      highestScore: { type: Number, default: 0 }, // % match
      similarityLevel: { type: String, default: 'Low' }, // Low, Medium, High
      matchedProjects: [
        {
          title: String,
          similarityPercentage: Number,
          overlapReason: String,
        },
      ],
      checkedAt: Date,
    },
    feedbackHistory: [feedbackItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proposal', proposalSchema);

const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    supervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // HH:mm
      required: true,
    },
    locationOrLink: {
      type: String,
      default: 'Supervisor Office / Google Meet',
    },
    agenda: String,
    notes: String,
    actionItems: [String],
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled'],
      default: 'Scheduled',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Meeting', meetingSchema);

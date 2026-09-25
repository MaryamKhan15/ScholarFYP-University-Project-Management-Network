const Meeting = require('../models/Meeting');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Schedule a Meeting
// @route   POST /api/meetings
// @access  Private
const createMeeting = async (req, res) => {
  try {
    const { projectId, studentId, supervisorId, title, date, time, locationOrLink, agenda } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const meeting = await Meeting.create({
      projectId,
      studentId: studentId || project.studentId,
      supervisorId: supervisorId || project.supervisorId,
      title,
      date,
      time,
      locationOrLink: locationOrLink || 'Supervisor Office',
      agenda: agenda || '',
      status: 'Scheduled',
    });

    // Notify other party
    const targetUserId = req.user.role === 'student' ? meeting.supervisorId : meeting.studentId;
    await Notification.create({
      userId: targetUserId,
      title: 'New Meeting Scheduled',
      message: `${req.user.name} scheduled a meeting: "${title}" on ${date} at ${time}.`,
      type: 'meeting',
      link: req.user.role === 'student' ? '/supervisor/meetings' : '/student/meetings',
    });

    res.status(201).json({ success: true, message: 'Meeting scheduled successfully', data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Meetings for Current User
// @route   GET /api/meetings
// @access  Private
const getMyMeetings = async (req, res) => {
  try {
    const query = req.user.role === 'supervisor' ? { supervisorId: req.user._id } : { studentId: req.user._id };

    const meetings = await Meeting.find(query)
      .populate('projectId', 'title')
      .populate('studentId', 'name email rollNo')
      .populate('supervisorId', 'name email designation')
      .sort({ date: 1, time: 1 });

    res.json({ success: true, count: meetings.length, data: meetings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Meeting (Notes, Status)
// @route   PUT /api/meetings/:id
// @access  Private
const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' });

    res.json({ success: true, message: 'Meeting updated', data: meeting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createMeeting,
  getMyMeetings,
  updateMeeting,
};

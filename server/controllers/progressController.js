const ProgressReport = require('../models/ProgressReport');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Submit Weekly Progress Report
// @route   POST /api/progress-reports
// @access  Student
const submitProgressReport = async (req, res) => {
  try {
    const { projectId, weekNumber, completedWork, currentWork, problemsFaced, nextPlan, progressPercentEstimate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const report = await ProgressReport.create({
      projectId,
      studentId: req.user._id,
      weekNumber,
      completedWork: Array.isArray(completedWork) ? completedWork : [completedWork],
      currentWork: Array.isArray(currentWork) ? currentWork : [currentWork],
      problemsFaced: problemsFaced || 'None reported.',
      nextPlan: Array.isArray(nextPlan) ? nextPlan : [nextPlan],
      progressPercentEstimate: Number(progressPercentEstimate) || 0,
    });

    // Optionally bump project progress
    if (progressPercentEstimate && Number(progressPercentEstimate) > project.progressPercentage) {
      project.progressPercentage = Number(progressPercentEstimate);
      await project.save();
    }

    // Notify supervisor
    await Notification.create({
      userId: project.supervisorId,
      title: `Week ${weekNumber} Progress Report Submitted`,
      message: `${req.user.name} submitted the progress log for Week ${weekNumber} in "${project.title}".`,
      type: 'feedback',
      link: `/supervisor/projects/${project._id}`,
    });

    res.status(201).json({ success: true, message: 'Weekly progress report submitted successfully', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Reports for a Project
// @route   GET /api/progress-reports/project/:projectId
// @access  Private
const getProjectReports = async (req, res) => {
  try {
    const reports = await ProgressReport.find({ projectId: req.params.projectId })
      .populate('studentId', 'name rollNo email')
      .sort({ weekNumber: -1 });

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supervisor Reviews / Grades Weekly Progress Report
// @route   PUT /api/progress-reports/:id/review
// @access  Supervisor / Admin
const reviewProgressReport = async (req, res) => {
  try {
    const { comment, rating, status } = req.body;
    const report = await ProgressReport.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    report.supervisorFeedback = {
      comment: comment || '',
      rating: rating ? Number(rating) : undefined,
      status: status || 'Reviewed',
      reviewedAt: new Date(),
    };

    await report.save();

    // Notify student
    await Notification.create({
      userId: report.studentId,
      title: `Supervisor Feedback on Week ${report.weekNumber}`,
      message: `Your supervisor reviewed your Week ${report.weekNumber} progress: "${comment || 'Reviewed'}"`,
      type: 'feedback',
      link: '/student/weekly-progress',
    });

    res.json({ success: true, message: 'Progress report reviewed', data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Reports for Supervisor's Assigned Projects
// @route   GET /api/progress-reports/supervisor
// @access  Supervisor
const getSupervisorReports = async (req, res) => {
  try {
    const myProjects = await Project.find({ supervisorId: req.user._id }).select('_id title category studentId');
    const projectIds = myProjects.map((p) => p._id);

    const reports = await ProgressReport.find({ projectId: { $in: projectIds } })
      .populate('projectId', 'title category studentId')
      .populate('studentId', 'name rollNo email department')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitProgressReport,
  getProjectReports,
  getSupervisorReports,
  reviewProgressReport,
};

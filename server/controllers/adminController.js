const User = require('../models/User');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Task = require('../models/Task');
const ProgressReport = require('../models/ProgressReport');

// @desc    Get Institutional Analytics & System Overview
// @route   GET /api/admin/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSupervisors = await User.countDocuments({ role: 'supervisor' });
    const totalProjects = await Project.countDocuments({});

    // Proposal status counts
    const proposalStats = await Proposal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format proposal status map
    const proposalsByStatus = {
      Draft: 0,
      Submitted: 0,
      'Under Review': 0,
      'Changes Required': 0,
      Approved: 0,
      Rejected: 0,
    };
    proposalStats.forEach((stat) => {
      if (proposalsByStatus[stat._id] !== undefined) {
        proposalsByStatus[stat._id] = stat.count;
      }
    });

    // Category distribution of approved projects
    const categoryStats = await Project.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Average project progress
    const avgProgressResult = await Project.aggregate([
      {
        $group: {
          _id: null,
          avgProgress: { $avg: '$progressPercentage' },
        },
      },
    ]);
    const overallAvgProgress = avgProgressResult[0] ? Math.round(avgProgressResult[0].avgProgress) : 0;

    // Supervisor workload
    const supervisors = await User.find({ role: 'supervisor' }).select('name department email designation');
    const supervisorWorkloads = await Promise.all(
      supervisors.map(async (sup) => {
        const assignedCount = await Project.countDocuments({ supervisorId: sup._id });
        const pendingProposalsCount = await Proposal.countDocuments({
          supervisorId: sup._id,
          status: { $in: ['Submitted', 'Under Review'] },
        });
        return {
          id: sup._id,
          name: sup.name,
          department: sup.department,
          designation: sup.designation,
          assignedProjects: assignedCount,
          pendingProposals: pendingProposalsCount,
        };
      })
    );

    // Total tasks breakdown
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ status: 'Completed' });

    res.json({
      success: true,
      data: {
        summary: {
          totalStudents,
          totalSupervisors,
          totalProjects,
          totalProposals: Object.values(proposalsByStatus).reduce((a, b) => a + b, 0),
          overallAvgProgress,
          totalTasks,
          completedTasks,
        },
        proposalsByStatus,
        categoryStats,
        supervisorWorkloads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Manage Users: Get All Users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Assign or Change Supervisor for a Project
// @route   PUT /api/admin/projects/:id/assign-supervisor
// @access  Admin
const assignSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    project.supervisorId = supervisorId;
    await project.save();

    // Also update proposal supervisor
    await Proposal.findByIdAndUpdate(project.proposalId, { supervisorId });

    res.json({ success: true, message: 'Supervisor assigned successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getAllUsers,
  assignSupervisor,
};

const Project = require('../models/Project');
const Task = require('../models/Task');
const Milestone = require('../models/Milestone');
const ProgressReport = require('../models/ProgressReport');
const Meeting = require('../models/Meeting');
const Document = require('../models/Document');
const Notification = require('../models/Notification');
const { generateMilestones } = require('../services/aiService');

// @desc    Get Current User's Active Project
// @route   GET /api/projects/my
// @access  Private (Student)
const getMyProject = async (req, res) => {
  try {
    const project = await Project.findOne({ studentId: req.user._id })
      .populate('supervisorId', 'name email department designation')
      .populate('studentId', 'name email rollNo department');

    if (!project) {
      return res.status(404).json({ success: false, message: 'No active project found' });
    }

    const tasks = await Task.find({ projectId: project._id }).sort({ createdAt: -1 });
    const milestones = await Milestone.find({ projectId: project._id }).sort({ order: 1 });
    const progressReports = await ProgressReport.find({ projectId: project._id }).sort({ weekNumber: -1 });

    res.json({
      success: true,
      data: {
        project,
        tasks,
        milestones,
        recentReports: progressReports.slice(0, 4),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Projects (Filtered by role: supervisor gets assigned, admin gets all)
// @route   GET /api/projects
// @access  Private (Supervisor, Admin)
const getAllProjects = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'supervisor') {
      query = { supervisorId: req.user._id };
    }

    const projects = await Project.find(query)
      .populate('studentId', 'name email rollNo department')
      .populate('supervisorId', 'name email department designation')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('studentId', 'name email rollNo department bio skills')
      .populate('supervisorId', 'name email department designation');

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const tasks = await Task.find({ projectId: project._id }).sort({ createdAt: -1 });
    const milestones = await Milestone.find({ projectId: project._id }).sort({ order: 1 });
    const reports = await ProgressReport.find({ projectId: project._id }).sort({ weekNumber: -1 });
    const meetings = await Meeting.find({ projectId: project._id }).sort({ date: 1 });
    const documents = await Document.find({ projectId: project._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        project,
        tasks,
        milestones,
        reports,
        meetings,
        documents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Project Details / Overall Progress
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const { status, progressPercentage, currentMilestone, targetCompletionDate } = req.body;
    if (status) project.status = status;
    if (progressPercentage !== undefined) project.progressPercentage = Number(progressPercentage);
    if (currentMilestone) project.currentMilestone = currentMilestone;
    if (targetCompletionDate) project.targetCompletionDate = targetCompletionDate;

    await project.save();
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- TASK CONTROLLER FUNCTIONS -----------------

const createTask = async (req, res) => {
  try {
    const { projectId, title, description, priority, deadline, assignedTo, milestoneId } = req.body;

    const task = await Task.create({
      projectId,
      title,
      description,
      priority: priority || 'Medium',
      deadline,
      assignedTo: assignedTo || '',
      milestoneId: milestoneId || null,
    });

    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------- MILESTONE CONTROLLER FUNCTIONS -----------------

const updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });

    // Recalculate project overall progress
    const allMilestones = await Milestone.find({ projectId: milestone.projectId });
    if (allMilestones.length > 0) {
      const avgProgress = Math.round(
        allMilestones.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0) / allMilestones.length
      );
      await Project.findByIdAndUpdate(milestone.projectId, { progressPercentage: avgProgress });
    }

    res.json({ success: true, message: 'Milestone updated', data: milestone });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// AI Milestone Regeneration helper
const regenerateAiMilestones = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const newMilestonesData = generateMilestones(project.category, project.technologies);

    // Remove existing pending milestones and insert new
    await Milestone.deleteMany({ projectId: project._id, status: 'Pending' });

    for (const m of newMilestonesData) {
      const exists = await Milestone.findOne({ projectId: project._id, title: m.title });
      if (!exists) {
        await Milestone.create({
          projectId: project._id,
          title: m.title,
          description: m.description,
          deliverables: m.deliverables,
          order: m.order,
          status: 'Pending',
          progressPercentage: 0,
        });
      }
    }

    const updatedList = await Milestone.find({ projectId: project._id }).sort({ order: 1 });
    res.json({ success: true, message: 'Milestones synchronized with AI recommendations', data: updatedList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyProject,
  getAllProjects,
  getProjectById,
  updateProject,
  createTask,
  updateTask,
  deleteTask,
  updateMilestone,
  regenerateAiMilestones,
};

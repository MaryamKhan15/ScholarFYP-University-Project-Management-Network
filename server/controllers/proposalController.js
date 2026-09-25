const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { analyzeProposalHeuristics, detectDuplicates, generateMilestones } = require('../services/aiService');

// @desc    Create or Draft Proposal
// @route   POST /api/proposals
// @access  Student
const createProposal = async (req, res) => {
  try {
    const { title, category, problemStatement, proposedSolution, objectives, scope, technologies, teamMembers, supervisorId, status } = req.body;

    // Check if student already has a pending or approved proposal
    const existingActive = await Proposal.findOne({
      studentId: req.user._id,
      status: { $in: ['Submitted', 'Under Review', 'Approved'] },
    });

    if (existingActive) {
      return res.status(400).json({
        success: false,
        message: `You already have an active proposal with status: ${existingActive.status}. You cannot submit another one until it is reviewed or revised.`,
      });
    }

    // Run AI analysis
    const parsedObjectives = Array.isArray(objectives) ? objectives : (objectives || '').split('\n').filter(Boolean);
    const parsedTechnologies = Array.isArray(technologies) ? technologies : (technologies || '').split(',').map((t) => t.trim()).filter(Boolean);

    const aiAnalysis = analyzeProposalHeuristics({
      title,
      category,
      problemStatement,
      proposedSolution,
      objectives: parsedObjectives,
      scope,
      technologies: parsedTechnologies,
    });

    // Run duplicate/similarity detection against all historical proposals
    const allExistingProposals = await Proposal.find({}).select('title problemStatement technologies');
    const similarityResult = detectDuplicates(
      { title, problemStatement, technologies: parsedTechnologies },
      allExistingProposals
    );

    const proposal = new Proposal({
      title,
      category,
      problemStatement,
      proposedSolution,
      objectives: parsedObjectives,
      scope,
      technologies: parsedTechnologies,
      teamMembers: teamMembers || [],
      studentId: req.user._id,
      supervisorId: supervisorId || null,
      status: status || 'Draft',
      aiAnalysis,
      similarityCheck: similarityResult,
    });

    await proposal.save();

    // If submitted, notify supervisor
    if (proposal.status === 'Submitted' && supervisorId) {
      await Notification.create({
        userId: supervisorId,
        title: 'New FYP Proposal Received',
        message: `${req.user.name} submitted an FYP proposal: "${proposal.title}" for your review.`,
        type: 'proposal',
        link: `/supervisor/proposals/${proposal._id}`,
      });
    }

    res.status(201).json({
      success: true,
      message: proposal.status === 'Draft' ? 'Proposal drafted successfully' : 'Proposal submitted successfully',
      data: proposal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Student's Proposal
// @route   GET /api/proposals/my
// @access  Student
const getMyProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ studentId: req.user._id })
      .populate('supervisorId', 'name email department designation')
      .populate('studentId', 'name email rollNo department')
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Proposals (Filtered by role: supervisor gets assigned, admin gets all)
// @route   GET /api/proposals
// @access  Private (Supervisor / Admin)
const getAllProposals = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'supervisor') {
      query = { supervisorId: req.user._id };
    }

    const proposals = await Proposal.find(query)
      .populate('studentId', 'name email rollNo department')
      .populate('supervisorId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: proposals.length, data: proposals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Proposal by ID
// @route   GET /api/proposals/:id
// @access  Private
const getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('studentId', 'name email rollNo department skills')
      .populate('supervisorId', 'name email department designation');

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    res.json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update / Revise Proposal
// @route   PUT /api/proposals/:id
// @access  Student
const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    if (proposal.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this proposal' });
    }

    const { title, category, problemStatement, proposedSolution, objectives, scope, technologies, teamMembers, supervisorId, status } = req.body;

    if (title) proposal.title = title;
    if (category) proposal.category = category;
    if (problemStatement) proposal.problemStatement = problemStatement;
    if (proposedSolution) proposal.proposedSolution = proposedSolution;
    if (objectives) proposal.objectives = Array.isArray(objectives) ? objectives : objectives.split('\n').filter(Boolean);
    if (scope) proposal.scope = scope;
    if (technologies) proposal.technologies = Array.isArray(technologies) ? technologies : technologies.split(',').map((t) => t.trim()).filter(Boolean);
    if (teamMembers) proposal.teamMembers = teamMembers;
    if (supervisorId) proposal.supervisorId = supervisorId;

    if (status) {
      if (proposal.status === 'Changes Required' && status === 'Submitted') {
        proposal.version += 1;
      }
      proposal.status = status;
    }

    // Re-run AI analysis & similarity check
    proposal.aiAnalysis = analyzeProposalHeuristics(proposal);
    const allOthers = await Proposal.find({ _id: { $ne: proposal._id } }).select('title problemStatement technologies');
    proposal.similarityCheck = detectDuplicates(proposal, allOthers);

    await proposal.save();

    // If re-submitted, notify supervisor
    if (proposal.status === 'Submitted' && proposal.supervisorId) {
      await Notification.create({
        userId: proposal.supervisorId,
        title: 'Proposal Re-submitted with Revisions',
        message: `${req.user.name} submitted revision (v${proposal.version}) for "${proposal.title}".`,
        type: 'proposal',
        link: `/supervisor/proposals/${proposal._id}`,
      });
    }

    res.json({ success: true, message: 'Proposal updated successfully', data: proposal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Supervisor Action: Approve, Reject, or Request Changes
// @route   POST /api/proposals/:id/review
// @access  Supervisor / Admin
const reviewProposal = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    if (!['Approved', 'Changes Required', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

    proposal.status = status;
    proposal.feedbackHistory.push({
      authorId: req.user._id,
      authorName: req.user.name,
      role: req.user.role,
      message: feedback || 'No comments provided.',
      statusGiven: status,
      createdAt: new Date(),
    });

    await proposal.save();

    // If APPROVED -> Automatically spawn a Project record and initialize AI Milestones!
    let createdProject = null;
    if (status === 'Approved') {
      // Check if project already exists
      let project = await Project.findOne({ proposalId: proposal._id });
      if (!project) {
        project = await Project.create({
          title: proposal.title,
          category: proposal.category,
          description: proposal.problemStatement,
          technologies: proposal.technologies,
          proposalId: proposal._id,
          studentId: proposal.studentId,
          teamMembers: proposal.teamMembers,
          supervisorId: req.user._id,
          status: 'In Progress',
          progressPercentage: 5,
        });

        // Generate baseline milestones from AI template
        const milestonesData = generateMilestones(proposal.category, proposal.technologies);
        for (const m of milestonesData) {
          await Milestone.create({
            projectId: project._id,
            title: m.title,
            description: m.description,
            deliverables: m.deliverables,
            order: m.order,
            status: m.order === 1 ? 'In Progress' : 'Pending',
            progressPercentage: m.order === 1 ? 15 : 0,
          });
        }

        // Link project to student user model
        await User.findByIdAndUpdate(proposal.studentId, { activeProjectId: project._id });
        createdProject = project;
      }
    }

    // Send notification to student
    await Notification.create({
      userId: proposal.studentId,
      title: `Proposal Update: ${status}`,
      message: `Your supervisor (${req.user.name}) marked your proposal as "${status}". Feedback: "${feedback || 'Reviewed'}"`,
      type: 'feedback',
      link: status === 'Approved' ? '/student/project' : '/student/proposal-status',
    });

    res.json({
      success: true,
      message: `Proposal has been marked as ${status}`,
      data: proposal,
      project: createdProject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Live AI Pre-Check endpoint for students (Drafting assist)
// @route   POST /api/proposals/ai-assist
// @access  Private
const aiAssistProposal = async (req, res) => {
  try {
    const analysis = analyzeProposalHeuristics(req.body);
    const allExisting = await Proposal.find({}).select('title problemStatement technologies');
    const similarity = detectDuplicates(req.body, allExisting);

    res.json({
      success: true,
      data: {
        analysis,
        similarity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProposal,
  getMyProposal,
  getAllProposals,
  getProposalById,
  updateProposal,
  reviewProposal,
  aiAssistProposal,
};

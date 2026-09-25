const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Proposal = require('./models/Proposal');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Milestone = require('./models/Milestone');
const ProgressReport = require('./models/ProgressReport');
const Meeting = require('./models/Meeting');
const Notification = require('./models/Notification');
const { generateMilestones, analyzeProposalHeuristics, detectDuplicates } = require('./services/aiService');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fyp_management');
    console.log('MongoDB connected for seeding...');

    // Clean existing records
    await Promise.all([
      User.deleteMany({}),
      Proposal.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Milestone.deleteMany({}),
      ProgressReport.deleteMany({}),
      Meeting.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('Cleared existing collections.');

    // 1. Create Users (Admin, 2 Supervisors, 2 Students)
    const admin = await User.create({
      name: 'Dr. Tariq Mahmood (Coordinator)',
      email: 'admin@fyp.edu.pk',
      password: 'adminpassword123',
      role: 'admin',
      department: 'Computer Science',
      designation: 'Head of FYP Committee',
      bio: 'Oversees University FYP evaluation committees and project distributions.',
    });

    const sup1 = await User.create({
      name: 'Dr. Ayesha Rehman',
      email: 'ayesha@fyp.edu.pk',
      password: 'supervisorpassword123',
      role: 'supervisor',
      department: 'Computer Science',
      designation: 'Associate Professor',
      bio: 'Research interests: Natural Language Processing, Machine Learning, and Information Retrieval.',
      skills: ['Python', 'NLP', 'TensorFlow', 'LLMs'],
    });

    const sup2 = await User.create({
      name: 'Prof. Usman Ali',
      email: 'usman@fyp.edu.pk',
      password: 'supervisorpassword123',
      role: 'supervisor',
      department: 'Software Engineering',
      designation: 'Assistant Professor',
      bio: 'Specialized in Distributed Web Systems, Microservices, and Cloud Native Architectures.',
      skills: ['React', 'Node.js', 'Kubernetes', 'AWS'],
    });

    const student1 = await User.create({
      name: 'Hamza Khan',
      email: 'student@fyp.edu.pk',
      password: 'studentpassword123',
      role: 'student',
      department: 'Computer Science',
      rollNo: 'BCSF21M042',
      bio: 'Passionate full-stack developer and AI researcher.',
      skills: ['React', 'Express', 'MongoDB', 'Python'],
    });

    const student2 = await User.create({
      name: 'Sara Ahmed',
      email: 'sara@fyp.edu.pk',
      password: 'studentpassword123',
      role: 'student',
      department: 'Software Engineering',
      rollNo: 'BSEF21M018',
      bio: 'Enthusiastic about healthcare diagnostics and computer vision applications.',
      skills: ['Python', 'OpenCV', 'FastAPI', 'Tailwind'],
    });

    console.log('Created Users: Admin, 2 Supervisors, 2 Students.');

    // 2. Create Approved Proposal & Active Project for Hamza Khan
    const proposal1Obj = {
      title: 'AI-Powered Smart FYP Management System',
      category: 'Web Application & AI',
      problemStatement:
        'Final Year Project management in universities is heavily fragmented across disparate tools (email, Google Sheets, WhatsApp). Supervisors struggle to track individual milestone progress, students face ambiguous planning stages, and universities lack automated duplicate checking and institutional analytics.',
      proposedSolution:
        'An intelligent, role-governed web platform featuring real-time AI proposal analysis, semantic duplicate topic detection, automated milestone generation, weekly progress tracking, meeting scheduling, and document repository.',
      objectives: [
        'Develop a secure, role-based web platform for students, supervisors, and coordinators.',
        'Implement an AI assistant for automated proposal evaluation and milestone timeline generation.',
        'Incorporate semantic duplicate topic detection to prevent redundant FYP registrations.',
        'Provide interactive supervisor and administrative dashboards with progress analytics.',
      ],
      scope:
        'In-scope: 3 user roles, proposal review life cycle, kanban task board, weekly progress reports, meeting minutes, document versioning, AI recommendations. Out-of-scope: Third-party university LMS billing integration.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'NLP / AI'],
      teamMembers: [
        { name: 'Hamza Khan', rollNo: 'BCSF21M042', email: 'student@fyp.edu.pk' },
        { name: 'Bilal Farooq', rollNo: 'BCSF21M045', email: 'bilal@fyp.edu.pk' },
      ],
      studentId: student1._id,
      supervisorId: sup1._id,
      status: 'Approved',
      version: 1,
    };

    proposal1Obj.aiAnalysis = analyzeProposalHeuristics(proposal1Obj);
    proposal1Obj.similarityCheck = {
      highestScore: 18,
      similarityLevel: 'Low',
      matchedProjects: [],
      checkedAt: new Date(),
    };
    proposal1Obj.feedbackHistory = [
      {
        authorId: sup1._id,
        authorName: sup1.name,
        role: sup1.role,
        message: 'Excellent proposal scope. The integration of AI for duplicate checking and automated milestones makes it very practical. Approved to start Phase 1.',
        statusGiven: 'Approved',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
    ];

    const proposal1 = await Proposal.create(proposal1Obj);

    // Create Active Project
    const project1 = await Project.create({
      title: proposal1.title,
      category: proposal1.category,
      description: proposal1.problemStatement,
      technologies: proposal1.technologies,
      proposalId: proposal1._id,
      studentId: student1._id,
      teamMembers: proposal1.teamMembers,
      supervisorId: sup1._id,
      status: 'In Progress',
      progressPercentage: 45,
      currentMilestone: 'Milestone 3: Core Backend & API Development',
    });

    await User.findByIdAndUpdate(student1._id, { activeProjectId: project1._id });

    // Create Milestones
    const milestoneTemplates = generateMilestones(project1.category, project1.technologies);
    for (let i = 0; i < milestoneTemplates.length; i++) {
      const tmpl = milestoneTemplates[i];
      let status = 'Pending';
      let pct = 0;
      if (i === 0) {
        status = 'Completed';
        pct = 100;
      } else if (i === 1) {
        status = 'Completed';
        pct = 100;
      } else if (i === 2) {
        status = 'In Progress';
        pct = 70;
      }

      await Milestone.create({
        projectId: project1._id,
        title: tmpl.title,
        description: tmpl.description,
        deliverables: tmpl.deliverables,
        order: tmpl.order,
        status,
        progressPercentage: pct,
      });
    }

    // Create Tasks
    await Task.create([
      {
        projectId: project1._id,
        title: 'Design Database Schema and ERD Diagrams',
        description: 'Map out Users, Proposals, Projects, Tasks, and Meetings collections in MongoDB.',
        priority: 'High',
        status: 'Completed',
        deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        assignedTo: 'Hamza Khan',
      },
      {
        projectId: project1._id,
        title: 'Implement JWT Auth & Role Authorization',
        description: 'Secure token verification middleware with separate student, supervisor and admin access gates.',
        priority: 'High',
        status: 'Completed',
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        assignedTo: 'Bilal Farooq',
      },
      {
        projectId: project1._id,
        title: 'Develop AI Proposal Evaluation Engine',
        description: 'Heuristic keyword analyzer and structure validator for clarity scoring.',
        priority: 'Urgent',
        status: 'In Progress',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: 'Hamza Khan',
      },
      {
        projectId: project1._id,
        title: 'Build Supervisor Proposal Review Desk UI',
        description: 'Side-by-side proposal viewer with approval action modals and revision history.',
        priority: 'Medium',
        status: 'To Do',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedTo: 'Hamza Khan',
      },
    ]);

    // Create Progress Reports
    await ProgressReport.create([
      {
        projectId: project1._id,
        studentId: student1._id,
        weekNumber: 1,
        completedWork: ['Finalized SRS document with group partner', 'Setup GitHub repository and development guidelines'],
        currentWork: ['Literature review on AI text similarity models'],
        problemsFaced: 'None',
        nextPlan: ['Complete database schema definition', 'Design UI mockups in Tailwind'],
        progressPercentEstimate: 20,
        supervisorFeedback: {
          comment: 'Good start. Ensure the SRS follows university formatting guidelines.',
          rating: 5,
          status: 'Reviewed',
          reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      {
        projectId: project1._id,
        studentId: student1._id,
        weekNumber: 2,
        completedWork: ['Finished MongoDB schema design', 'Created JWT Auth REST endpoints'],
        currentWork: ['Building AI evaluation logic for proposal submission'],
        problemsFaced: 'Encountered CORS header errors during local frontend test, resolved via Express middleware.',
        nextPlan: ['Build Kanban Task board', 'Connect frontend with backend auth'],
        progressPercentEstimate: 45,
        supervisorFeedback: {
          comment: 'Solid progress! Looking forward to reviewing the proposal review UI.',
          rating: 5,
          status: 'Reviewed',
          reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        },
      },
    ]);

    // Create Meetings
    await Meeting.create({
      projectId: project1._id,
      supervisorId: sup1._id,
      studentId: student1._id,
      title: 'Sprint 2 Review & Architecture Assessment',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '11:30 AM',
      locationOrLink: 'Faculty Room # 204 (CS Block)',
      agenda: 'Demonstrate working JWT authentication, database schemas, and AI proposal review engine.',
      status: 'Scheduled',
    });

    // 3. Create a Second Proposal for Sara Ahmed (Under Review - to test supervisor review flow!)
    const proposal2Obj = {
      title: 'Automated Diabetic Retinopathy Detection using Deep Learning',
      category: 'AI & Healthcare',
      problemStatement:
        'Diabetic retinopathy is a leading cause of preventable blindness worldwide. Early detection requires expert ophthalmologist screening which is scarce in rural healthcare centers in Pakistan.',
      proposedSolution:
        'A CNN-based automated retinal image grading platform with mobile upload interface, providing ophthalmologists with quick preliminary diagnostic heatmaps and disease staging.',
      objectives: [
        'Collect and preprocess Kaggle APTOS 2019 retinal fundus images.',
        'Train an EfficientNet transfer learning model to classify 5 stages of retinopathy.',
        'Build a lightweight web portal for doctors to upload retinal images and receive diagnostic reports.',
      ],
      scope: 'In-scope: 5-stage grading model, doctor web dashboard. Out-of-scope: Direct hardware fundus camera integration.',
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'React', 'OpenCV'],
      teamMembers: [{ name: 'Sara Ahmed', rollNo: 'BSEF21M018', email: 'sara@fyp.edu.pk' }],
      studentId: student2._id,
      supervisorId: sup1._id,
      status: 'Submitted',
      version: 1,
    };
    proposal2Obj.aiAnalysis = analyzeProposalHeuristics(proposal2Obj);
    proposal2Obj.similarityCheck = {
      highestScore: 22,
      similarityLevel: 'Low',
      matchedProjects: [],
      checkedAt: new Date(),
    };
    await Proposal.create(proposal2Obj);

    // Initial Notifications
    await Notification.create([
      {
        userId: student1._id,
        title: 'Proposal Approved!',
        message: 'Congratulations! Your FYP Proposal "AI-Powered Smart FYP Management System" has been approved by Dr. Ayesha Rehman.',
        type: 'proposal',
        link: '/student/project',
      },
      {
        userId: sup1._id,
        title: 'New Proposal Awaiting Review',
        message: 'Sara Ahmed submitted proposal "Automated Diabetic Retinopathy Detection using Deep Learning" for your review.',
        type: 'proposal',
        link: '/supervisor/proposals',
      },
    ]);

    console.log('Seed completed successfully! Demo accounts ready:');
    console.log('1. Admin: admin@fyp.edu.pk / adminpassword123');
    console.log('2. Supervisor: ayesha@fyp.edu.pk / supervisorpassword123');
    console.log('3. Student: student@fyp.edu.pk / studentpassword123');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();

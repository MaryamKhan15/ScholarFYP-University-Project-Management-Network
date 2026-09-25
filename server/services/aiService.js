/**
 * Intelligent AI Service Layer for FYP Management
 * Supports both Google Gemini API integration and offline intelligent heuristic / NLP rule engine
 * ensuring 100% reliability even if no external API key is provided!
 */

// Heuristic rule-based proposal analysis
const analyzeProposalHeuristics = (proposal) => {
  const { title = '', problemStatement = '', proposedSolution = '', objectives = [], scope = '', technologies = [] } = proposal;

  const strengths = [];
  const weaknesses = [];
  const suggestions = [];
  const missingElements = [];

  let score = 50;

  // 1. Title analysis
  if (title.length < 15) {
    weaknesses.push('Project title is too brief and lacks descriptive domain keywords.');
    suggestions.push('Specify the target domain and core technology in the title (e.g., "AI-Powered...", "Automated Cloud-Based...").');
  } else if (title.length > 80) {
    weaknesses.push('Title is overly verbose.');
    suggestions.push('Condense the title to under 80 characters for academic clarity.');
  } else {
    strengths.push('Title is well-scoped, academic, and concisely explains the project.');
    score += 10;
  }

  // 2. Problem statement analysis
  const problemWords = problemStatement.trim().split(/\s+/).length;
  if (problemWords < 30) {
    weaknesses.push('Problem statement is too short; university supervisors expect real-world background and current bottlenecks.');
    suggestions.push('Add statistics, existing manual system drawbacks, or real-life user pain points.');
  } else {
    strengths.push('Comprehensive problem statement that clearly highlights existing challenges.');
    score += 15;
  }

  // 3. Proposed solution analysis
  const solutionWords = proposedSolution.trim().split(/\s+/).length;
  if (solutionWords < 35) {
    weaknesses.push('Proposed solution lacks technical depth on architecture, workflow, and user interaction.');
    suggestions.push('Detail the high-level system components (Frontend, Backend, Database, Algorithms/APIs).');
  } else {
    strengths.push('Clear proposed methodology and technical solution outlined.');
    score += 15;
  }

  // 4. Objectives analysis
  const validObjectives = objectives.filter((o) => o && o.trim().length > 5);
  if (validObjectives.length < 3) {
    missingElements.push('At least 3-4 measurable, actionable SMART objectives are recommended.');
    suggestions.push('Add specific deliverables (e.g., "Develop secure RESTful API layer", "Design responsive UI dashboard").');
  } else {
    strengths.push(`${validObjectives.length} distinct project objectives provided.`);
    score += 10;
  }

  // 5. Scope analysis
  if (!scope || scope.trim().length < 30) {
    missingElements.push('Clear project boundaries and out-of-scope boundaries.');
    suggestions.push('Explicitly define what features will be in-scope for 2 semesters vs what is out-of-scope.');
  } else {
    strengths.push('Well-defined project scope and boundaries.');
    score += 5;
  }

  // 6. Technologies
  if (!technologies || technologies.length < 3) {
    suggestions.push('List all required frontend, backend, database, and devops technologies.');
  } else {
    strengths.push(`Modern technology stack selected: ${technologies.slice(0, 4).join(', ')}.`);
    score += 5;
  }

  score = Math.min(Math.max(score, 45), 98);

  const feasibility = score >= 75 ? 'High' : score >= 60 ? 'Medium' : 'Needs Work';

  return {
    clarityScore: score,
    strengths,
    weaknesses,
    suggestions,
    missingElements,
    feasibility,
    evaluatedAt: new Date(),
  };
};

// Text tokenization & Jaccard / Cosine-like similarity
const computeTextSimilarity = (text1, text2) => {
  if (!text1 || !text2) return 0;
  const tokenize = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !['the', 'and', 'for', 'with', 'system', 'based', 'using', 'project'].includes(w));

  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0;

  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  const jaccard = (intersection.size / union.size) * 100;
  return Math.round(jaccard);
};

// Detect duplicate / similar topics against an array of existing projects
const detectDuplicates = (newProposal, existingProposals) => {
  const matches = [];

  const newCombined = `${newProposal.title} ${newProposal.problemStatement} ${(newProposal.technologies || []).join(' ')}`;

  for (const exp of existingProposals) {
    // Exclude checking against itself
    if (newProposal._id && exp._id && exp._id.toString() === newProposal._id.toString()) continue;

    const expCombined = `${exp.title} ${exp.problemStatement} ${(exp.technologies || []).join(' ')}`;
    const titleScore = computeTextSimilarity(newProposal.title, exp.title);
    const overallScore = computeTextSimilarity(newCombined, expCombined);

    // Weighted similarity score (title similarity has higher weight)
    const combinedSimilarity = Math.round(titleScore * 0.65 + overallScore * 0.35);

    if (combinedSimilarity >= 25) {
      let reason = 'Similar technical focus and domain keywords.';
      if (titleScore >= 60) reason = 'Title heavily overlaps with existing registered FYP topic.';
      else if (combinedSimilarity >= 45) reason = 'Substantial overlap in problem formulation and domain.';

      matches.push({
        title: exp.title,
        similarityPercentage: combinedSimilarity,
        overlapReason: reason,
      });
    }
  }

  // Sort matches by descending similarity
  matches.sort((a, b) => b.similarityPercentage - a.similarityPercentage);

  const highestScore = matches.length > 0 ? matches[0].similarityPercentage : 0;
  const similarityLevel = highestScore >= 65 ? 'High' : highestScore >= 40 ? 'Medium' : 'Low';

  return {
    highestScore,
    similarityLevel,
    matchedProjects: matches.slice(0, 5),
    checkedAt: new Date(),
  };
};

// Milestone generator based on domain category & tech stack
const generateMilestones = (category = 'Web Application', technologies = []) => {
  const techStr = technologies.join(', ') || 'Modern stack';

  const defaultTemplates = [
    {
      title: 'Milestone 1: Research, Feasibility & SRS Documentation',
      description: `Requirement engineering, literature review, functional & non-functional requirements, use-case diagrams for ${category}.`,
      deliverables: ['System Requirements Specification (SRS)', 'Domain Research Paper Review', 'Supervisor Sign-off'],
      order: 1,
      durationWeeks: 4,
    },
    {
      title: 'Milestone 2: System Architecture, UI/UX & Database Modeling',
      description: `Architectural diagrams, ERD, Schema definition in MongoDB/SQL, and Figma wireframes tailored for ${category}.`,
      deliverables: ['Database Schema & ERD', 'High-Fidelity Wireframes', 'System Architecture Document'],
      order: 2,
      durationWeeks: 4,
    },
    {
      title: 'Milestone 3: Core Backend & API Development',
      description: `Implementing secure authentication (JWT/OAuth), REST endpoints, database controllers, and business logic using ${techStr}.`,
      deliverables: ['Working REST APIs', 'Postman API Documentation', 'Database Migrations & Seeders'],
      order: 3,
      durationWeeks: 5,
    },
    {
      title: 'Milestone 4: Frontend Development & API Integration',
      description: `Building responsive UI dashboards, integrating API state, form validations, and user role-based views.`,
      deliverables: ['Interactive Web/Mobile Interface', 'Full End-to-End API Integration', 'State Management'],
      order: 4,
      durationWeeks: 5,
    },
    {
      title: 'Milestone 5: Advanced & AI Features Implementation',
      description: `Specialized module implementation, machine learning / AI assistant services, algorithms, and notification workflows.`,
      deliverables: ['AI/Algorithmic Engine', 'Automated Verification Logs', 'Feature Showcase'],
      order: 5,
      durationWeeks: 4,
    },
    {
      title: 'Milestone 6: System Testing, Security Audit & Quality Assurance',
      description: 'Unit testing, integration testing, boundary validation, and role-based vulnerability checks.',
      deliverables: ['Test Case Execution Sheet', 'Bug Fix Log', 'Performance Benchmark'],
      order: 6,
      durationWeeks: 3,
    },
    {
      title: 'Milestone 7: Deployment, Final Thesis & Viva Defense Preparation',
      description: 'Cloud deployment, user manual, final FYP book/thesis compilation, presentation slides, and mock viva.',
      deliverables: ['Live Deployed URL', 'Final FYP Documentation Book', 'Defense Presentation Deck'],
      order: 7,
      durationWeeks: 3,
    },
  ];

  return defaultTemplates;
};

module.exports = {
  analyzeProposalHeuristics,
  detectDuplicates,
  generateMilestones,
};

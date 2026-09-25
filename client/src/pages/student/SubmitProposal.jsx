import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Send,
  Save,
  Layers,
  Cpu,
  SearchCheck,
  AlertCircle
} from 'lucide-react';

export default function SubmitProposal() {
  const navigate = useNavigate();
  const [supervisors, setSupervisors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Application & AI',
    problemStatement: '',
    proposedSolution: '',
    objectives: '',
    scope: '',
    technologies: '',
    supervisorId: '',
    teamMembers: [{ name: '', rollNo: '', email: '' }],
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await api.get('/auth/supervisors');
        setSupervisors(res.data.data);
        if (res.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, supervisorId: res.data.data[0]._id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSupervisors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData({ ...formData, teamMembers: updated });
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < 3) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, { name: '', rollNo: '', email: '' }],
      });
    }
  };

  const removeTeamMember = (index) => {
    const updated = formData.teamMembers.filter((_, i) => i !== index);
    setFormData({ ...formData, teamMembers: updated });
  };

  // Live AI Pre-Check
  const runAiAnalysis = async () => {
    if (!formData.title || !formData.problemStatement) {
      setError('Please provide at least a Project Title and Problem Statement to run AI Pre-Check.');
      return;
    }
    setError('');
    setAiLoading(true);
    try {
      const res = await api.post('/proposals/ai-assist', {
        title: formData.title,
        problemStatement: formData.problemStatement,
        proposedSolution: formData.proposedSolution,
        objectives: formData.objectives.split('\n').filter(Boolean),
        scope: formData.scope,
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setAiResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error running AI check.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (statusType) => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        status: statusType, // 'Draft' or 'Submitted'
        objectives: formData.objectives.split('\n').filter(Boolean),
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      };

      await api.post('/proposals', payload);
      setSuccess(statusType === 'Draft' ? 'Proposal saved as Draft.' : 'Proposal submitted for supervisor review!');
      setTimeout(() => {
        navigate('/student/proposal-status');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" /> FYP Proposal Submission
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill out your project specifications. Use the live AI assistant to verify clarity and check duplicate topics.
          </p>
        </div>

        <button
          type="button"
          onClick={runAiAnalysis}
          disabled={aiLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition disabled:opacity-50"
        >
          <Cpu className="w-4 h-4" />
          {aiLoading ? 'AI Evaluating...' : 'Run AI Quality & Similarity Check'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* AI Pre-Check Results Drawer (if triggered) */}
      {aiResult && (
        <div className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-indigo-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Assistance Feedback
              </span>
              <h3 className="text-lg font-bold mt-1">Intelligent Proposal Pre-Screening</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-300 uppercase block">Clarity Score</span>
                <span className="text-2xl font-black text-emerald-400">{aiResult.analysis.clarityScore}/100</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-300 uppercase block">Duplicate Risk</span>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    aiResult.similarity.similarityLevel === 'High'
                      ? 'bg-red-500/20 text-red-300'
                      : aiResult.similarity.similarityLevel === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {aiResult.similarity.similarityLevel} ({aiResult.similarity.highestScore}%)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
            {/* Strengths */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4" /> Identified Strengths
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {aiResult.analysis.strengths.map((st, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span> {st}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-2">
                <HelpCircle className="w-4 h-4" /> Recommended Improvements
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {aiResult.analysis.suggestions.map((sg, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span> {sg}
                  </li>
                ))}
              </ul>
            </div>

            {/* Duplicate Topics Detected */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-2">
                <SearchCheck className="w-4 h-4" /> Similar University Topics
              </span>
              {aiResult.similarity.matchedProjects.length === 0 ? (
                <p className="text-slate-400">No close topic overlap detected. Great originality!</p>
              ) : (
                <div className="space-y-2">
                  {aiResult.similarity.matchedProjects.map((match, i) => (
                    <div key={i} className="p-2 bg-white/5 rounded-xl border border-white/5">
                      <p className="font-semibold text-slate-200 line-clamp-1">{match.title}</p>
                      <span className="text-[10px] text-amber-400">{match.similarityPercentage}% overlap</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Proposal Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Project Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            1. Project Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. AI-Powered Smart FYP Management and Monitoring System"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Category & Supervisor */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              2. Domain / Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            >
              <option value="Web Application & AI">Web Application & AI</option>
              <option value="Machine Learning / NLP">Machine Learning / NLP</option>
              <option value="Computer Vision / Healthcare">Computer Vision / Healthcare</option>
              <option value="Cybersecurity & Blockchain">Cybersecurity & Blockchain</option>
              <option value="IoT & Embedded Systems">IoT & Embedded Systems</option>
              <option value="Mobile App & Cloud">Mobile App & Cloud</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              3. Proposed Supervisor *
            </label>
            <select
              name="supervisorId"
              value={formData.supervisorId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            >
              {supervisors.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.department} - {s.designation || 'Faculty'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Statement */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            4. Problem Statement *
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            Clearly explain what university or real-world problem you are addressing and the limitations of current solutions.
          </p>
          <textarea
            rows={4}
            name="problemStatement"
            required
            value={formData.problemStatement}
            onChange={handleChange}
            placeholder="Describe background context and pain points..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Proposed Solution */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            5. Proposed Technical Solution & Methodology *
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            Explain the high-level system architecture, algorithms, and key functionalities.
          </p>
          <textarea
            rows={4}
            name="proposedSolution"
            required
            value={formData.proposedSolution}
            onChange={handleChange}
            placeholder="Detail your system approach, workflow, and core design..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Objectives & Scope */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              6. Project Objectives (1 per line) *
            </label>
            <textarea
              rows={4}
              name="objectives"
              required
              value={formData.objectives}
              onChange={handleChange}
              placeholder="e.g.&#10;Design responsive role-based portal&#10;Implement AI proposal analyzer&#10;Integrate duplicate topic detection"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              7. Project Scope & Boundaries *
            </label>
            <textarea
              rows={4}
              name="scope"
              required
              value={formData.scope}
              onChange={handleChange}
              placeholder="Define deliverables in-scope for 2 semesters, and what is explicitly out of scope."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            8. Technologies & Tools (Comma separated) *
          </label>
          <input
            type="text"
            name="technologies"
            required
            value={formData.technologies}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS, Python"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        {/* Team Members Section */}
        <div className="border-t border-slate-100 pt-6">
          <div className="flex justify-between items-center mb-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                9. Team Members (Max 3)
              </label>
              <p className="text-[11px] text-slate-400">Add co-authors / group partners for this FYP</p>
            </div>
            {formData.teamMembers.length < 3 && (
              <button
                type="button"
                onClick={addTeamMember}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                + Add Partner
              </button>
            )}
          </div>

          <div className="space-y-3">
            {formData.teamMembers.map((member, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <input
                  type="text"
                  placeholder="Partner Name"
                  value={member.name}
                  onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                  className="w-full sm:w-1/3 px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs"
                />
                <input
                  type="text"
                  placeholder="Roll No (e.g. BCSF21M045)"
                  value={member.rollNo}
                  onChange={(e) => handleTeamMemberChange(idx, 'rollNo', e.target.value)}
                  className="w-full sm:w-1/3 px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs"
                />
                <input
                  type="email"
                  placeholder="Partner Email"
                  value={member.email}
                  onChange={(e) => handleTeamMemberChange(idx, 'email', e.target.value)}
                  className="w-full sm:w-1/3 px-3 py-2 bg-white rounded-lg border border-slate-200 text-xs"
                />
                {formData.teamMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTeamMember(idx)}
                    className="text-xs text-red-500 hover:text-red-700 font-bold px-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('Draft')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition inline-flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save as Draft
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit('Submitted')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition inline-flex items-center justify-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Submit Proposal to Supervisor
          </button>
        </div>
      </div>
    </div>
  );
}

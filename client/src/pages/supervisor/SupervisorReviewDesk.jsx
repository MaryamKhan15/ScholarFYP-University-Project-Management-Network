import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText,
  Sparkles,
  SearchCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  ArrowLeft,
  Users,
  Layers,
  Award
} from 'lucide-react';

export default function SupervisorReviewDesk() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [actionDone, setActionDone] = useState(null);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      const res = await api.get(`/proposals/${id}`);
      setProposal(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (status) => {
    if (!feedback.trim()) {
      alert('Please provide detailed supervisor remarks or instructions for the student.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/proposals/${id}/review`, {
        status,
        feedback,
      });
      setActionDone(status);
      fetchProposal();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading proposal review desk...</div>;
  if (!proposal) return <div className="p-8 text-center text-sm text-red-500">Proposal record not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top back bar */}
      <button
        onClick={() => navigate('/supervisor/proposals')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Proposals Inbox
      </button>

      {/* Main Proposal Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{proposal.category}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">Revision v{proposal.version}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{proposal.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Student Lead: <strong className="text-slate-800">{proposal.studentId?.name}</strong> ({proposal.studentId?.rollNo}) • {proposal.studentId?.department}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                proposal.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : proposal.status === 'Changes Required'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              Status: {proposal.status}
            </span>
          </div>
        </div>

        {/* AI Analysis and Duplicate Topic Detection Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* AI Clarity & Strengths Box */}
          <div className="p-4 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl text-white shadow-md text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-bold flex items-center gap-1.5 text-indigo-300">
                <Sparkles className="w-4 h-4" /> AI Proposal Insights
              </span>
              <span className="font-black text-emerald-400">
                Clarity: {proposal.aiAnalysis?.clarityScore || 0}/100
              </span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Feasibility: <strong>{proposal.aiAnalysis?.feasibility || 'Evaluated'}</strong>
            </p>
            <div className="space-y-1">
              <span className="font-semibold text-emerald-300 block text-[10px] uppercase tracking-wider">Strengths:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {proposal.aiAnalysis?.strengths?.slice(0, 3).map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Duplicate Topic Detection Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <span className="font-bold flex items-center gap-1.5 text-slate-800">
                <SearchCheck className="w-4 h-4 text-violet-600" /> Duplicate Topic Detection
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                  proposal.similarityCheck?.similarityLevel === 'High'
                    ? 'bg-red-100 text-red-700'
                    : proposal.similarityCheck?.similarityLevel === 'Medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                Overlap Risk: {proposal.similarityCheck?.similarityLevel || 'Low'}
              </span>
            </div>

            {proposal.similarityCheck?.matchedProjects?.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-500 font-semibold">Matched Past University Projects:</span>
                {proposal.similarityCheck.matchedProjects.map((match, i) => (
                  <div key={i} className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>{match.title}</span>
                      <span className="text-amber-600">{match.similarityPercentage}%</span>
                    </div>
                    <span className="text-slate-400 block text-[10px]">{match.overlapReason}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-[11px] pt-1">
                No significant duplicate topics detected across past semester databases.
              </p>
            )}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 mt-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Problem Statement</h4>
            <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed">
              {proposal.problemStatement}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Proposed Solution</h4>
            <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed">
              {proposal.proposedSolution}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">SMART Objectives</h4>
              <ul className="p-4 bg-slate-50 rounded-2xl list-disc list-inside space-y-1 text-slate-700">
                {proposal.objectives?.map((o, idx) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Scope & Out of Scope</h4>
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed">
                {proposal.scope}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Technologies & Team</h4>
            <div className="p-4 bg-slate-50 rounded-2xl flex flex-wrap justify-between items-center gap-2">
              <div className="flex flex-wrap gap-1.5">
                {proposal.technologies?.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md font-medium text-slate-700">
                    {t}
                  </span>
                ))}
              </div>
              <div className="text-slate-500 text-[11px]">
                {proposal.teamMembers?.map((m) => `${m.name} (${m.rollNo || ''})`).join(', ')}
              </div>
            </div>
          </div>
        </div>

        {/* Supervisor Action Panel */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="font-bold text-sm text-slate-900 mb-2">Supervisor Review Decision & Comments</h3>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write clear instructions for student (e.g. 'Approved to proceed with Milestone 1', or 'Clarify database design in proposed solution')..."
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />

          <div className="flex flex-wrap justify-end gap-3 mt-4">
            <button
              onClick={() => handleReviewAction('Rejected')}
              disabled={submitting}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <XCircle className="w-4 h-4" /> Reject Proposal
            </button>
            <button
              onClick={() => handleReviewAction('Changes Required')}
              disabled={submitting}
              className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" /> Request Changes
            </button>
            <button
              onClick={() => handleReviewAction('Approved')}
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Approve Proposal & Spawn Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

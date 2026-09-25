import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';

export default function ProposalStatus() {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revisionMode, setRevisionMode] = useState(false);
  const [revisedStatement, setRevisedStatement] = useState('');
  const [revisedSolution, setRevisedSolution] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProposal();
  }, []);

  const fetchProposal = async () => {
    try {
      const res = await api.get('/proposals/my');
      setProposal(res.data.data);
      if (res.data.data) {
        setRevisedStatement(res.data.data.problemStatement);
        setRevisedSolution(res.data.data.proposedSolution);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async () => {
    setSubmitting(true);
    try {
      await api.put(`/proposals/${proposal._id}`, {
        problemStatement: revisedStatement,
        proposedSolution: revisedSolution,
        status: 'Submitted',
      });
      setRevisionMode(false);
      fetchProposal();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Checking proposal status...</div>;

  if (!proposal) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center max-w-lg mx-auto">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Proposal on Record</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">You have not submitted an FYP proposal yet.</p>
        <Link
          to="/student/submit-proposal"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          Submit New Proposal
        </Link>
      </div>
    );
  }

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-4 h-4" /> Approved
          </span>
        );
      case 'Changes Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-4 h-4" /> Changes Required
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4" /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                FYP Proposal Tracker
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">Version v{proposal.version}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{proposal.title}</h1>
            <p className="text-xs text-slate-500 mt-1">
              Assigned Supervisor: <strong className="text-slate-700">{proposal.supervisorId?.name || 'Under Assignment'}</strong>
            </p>
          </div>

          <div>{getStatusBadge(proposal.status)}</div>
        </div>

        {/* If changes required, offer revision drawer */}
        {proposal.status === 'Changes Required' && (
          <div className="mt-5 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Action Required: Revisions Requested
                </h4>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  Review supervisor comments below and resubmit your updated proposal text.
                </p>
              </div>
              <button
                onClick={() => setRevisionMode(!revisionMode)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                {revisionMode ? 'Cancel Edit' : 'Edit & Resubmit'}
              </button>
            </div>

            {revisionMode && (
              <div className="mt-4 pt-4 border-t border-amber-200/60 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Update Problem Statement</label>
                  <textarea
                    rows={3}
                    value={revisedStatement}
                    onChange={(e) => setRevisedStatement(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Update Proposed Solution</label>
                  <textarea
                    rows={3}
                    value={revisedSolution}
                    onChange={(e) => setRevisedSolution(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <button
                  onClick={handleResubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting...' : 'Submit Revision (v' + (proposal.version + 1) + ')'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Next step prompt if approved */}
        {proposal.status === 'Approved' && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-emerald-900">Your Proposal is Approved!</h4>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Your FYP project workspace has been created. Start working on Milestone 1 and planning tasks.
              </p>
            </div>
            <Link
              to="/student/project"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              Go to Active Project <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Supervisor Feedback Timeline */}
        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-600" /> Supervisor Feedback & Revision Log
          </h3>

          <div className="space-y-3">
            {proposal.feedbackHistory && proposal.feedbackHistory.length > 0 ? (
              proposal.feedbackHistory.map((fb, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-800">
                      {fb.authorName} ({fb.role})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${
                      fb.statusGiven === 'Approved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : fb.statusGiven === 'Changes Required'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    Action: {fb.statusGiven}
                  </span>
                  <p className="text-slate-600 leading-relaxed">{fb.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No feedback comments recorded yet. Waiting for review.</p>
            )}
          </div>
        </div>

        {/* Structured Proposal Details */}
        <div className="mt-8 border-t border-slate-100 pt-6 space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-slate-800 uppercase mb-1">Problem Statement</h4>
            <p className="text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl">{proposal.problemStatement}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 uppercase mb-1">Proposed Solution</h4>
            <p className="text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl">{proposal.proposedSolution}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-bold text-slate-800 uppercase mb-1">Objectives</h4>
              <ul className="list-disc list-inside p-3 bg-slate-50 rounded-xl space-y-1 text-slate-600">
                {proposal.objectives.map((o, idx) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 uppercase mb-1">Scope & Boundary</h4>
              <p className="text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl">{proposal.scope}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

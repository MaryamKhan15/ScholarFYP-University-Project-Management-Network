import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FolderGit2,
  FileCheck2,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [proposal, setProposal] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await api.get('/proposals/my');
        setProposal(propRes.data.data);

        try {
          const projRes = await api.get('/projects/my');
          setProjectData(projRes.data.data);
        } catch {
          // No active project yet
        }
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading your FYP workspace...</div>;
  }

  const project = projectData?.project;
  const tasks = projectData?.tasks || [];
  const milestones = projectData?.milestones || [];
  const reports = projectData?.recentReports || [];

  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Banner - Compact Single Screen Fit */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/10 text-indigo-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> Student FYP Portal
              </span>
              {project && (
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Project Active
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-indigo-100 text-xs mt-0.5 line-clamp-1 max-w-xl">
              {project
                ? `Active FYP: "${project.title}". Check your active sprint deliverables.`
                : proposal
                ? `FYP Proposal status: [${proposal.status}]. Track supervisor review feedback.`
                : 'No proposal submitted yet. Draft your FYP proposal with AI assistance.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!proposal && (
              <Link
                to="/student/submit-proposal"
                className="px-3.5 py-2 bg-white text-indigo-900 rounded-xl font-bold text-xs shadow-xs hover:bg-indigo-50 transition inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Submit Proposal
              </Link>
            )}
            {proposal && !project && (
              <Link
                to="/student/proposal-status"
                className="px-3.5 py-2 bg-white text-indigo-900 rounded-xl font-bold text-xs shadow-xs hover:bg-indigo-50 transition inline-flex items-center gap-1.5"
              >
                Proposal Status <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            {project && (
              <Link
                to="/student/weekly-progress"
                className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" /> Log Weekly Progress
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row - Compact heights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Proposal Status</span>
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                proposal?.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-700'
                  : proposal?.status === 'Changes Required'
                  ? 'bg-amber-100 text-amber-700'
                  : proposal?.status === 'Submitted'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {proposal ? proposal.status : 'No Proposal'}
            </span>
            <span className="text-[10px] text-slate-400">v{proposal?.version || 1}</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Degree Progress</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{project?.progressPercentage || 0}%</span>
            <span className="text-[10px] font-semibold text-emerald-600">Sprint Active</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all"
              style={{ width: `${project?.progressPercentage || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">
              {completedTasksCount} / {tasks.length}
            </span>
            <span className="text-[10px] text-slate-400">
              {tasks.length > 0 ? `${Math.round((completedTasksCount / tasks.length) * 100)}%` : '0%'}
            </span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Supervisor</span>
            <FolderGit2 className="w-4 h-4 text-pink-600" />
          </div>
          <div className="mt-1">
            <span className="text-xs font-bold text-slate-900 block truncate">
              {proposal?.supervisorId?.name || 'Unassigned'}
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold block truncate">
              {proposal?.supervisorId?.designation || 'Faculty Member'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Fits in Viewport */}
      {project ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Active Milestones */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-indigo-600" /> Milestone Roadmap
              </h3>
              <Link to="/student/milestones" className="text-[11px] text-indigo-600 font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {milestones.slice(0, 3).map((m) => (
                <div key={m._id} className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                  <div className="max-w-[70%]">
                    <span className="font-bold text-slate-800 block truncate">{m.title}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{m.description}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : m.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.status} ({m.progressPercentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Progress Logs */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" /> Weekly Logs
              </h3>
              <Link to="/student/weekly-progress" className="text-[11px] text-indigo-600 font-bold hover:underline">
                Log New
              </Link>
            </div>

            <div className="space-y-2">
              {reports.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No progress logs submitted yet.</p>
              ) : (
                reports.slice(0, 2).map((r) => (
                  <div key={r._id} className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-100 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Week #{r.weekNumber}</span>
                      <span className="text-emerald-600">{r.progressPercentEstimate}%</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">
                      {r.completedWork.join(', ')}
                    </p>
                    {r.supervisorFeedback?.comment && (
                      <div className="mt-1.5 p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-900 text-[10px]">
                        <strong>Supervisor:</strong> {r.supervisorFeedback.comment}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : proposal ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Submitted Proposal</span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">{proposal.title}</h2>
            </div>
            <Link
              to="/student/proposal-status"
              className="px-3.5 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-indigo-700 transition"
            >
              Check Review Feedback
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-0.5 text-[11px] uppercase">Problem Statement</h4>
              <p className="text-slate-600 line-clamp-2">{proposal.problemStatement}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-0.5 text-[11px] uppercase">Proposed Solution</h4>
              <p className="text-slate-600 line-clamp-2">{proposal.proposedSolution}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

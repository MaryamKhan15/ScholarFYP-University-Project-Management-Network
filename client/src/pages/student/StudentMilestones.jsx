import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Milestone,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCw
} from 'lucide-react';

export default function StudentMilestones() {
  const [projectData, setProjectData] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const res = await api.get('/projects/my');
      setProjectData(res.data.data.project);
      setMilestones(res.data.data.milestones);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateMilestoneProgress = async (id, status, progressPercentage) => {
    try {
      const res = await api.put(`/projects/milestones/${id}`, { status, progressPercentage });
      setMilestones(milestones.map((m) => (m._id === id ? res.data.data : m)));
      // Re-fetch project to get updated overall avg progress
      const projRes = await api.get('/projects/my');
      setProjectData(projRes.data.data.project);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegenerateWithAi = async () => {
    if (!projectData) return;
    setRegenerating(true);
    try {
      const res = await api.post(`/projects/${projectData._id}/milestones/regenerate`);
      setMilestones(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading project milestones...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Milestone className="w-6 h-6 text-indigo-600" /> FYP Milestones & Timeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your 2-semester deliverables. Synchronize with AI recommendations anytime.
          </p>
        </div>

        <button
          onClick={handleRegenerateWithAi}
          disabled={regenerating}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition inline-flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {regenerating ? 'Regenerating...' : 'AI Milestone Sync'}
        </button>
      </div>

      {/* Progress Summary Card */}
      {projectData && (
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Active Sprint</span>
            <h3 className="text-lg font-bold mt-1">{projectData.currentMilestone}</h3>
            <span className="text-xs text-slate-300">Project: {projectData.title}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-300 block">Total Degree Completion</span>
            <span className="text-3xl font-black text-emerald-400">{projectData.progressPercentage}%</span>
          </div>
        </div>
      )}

      {/* Milestone List */}
      <div className="space-y-4">
        {milestones.map((m, index) => (
          <div
            key={m._id}
            className={`bg-white rounded-2xl border p-5 shadow-xs transition ${
              m.status === 'Completed'
                ? 'border-emerald-200 bg-emerald-50/20'
                : m.status === 'In Progress'
                ? 'border-indigo-200 shadow-md'
                : 'border-slate-200/80'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                </div>
                <p className="text-xs text-slate-500 pl-8">{m.description}</p>
              </div>

              <div className="flex items-center gap-3 pl-8 sm:pl-0">
                <div className="text-right min-w-[70px]">
                  <span className="text-xs font-mono font-bold text-slate-800">{m.progressPercentage}%</span>
                </div>

                {/* Status Switcher */}
                <select
                  value={m.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    const newPct = newStatus === 'Completed' ? 100 : newStatus === 'In Progress' ? 50 : 0;
                    updateMilestoneProgress(m._id, newStatus, newPct);
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                    m.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : m.status === 'In Progress'
                      ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Deliverables tags */}
            {m.deliverables && m.deliverables.length > 0 && (
              <div className="mt-3 pl-8 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Deliverables:</span>
                {m.deliverables.map((d, i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

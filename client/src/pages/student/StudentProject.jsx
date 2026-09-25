import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  FileCode,
  Users,
  Award,
  AlertCircle
} from 'lucide-react';

export default function StudentProject() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await api.get('/projects/my');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading project details...</div>;

  if (!data?.project) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center max-w-lg mx-auto">
        <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-lg text-slate-800">No Active FYP Project</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Your proposal must be officially approved by your supervisor to start your active project workspace.
        </p>
        <Link
          to="/student/proposal-status"
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          Check Proposal Status
        </Link>
      </div>
    );
  }

  const { project, tasks, milestones, recentReports } = data;

  return (
    <div className="space-y-6">
      {/* Project Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {project.status}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-indigo-600">{project.category}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{project.title}</h1>
            <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">{project.description}</p>
          </div>

          <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-right min-w-[160px]">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
              Cumulative Progress
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{project.progressPercentage}%</span>
            <div className="w-full bg-indigo-200/60 h-2 rounded-full mt-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Meta Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Supervisor</span>
              <span className="font-bold text-slate-800">{project.supervisorId?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Members</span>
              <span className="font-bold text-slate-800">
                {project.teamMembers?.map((m) => m.name).join(', ') || project.studentId?.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tech Stack</span>
              <span className="font-bold text-slate-800">{project.technologies?.slice(0, 4).join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Tasks + Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Milestones Road */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" /> Milestone Execution Roadmap
            </h3>
            <Link to="/student/milestones" className="text-xs text-indigo-600 font-semibold hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m._id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{m.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                <p className="text-[11px] text-slate-500 mt-1">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Tasks Overview */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Active Tasks
            </h3>
            <Link to="/student/tasks" className="text-xs text-indigo-600 font-semibold hover:underline">
              Open Board
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No tasks created yet. Open board to add.</p>
            ) : (
              tasks.slice(0, 5).map((t) => (
                <div key={t._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{t.title}</span>
                    <span className="text-[11px] text-slate-400">Assigned: {t.assignedTo || 'Unassigned'}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : t.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

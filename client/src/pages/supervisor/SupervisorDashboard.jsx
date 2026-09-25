import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  FileCheck2,
  FolderGit2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const propRes = await api.get('/proposals');
      setProposals(propRes.data.data);
      const projRes = await api.get('/projects');
      setProjects(projRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading supervisor workspace...</div>;

  const pendingProposals = proposals.filter((p) => p.status === 'Submitted' || p.status === 'Under Review');
  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress').length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Banner - Compact */}
      <div className="bg-gradient-to-r from-violet-800 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="bg-white/10 text-violet-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3" /> Faculty Supervisor Desk
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Welcome, {user?.name}
            </h1>
            <p className="text-violet-100 text-xs mt-0.5">
              You have <strong className="text-white underline">{pendingProposals.length} pending proposals</strong> awaiting evaluation and <strong className="text-white underline">{activeProjectsCount} active FYP groups</strong> in progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/supervisor/proposals"
              className="px-3.5 py-2 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-xs hover:bg-slate-100 transition inline-flex items-center gap-1"
            >
              Review Desk ({pendingProposals.length})
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500">Pending Proposals</span>
            <span className="text-2xl font-black text-amber-600 block mt-0.5">{pendingProposals.length}</span>
          </div>
          <FileCheck2 className="w-6 h-6 text-amber-500" />
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500">Active FYP Groups</span>
            <span className="text-2xl font-black text-indigo-600 block mt-0.5">{projects.length}</span>
          </div>
          <FolderGit2 className="w-6 h-6 text-indigo-600" />
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500">Avg Progress Rate</span>
            <span className="text-2xl font-black text-emerald-600 block mt-0.5">
              {projects.length > 0
                ? Math.round(projects.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / projects.length)
                : 0}
              %
            </span>
          </div>
          <TrendingUp className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {/* Main Grids - Fits in Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Proposals Awaiting Review */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-indigo-600" /> Proposals Awaiting Review
            </h3>
            <Link to="/supervisor/proposals" className="text-[11px] text-indigo-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2">
            {pendingProposals.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">All proposals are up to date.</p>
            ) : (
              pendingProposals.slice(0, 3).map((prop) => (
                <div key={prop._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{prop.title}</h4>
                    <span className="text-[11px] text-slate-500">By {prop.studentId?.name}</span>
                  </div>

                  <Link
                    to={`/supervisor/proposals/${prop._id}`}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shrink-0 ml-2"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Student Projects */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-indigo-600" /> Active Student Projects
            </h3>
            <Link to="/supervisor/projects" className="text-[11px] text-indigo-600 font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No active FYPs assigned yet.</p>
            ) : (
              projects.slice(0, 3).map((proj) => (
                <div key={proj._id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 line-clamp-1">{proj.title}</h4>
                    <span className="font-black text-emerald-600 shrink-0 ml-2">{proj.progressPercentage}%</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${proj.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

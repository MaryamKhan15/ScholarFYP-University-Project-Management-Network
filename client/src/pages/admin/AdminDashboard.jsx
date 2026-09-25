import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart3,
  Users,
  FolderGit2,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-xs text-slate-500 font-medium">Loading FYP analytics...</div>;
  if (!data) return <div className="p-6 text-center text-xs text-red-500 font-medium">Failed to load analytics.</div>;

  const { summary, proposalsByStatus, supervisorWorkloads } = data;

  const proposalChartData = [
    { name: 'Approved', count: proposalsByStatus.Approved || 0 },
    { name: 'Under Review', count: proposalsByStatus['Under Review'] || 0 },
    { name: 'Changes Req.', count: proposalsByStatus['Changes Required'] || 0 },
    { name: 'Submitted', count: proposalsByStatus.Submitted || 0 },
    { name: 'Rejected', count: proposalsByStatus.Rejected || 0 },
  ];

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto">
      {/* Top Banner - Compact Viewport Fit */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/10 text-indigo-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-400" /> FYP Committee Governance
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                Institutional Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Institutional FYP Analytics Dashboard
            </h1>
            <p className="text-slate-300 text-xs mt-0.5 line-clamp-1 max-w-xl">
              Real-time monitoring across academic departments, supervisor workloads, and project clearance rates.
            </p>
          </div>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Registered Students</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{summary.totalStudents}</span>
            <span className="text-[10px] font-bold text-indigo-600">Active Cohort</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{summary.totalProjects}</span>
            <span className="text-[10px] font-bold text-violet-600">Active Groups</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Proposals Submitted</span>
            <FileCheck2 className="w-4 h-4 text-pink-600" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{summary.totalProposals}</span>
            <span className="text-[10px] font-bold text-pink-600">Submissions</span>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500">Avg Completion</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{summary.overallAvgProgress}%</span>
            <span className="text-[10px] font-bold text-emerald-600">Milestone Rate</span>
          </div>
        </div>
      </div>

      {/* Analytics Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Proposal Distribution Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> Proposal Status Breakdown
            </h3>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proposalChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supervisor Workload Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Faculty Supervisor Workload
            </h3>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {supervisorWorkloads.map((sup) => (
              <div key={sup.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block truncate">{sup.name}</span>
                  <span className="text-[10px] text-slate-500">{sup.department} • {sup.designation || 'Faculty'}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-indigo-600 block">{sup.assignedProjects} Active Groups</span>
                  <span className="text-[10px] text-slate-400">{sup.pendingProposals} pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

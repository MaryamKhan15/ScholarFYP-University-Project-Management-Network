import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Download,
  Sparkles,
  FileCheck2,
  CheckCircle2,
  FolderGit2
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
  Cell,
  Legend
} from 'recharts';

export default function AdminInstitutionalAnalytics() {
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

  const handleExportReport = () => {
    if (!data) return;
    const reportText = `INSTITUTIONAL FYP ANALYTICS REPORT\nGenerated on: ${new Date().toLocaleString()}\n\nSUMMARY:\n- Total Students: ${data.summary.totalStudents}\n- Total Supervisors: ${data.summary.totalSupervisors}\n- Total Projects: ${data.summary.totalProjects}\n- Total Proposals: ${data.summary.totalProposals}\n- Average Degree Progress: ${data.summary.overallAvgProgress}%\n- Total Tasks: ${data.summary.totalTasks} (Completed: ${data.summary.completedTasks})\n\nPROPOSALS BY STATUS:\n- Approved: ${data.proposalsByStatus.Approved || 0}\n- Under Review: ${data.proposalsByStatus['Under Review'] || 0}\n- Changes Required: ${data.proposalsByStatus['Changes Required'] || 0}\n- Submitted: ${data.proposalsByStatus.Submitted || 0}\n- Rejected: ${data.proposalsByStatus.Rejected || 0}\n`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FYP_Institutional_Report_${Date.now()}.txt`;
    a.click();
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading Deep Analytics...</div>;
  if (!data) return <div className="p-8 text-center text-sm text-red-500">Failed to load analytics data.</div>;

  const { summary, proposalsByStatus, categoryStats } = data;

  const proposalChartData = [
    { name: 'Approved', count: proposalsByStatus.Approved || 0, color: '#10b981' },
    { name: 'Under Review', count: proposalsByStatus['Under Review'] || 0, color: '#6366f1' },
    { name: 'Changes Req.', count: proposalsByStatus['Changes Required'] || 0, color: '#f59e0b' },
    { name: 'Submitted', count: proposalsByStatus.Submitted || 0, color: '#3b82f6' },
    { name: 'Rejected', count: proposalsByStatus.Rejected || 0, color: '#ef4444' },
  ];

  const categoryChartData = (categoryStats || []).map((cat, idx) => ({
    name: cat._id || 'General CS',
    value: cat.count || 1,
  }));

  const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" /> Institutional Analytics & Data Visuals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deep-dive visual reporting on FYP proposal clearance rates, domain breakdown, and task ratios.
          </p>
        </div>

        <button
          onClick={handleExportReport}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export Analytics Report
        </button>
      </div>

      {/* Summary Stat Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Proposal Clearance Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {summary.totalProposals > 0
                ? Math.round(((proposalsByStatus.Approved || 0) / summary.totalProposals) * 100)
                : 0}
              %
            </span>
            <span className="text-xs text-slate-400">approved proposals</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Average Degree Milestone Completion</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">{summary.overallAvgProgress}%</span>
            <span className="text-xs text-slate-400">sprint health</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Task Completion Ratio</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-violet-600">
              {summary.completedTasks} / {summary.totalTasks}
            </span>
            <span className="text-xs text-slate-400">tasks done</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Proposal Status Bar Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-600" /> Proposal Status Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={proposalChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]}>
                  {proposalChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Domain Pie Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-600" /> FYP Category & Technology Domains
          </h3>
          <div className="h-72 flex items-center justify-center">
            {categoryChartData.length === 0 ? (
              <p className="text-xs text-slate-400">No project categories logged yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

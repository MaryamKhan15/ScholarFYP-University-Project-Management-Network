import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Search, Filter, ArrowRight, Sparkles } from 'lucide-react';

export default function SupervisorProposalsList() {
  const [proposals, setProposals] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await api.get('/proposals');
      setProposals(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = proposals.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.studentId?.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading proposals...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> FYP Proposals Review Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review student submissions, inspect AI similarity insights, and decide approvals.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search title or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Changes Required">Changes Required</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Project Title & Domain</th>
                <th className="p-4">Student Lead</th>
                <th className="p-4">AI Score</th>
                <th className="p-4">Duplicate Risk</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No proposals match the current filter.
                  </td>
                </tr>
              ) : (
                filtered.map((prop) => (
                  <tr key={prop._id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <span className="font-bold text-slate-900 block">{prop.title}</span>
                      <span className="text-[11px] text-slate-400">{prop.category} • v{prop.version}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 block">{prop.studentId?.name}</span>
                      <span className="text-[11px] text-slate-400">{prop.studentId?.rollNo}</span>
                    </td>
                    <td className="p-4 font-bold text-indigo-600">
                      {prop.aiAnalysis?.clarityScore ? `${prop.aiAnalysis.clarityScore}/100` : 'N/A'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prop.similarityCheck?.similarityLevel === 'High'
                            ? 'bg-red-100 text-red-700'
                            : prop.similarityCheck?.similarityLevel === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {prop.similarityCheck?.similarityLevel || 'Low'} ({prop.similarityCheck?.highestScore || 0}%)
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prop.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : prop.status === 'Changes Required'
                            ? 'bg-amber-100 text-amber-700'
                            : prop.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/supervisor/proposals/${prop._id}`}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1 shadow-xs transition"
                      >
                        Review Desk <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

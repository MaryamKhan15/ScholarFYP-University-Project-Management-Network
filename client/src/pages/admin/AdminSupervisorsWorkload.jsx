import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ShieldCheck,
  Users,
  Search,
  FolderGit2,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

export default function AdminSupervisorsWorkload() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSup, setSelectedSup] = useState(null);
  const [reassignModal, setReassignModal] = useState(null);
  const [targetSupId, setTargetSupId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const aRes = await api.get('/admin/analytics');
      setAnalyticsData(aRes.data.data);
      const pRes = await api.get('/projects');
      setProjects(pRes.data.data);
      const sRes = await api.get('/auth/supervisors');
      setSupervisors(sRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = async () => {
    if (!targetSupId || !reassignModal) return;
    try {
      await api.put(`/admin/projects/${reassignModal._id}/assign-supervisor`, {
        supervisorId: targetSupId,
      });
      setReassignModal(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading supervisor workloads...</div>;

  const workloads = analyticsData?.supervisorWorkloads || [];

  const filteredWorkloads = workloads.filter((sup) =>
    sup.name.toLowerCase().includes(search.toLowerCase()) ||
    (sup.department || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" /> Faculty Supervisor Workload & Allocation Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor group distribution across faculty, prevent supervisor overload, and re-balance student groups.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Faculty Supervisors</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{workloads.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500">Optimal Load (1-3 FYPs)</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">
              {workloads.filter((w) => w.assignedProjects >= 1 && w.assignedProjects <= 3).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500">High Workload (&gt; 3 FYPs)</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">
              {workloads.filter((w) => w.assignedProjects > 3).length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Workload Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Faculty Member</th>
                <th className="p-4">Department</th>
                <th className="p-4">Active FYP Groups</th>
                <th className="p-4">Pending Proposal Reviews</th>
                <th className="p-4">Workload Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredWorkloads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No faculty members found.
                  </td>
                </tr>
              ) : (
                filteredWorkloads.map((sup) => {
                  const loadStatus =
                    sup.assignedProjects === 0
                      ? 'Low Load'
                      : sup.assignedProjects <= 3
                      ? 'Optimal Load'
                      : 'High Load';

                  const supProjects = projects.filter(
                    (p) => (p.supervisorId?._id || p.supervisorId) === sup.id
                  );

                  return (
                    <tr key={sup.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{sup.name}</span>
                        <span className="text-[11px] text-slate-400">{sup.designation || 'Faculty Member'}</span>
                      </td>
                      <td className="p-4">{sup.department || 'Computer Science'}</td>
                      <td className="p-4">
                        <span className="font-bold text-indigo-600 text-sm">{sup.assignedProjects}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-amber-600">{sup.pendingProposals} pending</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            loadStatus === 'Optimal Load'
                              ? 'bg-emerald-100 text-emerald-800'
                              : loadStatus === 'High Load'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {loadStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {supProjects.length > 0 ? (
                          <button
                            onClick={() => {
                              setReassignModal(supProjects[0]);
                              setTargetSupId(sup.id);
                            }}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-bold text-xs transition"
                          >
                            Re-balance Group
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Available</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Modal */}
      {reassignModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Rebalance FYP Group Supervisor</h3>
            <p className="text-xs text-slate-500">
              Reassign project <strong>"{reassignModal.title}"</strong> to a different faculty member.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Faculty Supervisor</label>
              <select
                value={targetSupId}
                onChange={(e) => setTargetSupId(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white"
              >
                {supervisors.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.department} - {s.designation || 'Faculty'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setReassignModal(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleReassign}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

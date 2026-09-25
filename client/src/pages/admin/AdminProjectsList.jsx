import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FolderGit2, Search, Users, Award } from 'lucide-react';

export default function AdminProjectsList() {
  const [projects, setProjects] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [reassignModal, setReassignModal] = useState(null);
  const [newSupervisorId, setNewSupervisorId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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
    if (!newSupervisorId || !reassignModal) return;
    try {
      await api.put(`/admin/projects/${reassignModal._id}/assign-supervisor`, {
        supervisorId: newSupervisorId,
      });
      setReassignModal(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.studentId?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading FYP registry...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-indigo-600" /> FYP Projects Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review active thesis groups, re-assign supervisors, and monitor progress.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search project or student lead..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Project Title & Domain</th>
                <th className="p-4">Student Lead</th>
                <th className="p-4">Assigned Supervisor</th>
                <th className="p-4">Degree Progress</th>
                <th className="p-4">Current Sprint</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((proj) => (
                <tr key={proj._id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{proj.title}</span>
                    <span className="text-[11px] text-slate-400">{proj.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-800 block">{proj.studentId?.name}</span>
                    <span className="text-[11px] text-slate-400">{proj.studentId?.rollNo}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-indigo-600 block">{proj.supervisorId?.name}</span>
                    <span className="text-[11px] text-slate-400">{proj.supervisorId?.designation}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-emerald-600">{proj.progressPercentage}%</span>
                  </td>
                  <td className="p-4 text-slate-500 truncate max-w-xs">{proj.currentMilestone}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setReassignModal(proj);
                        setNewSupervisorId(proj.supervisorId?._id || '');
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl font-bold text-xs transition"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Supervisor Modal */}
      {reassignModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Reassign Project Supervisor</h3>
            <p className="text-xs text-slate-500">
              Select a new faculty supervisor for <strong>"{reassignModal.title}"</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Faculty Member</label>
              <select
                value={newSupervisorId}
                onChange={(e) => setNewSupervisorId(e.target.value)}
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

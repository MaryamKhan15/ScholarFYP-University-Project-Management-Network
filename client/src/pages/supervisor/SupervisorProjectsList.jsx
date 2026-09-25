import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FolderGit2,
  Users,
  Search,
  ArrowRight
} from 'lucide-react';

export default function SupervisorProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.studentId?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading assigned projects...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-indigo-600" /> Assigned Student Projects
          </h1>
          <p className="text-xs text-slate-500 mt-1">Supervise progress, view sprint milestones, and track thesis submissions.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search project or student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Assigned Projects Found</p>
            <p className="text-xs text-slate-400 mt-1">Projects will appear once you approve submitted proposals.</p>
          </div>
        ) : (
          filtered.map((proj) => (
            <div key={proj._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {proj.category}
                  </span>
                  <span className="text-xs font-black text-emerald-600">{proj.progressPercentage}%</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{proj.description}</p>
              </div>

              <div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${proj.progressPercentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Student Lead: <strong className="text-slate-800">{proj.studentId?.name}</strong>
                  </span>
                  <Link
                    to={`/supervisor/projects/${proj._id}`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1 shadow-xs transition"
                  >
                    Supervise <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

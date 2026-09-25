import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Search, ShieldCheck } from 'lucide-react';

export default function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading users registry...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> University User Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage enrolled students, supervisor faculty, and administrative staff.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Roles</option>
            <option value="student">Students</option>
            <option value="supervisor">Supervisors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">User Name & Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Roll / Designation</th>
                <th className="p-4">Skills / Expertise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        u.role === 'admin'
                          ? 'bg-pink-100 text-pink-700'
                          : u.role === 'supervisor'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4">{u.department || 'Computer Science'}</td>
                  <td className="p-4 font-mono">{u.rollNo || u.designation || '—'}</td>
                  <td className="p-4 text-slate-500">
                    {u.skills?.length > 0 ? u.skills.slice(0, 3).join(', ') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

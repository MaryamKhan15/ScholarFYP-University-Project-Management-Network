import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  FolderGit2,
  CheckSquare,
  Milestone,
  Clock,
  FolderArchive,
  Calendar,
  Users,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'student':
        return [
          { name: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Submit Proposal', to: '/student/submit-proposal', icon: Sparkles },
          { name: 'Proposal Status', to: '/student/proposal-status', icon: FileText },
          { name: 'My FYP Project', to: '/student/project', icon: FolderGit2 },
          { name: 'Tasks (Kanban)', to: '/student/tasks', icon: CheckSquare },
          { name: 'Milestones', to: '/student/milestones', icon: Milestone },
          { name: 'Weekly Progress', to: '/student/weekly-progress', icon: Clock },
          { name: 'Documents Repository', to: '/student/documents', icon: FolderArchive },
          { name: 'Meetings', to: '/student/meetings', icon: Calendar },
        ];
      case 'supervisor':
        return [
          { name: 'Supervisor Dashboard', to: '/supervisor/dashboard', icon: LayoutDashboard },
          { name: 'Proposal Review Desk', to: '/supervisor/proposals', icon: FileText },
          { name: 'Assigned Students & FYPs', to: '/supervisor/projects', icon: FolderGit2 },
          { name: 'Progress Monitoring', to: '/supervisor/monitoring', icon: Clock },
          { name: 'Scheduled Meetings', to: '/supervisor/meetings', icon: Calendar },
        ];
      case 'admin':
        return [
          { name: 'Admin Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'Institutional Analytics', to: '/admin/analytics', icon: BarChart3 },
          { name: 'Manage FYP Projects', to: '/admin/projects', icon: FolderGit2 },
          { name: 'Manage Users', to: '/admin/users', icon: Users },
          { name: 'Supervisors Workload', to: '/admin/supervisors', icon: ShieldCheck },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
          <span>{user.role} workspace</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
        </div>
        <nav className="space-y-1.5 mt-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                      <span>{link.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* University Department Card */}
      <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl text-white shadow-md space-y-1">
        <div className="flex items-center space-x-2 text-indigo-300">
          <Award className="w-4 h-4 shrink-0" />
          <span className="text-xs font-black truncate">{user.department || 'Computer Science'}</span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium pt-0.5">
          {user.role === 'student' ? `Roll: ${user.rollNo || 'N/A'}` : user.designation || 'Faculty Member'}
        </p>
      </div>
    </aside>
  );
}

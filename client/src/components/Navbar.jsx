import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  LogOut,
  User,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Menu,
  X,
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
  ShieldCheck,
  Award
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMobileLinks = () => {
    if (!user) return [];
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
          { name: 'Documents', to: '/student/documents', icon: FolderArchive },
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

  const mobileLinks = getMobileLinks();

  return (
    <header ref={navRef} className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            {user && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}

            <Link to={user ? `/${user.role}/dashboard` : '/'} className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-tight">
                  ScholarFYP
                </span>
                <p className="text-[10px] font-semibold text-indigo-600 hidden sm:block">University Project Management Portal</p>
              </div>
            </Link>
          </div>

          {/* Right Navigation & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <>
                {/* User Role Badge */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-pink-500' : user.role === 'supervisor' ? 'bg-violet-500' : 'bg-emerald-500'}`}></span>
                  {user.role}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowProfileMenu(false);
                    }}
                    className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl relative transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in duration-200">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-xs uppercase tracking-wider text-slate-800">Notifications ({unreadCount} new)</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">No notifications yet</div>
                        ) : (
                          notifications.slice(0, 8).map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                markAsRead(n._id);
                                if (n.link) {
                                  navigate(n.link);
                                  setShowNotifications(false);
                                }
                              }}
                              className={`p-3.5 text-xs hover:bg-slate-50 cursor-pointer transition ${
                                !n.isRead ? 'bg-indigo-50/60' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-bold text-slate-800">{n.title}</span>
                                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                      <div className="text-[10px] text-indigo-600 uppercase font-extrabold tracking-wider">{user.role}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Signed in as</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-bold flex items-center space-x-2 transition mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-5 py-2.5 rounded-xl shadow-md shadow-indigo-500/25 transition hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      {user && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {user.role} Navigation
          </div>
          {mobileLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

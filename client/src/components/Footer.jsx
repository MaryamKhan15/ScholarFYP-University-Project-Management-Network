import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Heart,
  ShieldCheck,
  Globe,
  Mail,
  Award,
  ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans mt-auto">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight block leading-tight">
                  ScholarFYP
                </span>
                <p className="text-[10px] font-semibold text-indigo-400">University Project Management Portal</p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              An intelligent academic management & monitoring platform empowering university students, faculty supervisors, and departmental coordinators to streamline the complete Final Year Project lifecycle.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                System Online
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono text-[11px]">v1.0.0 Release</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Platform Portals</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/student/dashboard" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Student Workspace <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/supervisor/dashboard" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Supervisor Desk <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-indigo-400 transition flex items-center gap-1">
                  Institutional Admin <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-indigo-400 transition">
                  Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Core Modules</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="hover:text-slate-200 transition">AI Proposal Pre-Check</li>
              <li className="hover:text-slate-200 transition">Duplicate Topic Detector</li>
              <li className="hover:text-slate-200 transition">Sprint Kanban Task Board</li>
              <li className="hover:text-slate-200 transition">Weekly Progress Monitoring</li>
              <li className="hover:text-slate-200 transition">7-Phase Academic Milestones</li>
            </ul>
          </div>

          {/* University Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Institutional Info</h4>
            <div className="space-y-2 text-xs text-slate-400 font-medium">
              <p className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Department of CS & SE</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-violet-400 shrink-0" />
                <span>University Academic Committee</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <span>support@scholarfyp.edu.pk</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
          <p>© 2026 ScholarFYP Academic Network. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 transition cursor-pointer">Academic Guidelines</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

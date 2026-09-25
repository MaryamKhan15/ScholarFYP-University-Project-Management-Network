import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award,
  Layers,
  SearchCheck,
  Calendar,
  ChevronRight,
  FolderGit2,
  Zap,
  CheckCircle2,
  Lock,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('student');
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const rolesRef = useRef(null);
  const aiRef = useRef(null);

  useEffect(() => {
    // GSAP Entrance Animations
    const ctx = gsap.context(() => {
      // Hero elements stagger animation
      gsap.fromTo(
        '.gsap-hero-item',
        { opacity: 0, y: 35, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );

      // Metric Strip animation
      gsap.fromTo(
        '.gsap-stat-item',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: 'power2.out',
        }
      );

      // AI Banner card float in
      gsap.fromTo(
        aiRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.6,
          ease: 'power3.out',
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="bg-slate-50 min-h-screen overflow-hidden selection:bg-indigo-600 selection:text-white">
      {/* Background Decorative Animated Glow Spheres */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-pink-500/15 blur-3xl pointer-events-none animate-pulse-glow"></div>
      <div className="absolute top-96 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-96 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated pill badge */}
            <div className="gsap-hero-item inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50/90 via-violet-50/90 to-pink-50/90 border border-indigo-200/80 text-indigo-700 text-xs font-extrabold mb-8 shadow-sm backdrop-blur-md animate-float">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Next-Generation University FYP Platform</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <h1 className="gsap-hero-item text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
              ScholarFYP <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent drop-shadow-xs">
                University Project Management Network
              </span>
            </h1>

            <p className="gsap-hero-item mt-8 text-base sm:text-xl text-slate-600 leading-relaxed font-medium max-w-3xl mx-auto">
              Transforming scattered manual Final Year Projects into an intelligent, centralized platform.
              Featuring real-time AI proposal analysis, duplicate topic detection, automated milestones, and full-stack supervisor workflows.
            </p>

            {/* CTA Action Buttons */}
            <div className="gsap-hero-item mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 glow-indigo"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-9 py-4.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-extrabold text-sm shadow-sm transition-all duration-300 hover:scale-105"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges Metric Strip */}
      <section ref={statsRef} className="py-12 bg-white border-y border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="gsap-stat-item p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:scale-105 transition-transform">
              <span className="text-3xl font-black text-indigo-600 block">100%</span>
              <span className="text-xs font-bold text-slate-600 mt-1 block">Full-Stack Digitalized Workflow</span>
            </div>
            <div className="gsap-stat-item p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:scale-105 transition-transform">
              <span className="text-3xl font-black text-violet-600 block">AI Layer</span>
              <span className="text-xs font-bold text-slate-600 mt-1 block">Proposal Quality & Duplicate Checker</span>
            </div>
            <div className="gsap-stat-item p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:scale-105 transition-transform">
              <span className="text-3xl font-black text-pink-600 block">3 Roles</span>
              <span className="text-xs font-bold text-slate-600 mt-1 block">Student, Supervisor, Admin Portals</span>
            </div>
            <div className="gsap-stat-item p-4 rounded-2xl bg-slate-50/60 border border-slate-100 hover:scale-105 transition-transform">
              <span className="text-3xl font-black text-emerald-600 block">7-Phase</span>
              <span className="text-xs font-bold text-slate-600 mt-1 block">Automated Academic Milestones</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Role Breakdown Section */}
      <section ref={rolesRef} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Tailored For Every Academic Role</h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
              Select a user perspective below to see its customized workflow features.
            </p>

            {/* Role Tab Buttons */}
            <div className="flex justify-center gap-2 mt-8 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-md max-w-lg mx-auto">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  activeTab === 'student'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md glow-indigo'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                1. Student Portal
              </button>
              <button
                onClick={() => setActiveTab('supervisor')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  activeTab === 'supervisor'
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                2. Supervisor Desk
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                3. Admin / Coord
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="max-w-5xl mx-auto glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/80">
            {activeTab === 'student' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Student FYP Experience</h3>
                    <p className="text-xs text-slate-500 font-medium">From initial proposal drafting to final thesis defense</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-indigo-600 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" /> Live AI Proposal Quality Pre-Check
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Evaluates clarity score (0-100), SMART objectives, and structural consistency before final submission to supervisor.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-indigo-600 flex items-center gap-2">
                      <SearchCheck className="w-4 h-4 text-indigo-600" /> Duplicate Topic Similarity Detector
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Compares problem formulations against past university semester databases to avoid topic duplication.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-indigo-600 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" /> Kanban Sprint Task Management
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Organize tasks into To Do, In Progress, and Completed columns with group partner assignments.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-indigo-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" /> Weekly Progress Reports & Logs
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Submit weekly accomplishments, hurdles faced, next sprint targets, and receive supervisor feedback.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'supervisor' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-violet-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
                    <FileCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Faculty Supervisor Review Desk</h3>
                    <p className="text-xs text-slate-500 font-medium">Streamlined proposal evaluation and student monitoring</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-violet-600 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-violet-600" /> Proposal Review Desk
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Review proposals with side-by-side AI insights, similarity scores, and one-click Approve or Revise actions.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-violet-600 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-violet-600" /> Dedicated Progress Monitoring Desk
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Evaluate weekly progress logs across all assigned groups and assign 1-5 star ratings and advice.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-violet-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-violet-600" /> Advisory Meetings & Minutes
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Schedule consultation meetings, track agendas, and maintain advisory minutes history.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-violet-600 flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-violet-600" /> Milestone Verification & Artifacts
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Verify completion of degree milestones and thesis document versions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-pink-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-pink-500/30">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Admin & Institutional Oversight</h3>
                    <p className="text-xs text-slate-500 font-medium">Departmental analytics and faculty workload management</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-pink-600 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-pink-600" /> Institutional Analytics & Charts
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Visual Recharts bar and pie charts for proposal clearance, category breakdown, and degree progress.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-pink-600 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-pink-600" /> Faculty Workload Allocation Desk
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Monitor supervisor workloads, identify overload risks, and reassign project groups.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-pink-600 flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-600" /> University User Directory
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Manage enrolled students, supervisors, and coordinators with role filter controls.
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-1.5">
                    <span className="font-extrabold text-pink-600 flex items-center gap-2">
                      <Award className="w-4 h-4 text-pink-600" /> Exportable Official Reports
                    </span>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      Generate and export institutional FYP summary reports in text/CSV format.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI Assistant Banner Section */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={aiRef} className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden glow-indigo">
            <div className="relative z-10 max-w-3xl">
              <span className="text-indigo-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <BrainCircuit className="w-4.5 h-4.5" /> Built-in AI Intelligent Layer
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-3">
                Intelligent Assistant, Not a Black-Box Decision Maker
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed font-medium">
                Our AI operates strictly as a supportive assistant to enhance proposal clarity and recommend milestone roadmaps. Final decision authority always remains 100% with faculty supervisors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 relative z-10">
              <div className="glass-dark rounded-2xl p-6 hover:border-indigo-400/40 transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-black text-base text-indigo-300">Proposal Quality Scoring</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  Evaluates clarity score (0-100), SMART objectives feasibility, and highlights missing scope boundaries.
                </p>
              </div>
              <div className="glass-dark rounded-2xl p-6 hover:border-violet-400/40 transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-black text-base text-violet-300">Duplicate Topic Detection</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  Performs semantic Jaccard matching across past semester FYPs to prevent duplicate topic registration.
                </p>
              </div>
              <div className="glass-dark rounded-2xl p-6 hover:border-pink-400/40 transition-all duration-300 hover:-translate-y-1">
                <h4 className="font-black text-base text-pink-300">AI Milestone Auto-Planner</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                  Generates an 7-phase academic timeline adapted to the chosen technical stack and domain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

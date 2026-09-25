import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  FileText,
  MessageSquare,
  Award,
  Users
} from 'lucide-react';

export default function SupervisorProjectDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewReport = async (reportId) => {
    if (!reviewComment.trim()) return;
    try {
      await api.put(`/progress-reports/${reportId}/review`, {
        comment: reviewComment,
        rating: 5,
        status: 'Reviewed',
      });
      setReviewComment('');
      setSelectedReportId(null);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading project oversight...</div>;
  if (!data?.project) return <div className="p-8 text-center text-sm text-red-500">Project record not found.</div>;

  const { project, tasks, milestones, reports, documents, meetings } = data;

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {project.status}
              </span>
              <span className="text-xs font-semibold text-indigo-600">{project.category}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{project.title}</h1>
            <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">{project.description}</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 text-right min-w-[170px]">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
              Cumulative Progress
            </span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{project.progressPercentage}%</span>
            <div className="w-full bg-indigo-200/60 h-2 rounded-full mt-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${project.progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Milestones & Weekly Progress Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestones Road */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" /> Milestone Verification Road
          </h3>

          <div className="space-y-3">
            {milestones.map((m) => (
              <div key={m._id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{m.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : m.status === 'In Progress'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {m.status} ({m.progressPercentage}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{m.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress Feed & Supervisor Review */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> Weekly Logs & Supervisor Feedback
          </h3>

          <div className="space-y-4">
            {reports.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No weekly progress logs submitted yet.</p>
            ) : (
              reports.map((r) => (
                <div key={r._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Week #{r.weekNumber} Log</span>
                    <span className="text-indigo-600">Progress: {r.progressPercentEstimate}%</span>
                  </div>

                  <div className="text-[11px] text-slate-600">
                    <strong>Completed:</strong> {r.completedWork.join(', ')}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    <strong>Next Plan:</strong> {r.nextPlan.join(', ')}
                  </div>

                  {r.supervisorFeedback?.comment ? (
                    <div className="mt-2 p-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-900 text-[11px]">
                      <strong>Your Feedback:</strong> {r.supervisorFeedback.comment}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200">
                      {selectedReportId === r._id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Enter review feedback..."
                            className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReviewReport(r._id)}
                              className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[11px]"
                            >
                              Post Feedback
                            </button>
                            <button
                              onClick={() => setSelectedReportId(null)}
                              className="px-3 py-1 border border-slate-300 text-slate-600 rounded-lg text-[11px]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedReportId(r._id)}
                          className="text-xs text-indigo-600 font-bold hover:underline"
                        >
                          + Give Supervisor Feedback
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

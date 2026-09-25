import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Clock,
  Plus,
  Send,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function StudentProgress() {
  const [projectData, setProjectData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    weekNumber: 1,
    completedWork: '',
    currentWork: '',
    problemsFaced: '',
    nextPlan: '',
    progressPercentEstimate: 50,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projRes = await api.get('/projects/my');
      setProjectData(projRes.data.data.project);
      const repRes = await api.get(`/progress-reports/project/${projRes.data.data.project._id}`);
      setReports(repRes.data.data);
      if (repRes.data.data.length > 0) {
        setFormData((prev) => ({ ...prev, weekNumber: repRes.data.data[0].weekNumber + 1 }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectData) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        projectId: projectData._id,
        completedWork: formData.completedWork.split('\n').filter(Boolean),
        currentWork: formData.currentWork.split('\n').filter(Boolean),
        nextPlan: formData.nextPlan.split('\n').filter(Boolean),
      };

      await api.post('/progress-reports', payload);
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading progress log...</div>;

  if (!projectData) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">Project Not Active Yet</p>
        <p className="text-xs text-slate-500 mt-1">Weekly progress reports require an approved FYP project.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" /> Weekly Progress Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit regular progress logs and receive timely feedback from your supervisor.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Submit Weekly Log
        </button>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Weekly Progress Logged Yet</p>
            <p className="text-xs text-slate-400 mt-1">Log your first weekly milestone accomplishments above.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    W{report.weekNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Week #{report.weekNumber} Progress Report</h3>
                    <span className="text-[11px] text-slate-400">
                      Logged on {new Date(report.submissionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 block">
                    Estimate: {report.progressPercentEstimate}%
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      report.supervisorFeedback?.status === 'Reviewed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {report.supervisorFeedback?.status || 'Pending Review'}
                  </span>
                </div>
              </div>

              {/* Work Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider">
                    Completed This Week
                  </span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {report.completedWork.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-700 block mb-1 text-[11px] uppercase tracking-wider">
                    Next Week's Plan
                  </span>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    {report.nextPlan.map((np, i) => (
                      <li key={i}>{np}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Problems Faced */}
              {report.problemsFaced && report.problemsFaced !== 'None' && (
                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-xs">
                  <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider mb-0.5">
                    Hurdles & Blockers
                  </span>
                  <p className="text-amber-800">{report.problemsFaced}</p>
                </div>
              )}

              {/* Supervisor Feedback Note */}
              {report.supervisorFeedback?.comment && (
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Supervisor Feedback (Rating: {report.supervisorFeedback.rating || 5}/5)</span>
                  </div>
                  <p className="text-slate-700 pl-5">{report.supervisorFeedback.comment}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Submit Weekly FYP Log</h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Week Number *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={30}
                    value={formData.weekNumber}
                    onChange={(e) => setFormData({ ...formData, weekNumber: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Progress (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.progressPercentEstimate}
                    onChange={(e) => setFormData({ ...formData, progressPercentEstimate: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Completed This Week (1 per line) *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.completedWork}
                  onChange={(e) => setFormData({ ...formData, completedWork: e.target.value })}
                  placeholder="e.g. Connected MongoDB&#10;Added Login API with JWT"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Week's Target Tasks (1 per line) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.nextPlan}
                  onChange={(e) => setFormData({ ...formData, nextPlan: e.target.value })}
                  placeholder="e.g. Build supervisor approval desk"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hurdles / Difficulties Faced (if any)</label>
                <input
                  type="text"
                  value={formData.problemsFaced}
                  onChange={(e) => setFormData({ ...formData, problemsFaced: e.target.value })}
                  placeholder="e.g. Token expiration bug, resolved via middleware"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-200"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

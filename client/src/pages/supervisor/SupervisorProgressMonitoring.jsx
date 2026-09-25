import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Clock,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Star,
  Search,
  Filter,
  User,
  FolderGit2
} from 'lucide-react';

export default function SupervisorProgressMonitoring() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  // Rating & feedback form state per report
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewStatus, setReviewStatus] = useState('Reviewed');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSupervisorReports();
  }, []);

  const fetchSupervisorReports = async () => {
    try {
      const res = await api.get('/progress-reports/supervisor');
      setReports(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostFeedback = async (reportId) => {
    if (!feedbackText.trim()) {
      alert('Please enter supervisor remarks or instructions.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/progress-reports/${reportId}/review`, {
        comment: feedbackText,
        rating: Number(rating),
        status: reviewStatus,
      });
      setActiveReviewId(null);
      setFeedbackText('');
      fetchSupervisorReports();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const studentName = r.studentId?.name || '';
    const projTitle = r.projectId?.title || '';
    const matchesSearch =
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      projTitle.toLowerCase().includes(search.toLowerCase());

    const currentStatus = r.supervisorFeedback?.status || 'Pending Review';
    const matchesStatus = filterStatus === 'ALL' || currentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading progress monitoring desk...</div>;

  const pendingCount = reports.filter((r) => (r.supervisorFeedback?.status || 'Pending Review') === 'Pending Review').length;
  const reviewedCount = reports.filter((r) => r.supervisorFeedback?.status === 'Reviewed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" /> Weekly Progress Monitoring Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Evaluate weekly student progress reports, review sprint accomplishments, and provide grades/feedback.
          </p>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-slate-200 rounded-xl text-xs bg-white"
          >
            <option value="ALL">All Reports</option>
            <option value="Pending Review">Pending Review ({pendingCount})</option>
            <option value="Reviewed">Reviewed ({reviewedCount})</option>
            <option value="Needs Discussion">Needs Discussion</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Submissions</span>
            <span className="text-2xl font-black text-slate-900 block mt-1">{reports.length}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500">Pending Evaluation</span>
            <span className="text-2xl font-black text-amber-600 block mt-1">{pendingCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold text-slate-500">Graded & Reviewed</span>
            <span className="text-2xl font-black text-emerald-600 block mt-1">{reviewedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Weekly Submissions Found</p>
            <p className="text-xs text-slate-400 mt-1">Weekly reports submitted by students will appear here for your review.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const currentStatus = report.supervisorFeedback?.status || 'Pending Review';
            const isPending = currentStatus === 'Pending Review';

            return (
              <div
                key={report._id}
                className={`bg-white rounded-3xl border p-6 shadow-xs space-y-4 transition ${
                  isPending ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200/80'
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px]">
                        Week #{report.weekNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{report.projectId?.title}</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Student: <strong className="text-slate-800">{report.studentId?.name}</strong> ({report.studentId?.rollNo}) • {new Date(report.submissionDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-indigo-600">
                      Estimate: {report.progressPercentEstimate}%
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        currentStatus === 'Reviewed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : currentStatus === 'Needs Discussion'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                </div>

                {/* Accomplishments & Next Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                      Work Completed This Week:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {report.completedWork.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                      Next Week's Sprint Target:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {report.nextPlan.map((np, idx) => (
                        <li key={idx}>{np}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Hurdles */}
                {report.problemsFaced && report.problemsFaced !== 'None' && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs">
                    <span className="font-bold text-amber-900 block text-[10px] uppercase tracking-wider mb-0.5">
                      Reported Hurdles / Technical Issues:
                    </span>
                    <p className="text-amber-800">{report.problemsFaced}</p>
                  </div>
                )}

                {/* Feedback Section */}
                <div className="pt-2 border-t border-slate-100">
                  {report.supervisorFeedback?.comment && activeReviewId !== report._id ? (
                    <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs space-y-1">
                      <div className="flex justify-between items-center font-bold text-indigo-950">
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                          Supervisor Feedback
                        </span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-slate-800 font-bold">{report.supervisorFeedback.rating || 5}/5</span>
                        </div>
                      </div>
                      <p className="text-slate-700">{report.supervisorFeedback.comment}</p>
                      <button
                        onClick={() => {
                          setActiveReviewId(report._id);
                          setFeedbackText(report.supervisorFeedback.comment);
                          setRating(report.supervisorFeedback.rating || 5);
                          setReviewStatus(report.supervisorFeedback.status || 'Reviewed');
                        }}
                        className="text-[11px] text-indigo-600 font-bold hover:underline pt-1 block"
                      >
                        Edit Feedback
                      </button>
                    </div>
                  ) : activeReviewId === report._id ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-3">
                      <h4 className="font-bold text-slate-800">Provide Supervisor Grade & Remarks</h4>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Weekly Rating (1 to 5 Stars)</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="p-2 border border-slate-200 rounded-xl bg-white text-xs"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5 - Outstanding)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5 - Good Progress)</option>
                          <option value={3}>⭐⭐⭐ (3/5 - Satisfactory)</option>
                          <option value={2}>⭐⭐ (2/5 - Needs Improvement)</option>
                          <option value={1}>⭐ (1/5 - Unsatisfactory)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Status Action</label>
                        <select
                          value={reviewStatus}
                          onChange={(e) => setReviewStatus(e.target.value)}
                          className="p-2 border border-slate-200 rounded-xl bg-white text-xs"
                        >
                          <option value="Reviewed">Reviewed & Approved</option>
                          <option value="Needs Discussion">Needs Discussion / Meeting</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Supervisor Comments / Guidance *</label>
                        <textarea
                          rows={3}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Write guidance or suggestions for next week..."
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveReviewId(null)}
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-xl font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handlePostFeedback(report._id)}
                          className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl font-bold shadow-xs"
                        >
                          {submitting ? 'Saving...' : 'Submit Feedback'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReviewId(report._id);
                        setFeedbackText('');
                        setRating(5);
                        setReviewStatus('Reviewed');
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition inline-flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Grade & Review This Log
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

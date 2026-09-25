import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function StudentMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    locationOrLink: 'Supervisor Office',
    agenda: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const meetRes = await api.get('/meetings');
      setMeetings(meetRes.data.data);
      const projRes = await api.get('/projects/my');
      setProjectData(projRes.data.data.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!projectData) return;
    try {
      await api.post('/meetings', {
        ...newMeeting,
        projectId: projectData._id,
        supervisorId: projectData.supervisorId?._id || projectData.supervisorId,
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading meeting schedule...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" /> FYP Advisory Meetings
          </h1>
          <p className="text-xs text-slate-500 mt-1">Schedule consultations, record minutes, and track upcoming deadlines.</p>
        </div>

        {projectData && (
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Request Meeting
          </button>
        )}
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No Meetings Scheduled</p>
            <p className="text-xs text-slate-400 mt-1">Request a meeting with your supervisor above.</p>
          </div>
        ) : (
          meetings.map((m) => (
            <div key={m._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{m.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4 text-indigo-600" /> {m.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-indigo-600" /> {m.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-indigo-600" /> {m.locationOrLink}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    m.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : m.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              {m.agenda && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                  <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">Agenda:</strong>
                  {m.agenda}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Request Meeting With Supervisor</h3>

            <form onSubmit={handleSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Topic *</label>
                <input
                  type="text"
                  required
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="e.g. Mid-term architecture review"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    placeholder="e.g. 02:00 PM"
                    className="w-full p-2.5 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue / Online Link</label>
                <input
                  type="text"
                  value={newMeeting.locationOrLink}
                  onChange={(e) => setNewMeeting({ ...newMeeting, locationOrLink: e.target.value })}
                  placeholder="e.g. Faculty Office 204 or Google Meet link"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Agenda</label>
                <textarea
                  rows={2}
                  value={newMeeting.agenda}
                  onChange={(e) => setNewMeeting({ ...newMeeting, agenda: e.target.value })}
                  placeholder="Topics to discuss..."
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
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-200"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

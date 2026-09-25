import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  Flag,
  ChevronRight
} from 'lucide-react';

export default function StudentTasks() {
  const [projectData, setProjectData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    assignedTo: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/projects/my');
      setProjectData(res.data.data.project);
      setTasks(res.data.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!projectData) return;
    try {
      const res = await api.post('/projects/tasks', {
        ...newTask,
        projectId: projectData._id,
      });
      setTasks([res.data.data, ...tasks]);
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'To Do', assignedTo: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/projects/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === taskId ? res.data.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/projects/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading Task Board...</div>;

  if (!projectData) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-700">Project Not Approved Yet</p>
        <p className="text-xs text-slate-500 mt-1">Tasks can be created once your supervisor approves your FYP proposal.</p>
      </div>
    );
  }

  const columns = ['To Do', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" /> FYP Task Management Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">Organize your sprints, assign group members, and track status.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-200 transition inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col);
          return (
            <div key={col} className="bg-slate-100/70 p-4 rounded-3xl border border-slate-200/60 min-h-[450px] flex flex-col">
              <div className="flex justify-between items-center mb-3 px-2">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">{col}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-white text-slate-600 rounded-full border border-slate-200">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                    No tasks in {col}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task._id}
                      className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition text-xs space-y-2.5"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-slate-900 leading-snug">{task.title}</span>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="text-slate-300 hover:text-red-500 transition"
                          title="Delete Task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {task.description && (
                        <p className="text-slate-500 text-[11px] line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full ${
                            task.priority === 'Urgent'
                              ? 'bg-red-100 text-red-700'
                              : task.priority === 'High'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="text-slate-500 font-medium truncate max-w-[120px]">
                          {task.assignedTo || 'Unassigned'}
                        </span>
                      </div>

                      {/* Move status buttons */}
                      <div className="flex gap-1 pt-1 justify-end">
                        {col !== 'To Do' && (
                          <button
                            onClick={() => updateTaskStatus(task._id, 'To Do')}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] font-bold"
                          >
                            To Do
                          </button>
                        )}
                        {col !== 'In Progress' && (
                          <button
                            onClick={() => updateTaskStatus(task._id, 'In Progress')}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold"
                          >
                            Progress
                          </button>
                        )}
                        {col !== 'Completed' && (
                          <button
                            onClick={() => updateTaskStatus(task._id, 'Completed')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold"
                          >
                            Done
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Create New Project Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Implement API route for proposal review"
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Additional technical details..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Partner</label>
                <input
                  type="text"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  placeholder="e.g. Hamza Khan"
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md shadow-indigo-200"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

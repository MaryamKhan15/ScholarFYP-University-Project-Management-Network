import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Public pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitProposal from './pages/student/SubmitProposal';
import ProposalStatus from './pages/student/ProposalStatus';
import StudentProject from './pages/student/StudentProject';
import StudentTasks from './pages/student/StudentTasks';
import StudentMilestones from './pages/student/StudentMilestones';
import StudentProgress from './pages/student/StudentProgress';
import StudentDocuments from './pages/student/StudentDocuments';
import StudentMeetings from './pages/student/StudentMeetings';

// Supervisor pages
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import SupervisorProposalsList from './pages/supervisor/SupervisorProposalsList';
import SupervisorReviewDesk from './pages/supervisor/SupervisorReviewDesk';
import SupervisorProjectsList from './pages/supervisor/SupervisorProjectsList';
import SupervisorProjectDetails from './pages/supervisor/SupervisorProjectDetails';
import SupervisorProgressMonitoring from './pages/supervisor/SupervisorProgressMonitoring';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInstitutionalAnalytics from './pages/admin/AdminInstitutionalAnalytics';
import AdminSupervisorsWorkload from './pages/admin/AdminSupervisorsWorkload';
import AdminProjectsList from './pages/admin/AdminProjectsList';
import AdminUsersList from './pages/admin/AdminUsersList';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-12 text-center text-xs text-slate-400">Authenticating...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }
  return children;
};

// Layout with Sidebar & Footer
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                  <Navbar />
                  <LandingPage />
                  <Footer />
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                  <Navbar />
                  <LoginPage />
                  <Footer />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
                  <Navbar />
                  <RegisterPage />
                  <Footer />
                </div>
              }
            />

            {/* Student Protected Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <StudentDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/submit-proposal"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <SubmitProposal />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/proposal-status"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <ProposalStatus />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/project"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <StudentProject />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/tasks"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <StudentTasks />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/milestones"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <StudentMilestones />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/weekly-progress"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <StudentProgress />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/documents"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <StudentDocuments />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/meetings"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AppLayout>
                    <StudentMeetings />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Supervisor Protected Routes */}
            <Route
              path="/supervisor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <AppLayout>
                    <SupervisorDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor/proposals"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <AppLayout>
                    <SupervisorProposalsList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor/proposals/:id"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <AppLayout>
                    <SupervisorReviewDesk />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor/projects"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <AppLayout>
                    <SupervisorProjectsList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor/projects/:id"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <AppLayout>
                    <SupervisorProjectDetails />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor/monitoring"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <AppLayout>
                    <SupervisorProgressMonitoring />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/supervisor/meetings"
              element={
                <ProtectedRoute allowedRoles={['supervisor']}>
                  <AppLayout>
                    <StudentMeetings />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout>
                    <AdminInstitutionalAnalytics />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout>
                    <AdminProjectsList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout>
                    <AdminUsersList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/supervisors"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout>
                    <AdminSupervisorsWorkload />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

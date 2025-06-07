
import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from './contexts/AuthContext';

// Lazy loading des composants principaux
const HomePage = lazy(() => import('./components/HomePage'));
const Explorer = lazy(() => import('./components/Explorer'));
const MissionDetails = lazy(() => import('./components/missions/MissionDetails'));
const Profile = lazy(() => import('./components/Profile'));
const MyMissions = lazy(() => import('./components/MyMissions'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const SignUpForm = lazy(() => import('./components/auth/SignUpForm'));
const SignInForm = lazy(() => import('./components/auth/SignInForm'));
const MobileApp = lazy(() => import('./components/MobileApp'));

// Lazy loading des composants association
const AssociationDashboard = lazy(() => import('./components/AssociationDashboard'));
const MissionManagement = lazy(() => import('./components/MissionManagement'));
const AssociationSettings = lazy(() => import('./components/AssociationSettings'));
const AssociationMembers = lazy(() => import('./components/AssociationMembers'));
const ImpactReportsPage = lazy(() => import('./components/ImpactReportsPage'));
const MissionForm = lazy(() => import('./components/MissionForm'));

// Composants non lazy-loaded
import Notifications from './components/notifications/Notifications';
import Messages from './components/messages/Messages';

const ProtectedRoute: React.FC<{ children: JSX.Element, allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'association' ? '/association' : '/app'} replace />;
  }

  return children;
};

function App() {
  return (
    <div className="App min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<Explorer />} />
          <Route path="/missions/:id" element={<MissionDetails />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<SignInForm />} />

          {/* Application mobile principale pour les bénévoles connectés */}
          <Route path="/app" element={
            <ProtectedRoute allowedRoles={['benevole']}>
              <MobileApp />
            </ProtectedRoute>
          } />

          {/* Routes protégées pour les bénévoles (compatibilité) */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['benevole']}>
              <Dashboard view="dashboard" onViewChange={() => {}} />
            </ProtectedRoute>
          } />
          <Route path="/my-missions" element={
            <ProtectedRoute allowedRoles={['benevole']}>
              <MyMissions />
            </ProtectedRoute>
          } />
          <Route path="/profile/:userId" element={<Profile />} />

          {/* Routes protégées communes */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />

          {/* Routes protégées pour les associations */}
          <Route path="/association" element={
            <ProtectedRoute allowedRoles={['association']}>
              <AssociationDashboard />
            </ProtectedRoute>
          } />
          <Route path="/association/missions/new" element={
            <ProtectedRoute allowedRoles={['association']}>
              <MissionForm />
            </ProtectedRoute>
          } />
          <Route path="/association/missions/:missionId" element={
            <ProtectedRoute allowedRoles={['association']}>
              <MissionManagement />
            </ProtectedRoute>
          } />
          <Route path="/association/missions/:missionId/edit" element={
            <ProtectedRoute allowedRoles={['association']}>
              <MissionForm />
            </ProtectedRoute>
          } />
          <Route path="/association/settings" element={
            <ProtectedRoute allowedRoles={['association']}>
              <AssociationSettings />
            </ProtectedRoute>
          } />
          <Route path="/association/members" element={
            <ProtectedRoute allowedRoles={['association']}>
              <AssociationMembers />
            </ProtectedRoute>
          } />
          <Route path="/association/impact-reports" element={
            <ProtectedRoute allowedRoles={['association']}>
              <ImpactReportsPage />
            </ProtectedRoute>
          } />

          {/* Route par défaut */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Toaster />
    </div>
  );
}

export default App;

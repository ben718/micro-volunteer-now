import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth, AuthProvider } from './contexts/AuthContext';

// Lazy loading des composants principaux et pages
const HomePage = lazy(() => import('./components/HomePage'));
const Explorer = lazy(() => import('./components/Explorer'));
const MissionDetails = lazy(() => import('./components/missions/MissionDetails'));
const Profile = lazy(() => import('./components/Profile'));
const MyMissions = lazy(() => import('./components/MyMissions'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const SignUpForm = lazy(() => import('./components/auth/SignUpForm'));
const SignInForm = lazy(() => import('./components/auth/SignInForm'));

// Lazy loading des composants association
const AssociationDashboard = lazy(() => import('./components/AssociationDashboard'));
const MissionManagement = lazy(() => import('./components/MissionManagement').then(module => ({ default: module.MissionManagement })));
const AssociationSettings = lazy(() => import('./components/AssociationSettings').then(module => ({ default: module.AssociationSettings })));
const AssociationMembers = lazy(() => import('./components/AssociationMembers').then(module => ({ default: module.AssociationMembers })));
const ImpactReportsPage = lazy(() => import('./components/ImpactReportsPage').then(module => ({ default: module.ImpactReportsPage })));
const MissionForm = lazy(() => import('./components/MissionForm').then(module => ({ default: module.MissionForm })));

// Les composants Messages et Notifications ne sont pas lazy-loaded ici
import Notifications from './components/notifications/Notifications';
import Messages from './components/messages/Messages';

const ProtectedRoute: React.FC<{ children: JSX.Element, allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'association' ? '/association' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dashboardView, setDashboardView] = useState<'dashboard' | 'explore' | 'missions' | 'profile'>('dashboard');

  // Fonction pour gérer le "Get Started" sur la page d'accueil
  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'association' ? '/association' : '/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="App">
      <AuthProvider>
        <Suspense fallback={<div>Chargement...</div>}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage onGetStarted={handleGetStarted} />} />
            <Route path="/explore" element={<Explorer />} />
            <Route path="/missions/:id" element={<MissionDetails />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<SignInForm />} />

            {/* Routes protégées */}
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

            {/* Routes protégées pour les bénévoles */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['benevole']}><Dashboard view={dashboardView} onViewChange={setDashboardView} /></ProtectedRoute>} />
            <Route path="/my-missions" element={<ProtectedRoute allowedRoles={['benevole']}><MyMissions /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<Profile />} />

            {/* Routes protégées pour les associations */}
            <Route path="/association" element={<ProtectedRoute allowedRoles={['association']}><AssociationDashboard /></ProtectedRoute>} />
            <Route path="/association/missions/new" element={<ProtectedRoute allowedRoles={['association']}><MissionForm /></ProtectedRoute>} />
            <Route path="/association/missions/:missionId" element={<ProtectedRoute allowedRoles={['association']}><MissionManagement /></ProtectedRoute>} />
            <Route path="/association/missions/:missionId/edit" element={<ProtectedRoute allowedRoles={['association']}><MissionForm /></ProtectedRoute>} />
            <Route path="/association/settings" element={<ProtectedRoute allowedRoles={['association']}><AssociationSettings /></ProtectedRoute>} />
            <Route path="/association/members" element={<ProtectedRoute allowedRoles={['association']}><AssociationMembers /></ProtectedRoute>} />
            <Route path="/association/impact-reports" element={<ProtectedRoute allowedRoles={['association']}><ImpactReportsPage /></ProtectedRoute>} />

            {/* Route par défaut ou 404 */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </div>
  );
}

export default App;

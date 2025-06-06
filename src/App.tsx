import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from './contexts/AuthContext';

// Lazy loading des composants principaux et pages
const HomePage = lazy(() => import('./components/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const MissionDetailsPage = lazy(() => import('./pages/MissionDetailsPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const MyMissionsPage = lazy(() => import('./pages/MyMissionsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Lazy loading des composants association
const AssociationDashboard = lazy(() => import('@/components/AssociationDashboard'));
const MissionManagement = lazy(() => import('@/components/MissionManagement'));
const AssociationSettings = lazy(() => import('@/components/AssociationSettings'));
const AssociationMembers = lazy(() => import('@/components/AssociationMembers'));
const ImpactReportsPage = lazy(() => import('@/components/ImpactReportsPage'));
const MissionForm = lazy(() => import('@/components/MissionForm'));

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

  if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Rediriger vers une page d'accès refusé ou le tableau de bord approprié
      // Assurez-vous que les chemins de redirection sont corrects pour tous les rôles possibles
      return <Navigate to={user.role === 'association' ? '/association' : '/dashboard'} replace />;
  }

  return children;
};

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Afficher un chargement initial pendant l'authentification
  if (loading) {
    return <div>Chargement de l'application...</div>;
  }

  // Fonction pour gérer le "Get Started" sur la page d'accueil
  const handleGetStarted = () => {
    if (user) {
       // Rediriger l'utilisateur connecté vers son tableau de bord
       navigate(user.role === 'association' ? '/association' : '/dashboard');
    } else {
       // Rediriger l'utilisateur déconnecté vers la page d'inscription ou d'exploration
       navigate('/signup'); // Ou '/explore'
    }
  };

  return (
    <div className="App">
      <Suspense fallback={<div>Chargement...</div>}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage onGetStarted={handleGetStarted} />} />
          {/* Vérifier les chemins des pages si l'erreur persiste */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/missions/:missionId" element={<MissionDetailsPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Routes protégées, vérifier les rôles si nécessaire */}
          {/* Les notifications et messages devraient probablement être protégés */}
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          {/* Routes protégées pour les bénévoles */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['benevole']}><DashboardPage /></ProtectedRoute>} />
          <Route path="/my-missions" element={<ProtectedRoute allowedRoles={['benevole']}><MyMissionsPage /></ProtectedRoute>} />
          {/* La page de profil peut être vue par d'autres, mais RLS gère l'accès aux données privées */}
          <Route path="/profile/:userId" element={<UserProfilePage />} />

          {/* Routes protégées pour les associations */}
          <Route path="/association" element={<ProtectedRoute allowedRoles={['association']}><AssociationDashboard /></ProtectedRoute>} />
          {/* Les composants MissionManagement et MissionForm doivent utiliser useParams pour lire missionId */}
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
    </div>
  );
}

export default App;

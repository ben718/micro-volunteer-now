import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginSignup from './pages/LoginSignup';
import Explore from './pages/Explore';
import MissionDetail from './pages/MissionDetail';
import { MissionManagement } from './pages/MissionManagement';
import ProfilePage from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/app" element={<Home />} />
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/signup" element={<LoginSignup />} />
                <Route path="/explore" element={<Explore />} />
                <Route
                  path="/missions/:id"
                  element={
                    <ProtectedRoute>
                      <MissionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/missions"
                  element={
                    <ProtectedRoute>
                      <MissionManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 
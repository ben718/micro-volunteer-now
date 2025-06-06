import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import LoadingState from '@/components/LoadingState';
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import SignInForm from './components/auth/SignInForm'
import SignUpForm from './components/auth/SignUpForm'
import HomePage from './components/HomePage'
import MissionDetails from './components/missions/MissionDetails'
import Profile from './components/profile/Profile'
import AssociationProfile from './components/associations/AssociationProfile'
import Notifications from './components/notifications/Notifications'
import Messages from './components/messages/Messages'

// Lazy loading des composants
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MobileApp = lazy(() => import("./components/MobileApp"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingState />}>
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/signin" element={<SignInForm />} />
              <Route path="/auth/signup" element={<SignUpForm />} />

              {/* Routes protégées */}
              <Route
                path="/missions/:id"
                element={
                  <ProtectedRoute>
                    <MissionDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/associations/:id"
                element={
                  <ProtectedRoute>
                    <AssociationProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

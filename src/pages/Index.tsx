
import React, { useState } from 'react';
import Header from '@/components/Header';
import HomePage from '@/components/HomePage';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Heart, Mail, Lock } from 'lucide-react';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'explore' | 'missions' | 'profile'>('dashboard');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    setCurrentView('dashboard');
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      setCurrentView('explore');
    } else {
      setShowLogin(true);
      setIsSignUp(true);
    }
  };

  const renderLoginModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-slide-up">
        <button
          onClick={() => setShowLogin(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary to-success p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Heart className="h-8 w-8 text-white" fill="currentColor" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isSignUp ? 'Rejoindre Voisin Solidaire' : 'Bon retour parmi nous !'}
          </h2>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Commencez à aider en 15 minutes' 
              : 'Connectez-vous pour continuer à aider'
            }
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Votre email"
              className="pl-10"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Mot de passe"
              className="pl-10"
              required
            />
          </div>

          <Button type="submit" className="w-full btn-primary">
            {isSignUp ? 'Créer mon compte' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? 'Déjà membre ?' : 'Nouveau sur Voisin Solidaire ?'}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-primary font-medium hover:underline"
            >
              {isSignUp ? 'Se connecter' : 'Créer un compte'}
            </button>
          </p>
        </div>

        {isSignUp && (
          <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              En créant un compte, vous acceptez nos conditions d'utilisation et rejoignez une communauté de voisins solidaires.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLogin(true)}
        currentPage={currentView}
      />

      {isLoggedIn ? (
        <Dashboard 
          view={currentView}
          onViewChange={setCurrentView}
        />
      ) : (
        <HomePage onGetStarted={handleGetStarted} />
      )}

      {showLogin && renderLoginModal()}

      {/* Footer */}
      {!isLoggedIn && (
        <footer className="bg-foreground text-background py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-gradient-to-r from-primary to-success p-2 rounded-xl">
                    <Heart className="h-5 w-5 text-white" fill="currentColor" />
                  </div>
                  <span className="text-lg font-bold">Voisin Solidaire</span>
                </div>
                <p className="text-sm opacity-80">
                  La plateforme qui révolutionne le bénévolat avec des missions de 15 minutes.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Découvrir</h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><a href="#" className="hover:opacity-100">Comment ça marche</a></li>
                  <li><a href="#" className="hover:opacity-100">Missions</a></li>
                  <li><a href="#" className="hover:opacity-100">Associations</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><a href="#" className="hover:opacity-100">Centre d'aide</a></li>
                  <li><a href="#" className="hover:opacity-100">Contact</a></li>
                  <li><a href="#" className="hover:opacity-100">Sécurité</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Légal</h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><a href="#" className="hover:opacity-100">Confidentialité</a></li>
                  <li><a href="#" className="hover:opacity-100">CGU</a></li>
                  <li><a href="#" className="hover:opacity-100">Cookies</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-80">
              <p>&copy; 2024 Voisin Solidaire. Ensemble, changeons le monde 15 minutes à la fois.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;

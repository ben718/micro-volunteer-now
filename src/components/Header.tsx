
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, User, Search, Home } from 'lucide-react';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLoginClick?: () => void;
  currentPage?: string;
}

const Header = ({ isLoggedIn = false, onLoginClick, currentPage = 'home' }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-success p-2 rounded-xl">
              <Heart className="h-6 w-6 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-foreground">Voisin Solidaire</span>
          </div>

          {/* Navigation */}
          {isLoggedIn ? (
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="#" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'explore' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Explorer</span>
              </a>
              <a 
                href="#" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'missions' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Mes Missions</span>
              </a>
              <a 
                href="#" 
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === 'profile' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profil</span>
              </a>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                Comment ça marche
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Témoignages
              </a>
            </nav>
          )}

          {/* Action Button */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-sm">
                  <span className="text-muted-foreground">Niveau:</span>
                  <span className="ml-1 font-medium text-primary">Débutant</span>
                </div>
                <Button variant="outline" size="sm" className="p-2">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={onLoginClick} className="btn-primary">
                Rejoindre
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

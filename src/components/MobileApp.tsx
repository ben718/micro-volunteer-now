
import React, { useState } from 'react';
import { Home, Search, Briefcase, User } from 'lucide-react';
import MobileDashboard from './mobile/MobileDashboard';
import MobileExplorer from './mobile/MobileExplorer';
import MobileMissions from './mobile/MobileMissions';
import MobileProfile from './mobile/MobileProfile';

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'missions' | 'profile'>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <MobileDashboard />;
      case 'explore':
        return <MobileExplorer />;
      case 'missions':
        return <MobileMissions />;
      case 'profile':
        return <MobileProfile />;
      default:
        return <MobileDashboard />;
    }
  };

  return (
    <div className="mobile-app">
      <div className="mobile-content">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span>Accueil</span>
          </button>
          
          <button
            onClick={() => setActiveTab('explore')}
            className={`bottom-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
          >
            <Search className="w-5 h-5 mb-1" />
            <span>Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`bottom-nav-item ${activeTab === 'missions' ? 'active' : ''}`}
          >
            <Briefcase className="w-5 h-5 mb-1" />
            <span>Missions</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User className="w-5 h-5 mb-1" />
            <span>Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileApp;

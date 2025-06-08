import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import { BoltIcon } from '@heroicons/react/24/solid';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/',
      icon: HomeIcon,
      label: 'Accueil'
    },
    {
      path: '/explore',
      icon: MagnifyingGlassIcon,
      label: 'Explorer'
    },
    {
      path: '/missions',
      icon: CalendarIcon,
      label: 'Missions'
    },
    {
      path: '/profile',
      icon: UserIcon,
      label: 'Profil'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-vs-gray-200 shadow-sm py-2 px-6 z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center ${
              isActive(item.path)
                ? 'text-vs-blue-primary'
                : 'text-vs-gray-500 hover:text-vs-gray-700'
            }`}
          >
            {index === 2 ? (
              <div className="relative -mt-5">
                <button className="h-14 w-14 rounded-full bg-vs-orange-accent flex items-center justify-center shadow-lg">
                  <BoltIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            ) : (
              <>
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav; 
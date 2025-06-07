
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Settings, Star, Award, Heart } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserMissions } from '@/hooks/useUserMissions';

const MobileProfile = () => {
  const { userProfile, userStats, badges, loading, error } = useUserProfile();
  const { upcomingMissions, pastMissions } = useUserMissions();

  // Calculer les associations uniques depuis les missions passées
  const uniqueAssociations = pastMissions.reduce((acc: any[], mission: any) => {
    const associationName = mission.association_name || 'Association';
    const existing = acc.find(a => a.name === associationName);
    if (existing) {
      existing.missions += 1;
    } else {
      acc.push({ name: associationName, missions: 1 });
    }
    return acc;
  }, []);

  // Badges par défaut (à adapter selon votre système de badges)
  const defaultBadges = [
    { name: 'Premier pas', icon: '⭐', earned: pastMissions.length > 0 },
    { name: 'Alimentaire', icon: '🍽️', earned: pastMissions.some(m => m.category === 'alimentaire') },
    { name: 'Réactif', icon: '⚡', earned: pastMissions.length >= 3 },
    { name: 'À débloquer', icon: '🔒', earned: false }
  ];

  // Préférences par défaut (à adapter selon votre système)
  const preferences = [
    { name: 'Alimentaire', selected: userProfile?.interests?.includes('alimentaire') || false },
    { name: 'Social', selected: userProfile?.interests?.includes('social') || false },
    { name: 'Éducation', selected: userProfile?.interests?.includes('education') || false }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement du profil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="profile-header">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="profile-avatar">
              {userProfile?.first_name?.charAt(0) || 'U'}{userProfile?.last_name?.charAt(0) || ''}
            </div>
            <div className="profile-info">
              <div className="profile-name">
                {userProfile?.first_name || 'Prénom'} {userProfile?.last_name || 'Nom'}
              </div>
              <div className="profile-meta">
                Membre depuis {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'récemment'}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>📍 {userProfile?.city || 'Ville non renseignée'}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <Button className="w-full btn-secondary">
          Modifier mon profil
        </Button>
      </div>

      {/* Mon impact */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="section-title mb-4">Mon impact</h2>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="impact-stat">
            <div className="impact-number text-blue-500">{userStats.total_missions_completed}</div>
            <div className="impact-label">Missions</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number text-green-500">{userStats.total_hours_volunteered}h</div>
            <div className="impact-label">Temps donné</div>
          </div>
          <div className="impact-stat">
            <div className="impact-number text-orange-500">{uniqueAssociations.length}</div>
            <div className="impact-label">Associations</div>
          </div>
        </div>
      </div>

      {/* Mes badges */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="section-header">
          <h2 className="section-title">Mes badges</h2>
          <button className="section-action">Voir tout</button>
        </div>
        
        <div className="flex gap-3">
          {defaultBadges.map((badge, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
                badge.earned 
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
                  : 'bg-gray-100'
              }`}
            >
              {badge.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Mes préférences */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="section-title mb-4">Mes préférences</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Catégories préférées</h3>
            <div className="flex flex-wrap gap-2">
              {preferences.map((pref, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pref.selected 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {pref.name}
                </span>
              ))}
              <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                + Ajouter
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Distance maximale</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${Math.min((userProfile?.max_distance || 3) * 20, 100)}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-blue-600">
                {userProfile?.max_distance || 3} km
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Durée préférée</h3>
            <div className="flex gap-2">
              {['15 min', '30 min', '1h', '2h+'].map((duration, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    index === 0 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {duration}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mes associations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="section-header">
          <h2 className="section-title">Mes associations</h2>
          <button className="section-action">Voir tout</button>
        </div>
        
        <div className="space-y-3">
          {uniqueAssociations.length > 0 ? (
            uniqueAssociations.map((association, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{association.name}</div>
                    <div className="text-sm text-gray-500">
                      {association.missions} mission{association.missions > 1 ? 's' : ''} effectuée{association.missions > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              Aucune association pour le moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileProfile;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Profile, Association, Badge, UserBadge } from '../types';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [_association, setAssociation] = useState<Association | null>(null);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch association if user is an association
        if (profileData.role === 'association') {
          const { data: associationData, error: associationError } = await supabase
            .from('associations')
            .select('*')
            .eq('id', user.id)
            .single();

          if (associationError) throw associationError;
          setAssociation(associationData);
        }

        // Fetch user badges
        const { data: userBadgesData, error: userBadgesError } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', user.id);

        if (userBadgesError) throw userBadgesError;
        setUserBadges(userBadgesData || []);

        // Fetch all badges
        const { data: badgesData, error: badgesError } = await supabase
          .from('badges')
          .select('*');

        if (badgesError) throw badgesError;
        setBadges(badgesData || []);

      } catch (error: any) {
        setError(error.message);
        toast.error('Erreur lors du chargement du profil: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-vs-gray-900">Mon Profil</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-vs-blue-600 hover:text-vs-blue-700"
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        {/* Profile Content */}
        {profile && (
          <div>
            {/* ... other profile sections ... */}

            {/* Badges Section */}
            {userBadges.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-vs-gray-900 mb-4">Mes Badges</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {userBadges.map((userBadge) => {
                    const badge = badges.find(b => b.id === userBadge.badge_id);
                    if (!badge) return null;
                    
                    return (
                      <div
                        key={userBadge.id}
                        className="flex flex-col items-center p-4 bg-white border border-vs-gray-200 rounded-lg shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2">
                          <img 
                            src={badge.icon_url} 
                            alt={badge.name}
                            className="w-8 h-8"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-vs-gray-900">{badge.name}</h3>
                        <p className="text-xs text-vs-gray-500 text-center mt-1">{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

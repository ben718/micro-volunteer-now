
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import ImpactStats from './ImpactStats';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LanguageLevelsForm } from './LanguageLevelsForm';
import { useCategories } from '@/hooks/useCategories';
import { ProfileEditForm } from './ProfileEditForm';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { userProfile, userStats, badges, loading, error, loadProfile, availability } = useUserProfile();
  const { categories } = useCategories();

  // Générer les préférences à partir des catégories de la BDD
  const preferences = categories.map(category => ({
    name: category.name,
    selected: userProfile?.interests?.includes(category.name.toLowerCase()) || false,
    icon: category.icon
  }));

  const handleProfileSave = () => {
    setIsEditing(false);
    loadProfile(); // Recharger le profil pour avoir les dernières données
  };

  if (loading) {
    return <div>Chargement du profil...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement du profil : {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {isEditing ? (
            <ProfileEditForm
              onSave={handleProfileSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <div className="font-semibold text-lg">{userProfile?.first_name} {userProfile?.last_name}</div>
                  <div className="text-sm text-muted-foreground">{userProfile?.email}</div>
                  <div className="text-sm text-muted-foreground">Téléphone : {userProfile?.phone || 'Non renseigné'}</div>
                  <div className="text-sm text-muted-foreground">
                    Adresse : {userProfile?.address || 'Non renseignée'}
                    {userProfile?.city && `, ${userProfile.city}`}
                    {userProfile?.postal_code && ` ${userProfile.postal_code}`}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">À propos</h3>
                <p className="text-muted-foreground text-sm">{userProfile?.bio || 'Pas de description.'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Catégories préférées</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.filter(pref => pref.selected).length > 0 ? (
                    preferences.filter(pref => pref.selected).map((pref, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {pref.icon} {pref.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">Aucune catégorie préférée définie.</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Distance maximale</h3>
                <span className="text-sm text-muted-foreground">
                  {userProfile?.max_distance || 15} km
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Mes disponibilités</h3>
                {availability && Object.keys(availability).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    {Object.entries(availability).map(([day, timeSlots]) => (
                      <div key={day}>
                        <span className="font-medium capitalize">{day} : </span>
                        {Object.entries(timeSlots as any)
                          .filter(([_, available]) => available)
                          .map(([slot, _], index, arr) => (
                            <span key={slot}>
                              {slot.replace('morning', 'matin').replace('afternoon', 'après-midi').replace('evening', 'soir')}{
                                index < arr.length - 1 ? ', ' : ''
                              }
                            </span>
                          ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Disponibilités non renseignées.</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Mes badges</h3>
                <div className="flex flex-wrap gap-2">
                  {badges.length === 0 ? (
                    <span className="text-muted-foreground text-sm">Aucun badge obtenu</span>
                  ) : (
                    badges.map(userBadge => (
                      <span key={userBadge.badges.id} className="badge-earned flex items-center gap-1" title={userBadge.badges.description}>
                        <span className="text-lg">{userBadge.badges.icon_url}</span>
                        {userBadge.badges.name}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <LanguageLevelsForm />
            </div>
          )}
        </div>

        <div className="mt-8">
          <ImpactStats />
        </div>
      </div>
    </div>
  );
};

export default Profile;

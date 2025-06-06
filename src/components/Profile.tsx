import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Bell, 
  MapPin, 
  Clock, 
  Heart, 
  Award, 
  Star,
  Edit,
  Camera,
  Shield,
  Globe,
  Smartphone
} from 'lucide-react';
import ImpactStats from './ImpactStats';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'impact' | 'badges' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const userProfile = {
    name: 'Marie Dupont',
    email: 'marie.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    location: 'Paris 11ème (75011)',
    memberSince: 'Janvier 2024',
    bio: 'Passionnée par l\'aide aux autres, j\'aime participer à des missions courtes qui ont un impact direct sur ma communauté.',
    preferences: {
      categories: ['Aide alimentaire', 'Accompagnement', 'Environnement'],
      maxDistance: '2 km',
      preferredDurations: ['15 min', '30 min'],
      notifications: {
        newMissions: true,
        reminders: true,
        achievements: true,
        newsletter: false
      }
    }
  };

  const userStats = {
    missionsCompleted: 8,
    associationsHelped: 5,
    timeVolunteered: 285,
    pointsEarned: 420
  };

  const userLevel = {
    current: "Voisin Solidaire Intermédiaire",
    progress: 75,
    nextLevel: "Expert",
    missionsToNext: 2
  };

  const badges = [
    { name: 'Premier pas', icon: '🌟', description: 'Première mission complétée', earned: true, date: 'Jan 2024' },
    { name: 'Ponctuel', icon: '⏰', description: '5 missions à l\'heure', earned: true, date: 'Jan 2024' },
    { name: 'Solidaire', icon: '🤝', description: '3 associations aidées', earned: true, date: 'Fév 2024' },
    { name: 'Fidèle', icon: '💎', description: '10 missions complétées', earned: false, description2: 'Encore 2 missions' },
    { name: 'Ambassadeur', icon: '🏆', description: 'Partage sur les réseaux', earned: false, description2: 'Partagez votre première mission' },
    { name: 'Expert', icon: '🎯', description: '25 missions complétées', earned: false, description2: 'Encore 17 missions' }
  ];

  const recentActivity = [
    { type: 'mission', title: 'Distribution alimentaire', association: 'Restos du Cœur', date: 'Il y a 2 jours', points: 50 },
    { type: 'badge', title: 'Badge "Solidaire" débloqué', date: 'Il y a 1 semaine' },
    { type: 'mission', title: 'Aide aux devoirs', association: 'Aide aux Enfants', date: 'Il y a 1 semaine', points: 45 },
    { type: 'level', title: 'Niveau Intermédiaire atteint', date: 'Il y a 2 semaines' }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Informations principales */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center text-white text-3xl font-bold">
                M
              </div>
              <button className="absolute -bottom-1 -right-1 bg-accent text-white p-1.5 rounded-full hover:bg-accent/90">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{userProfile.name}</h2>
              <p className="text-muted-foreground">{userProfile.email}</p>
              <p className="text-sm text-primary font-medium">{userLevel.current}</p>
              <p className="text-sm text-muted-foreground">Membre depuis {userProfile.memberSince}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-1" />
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                <Input defaultValue={userProfile.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input defaultValue={userProfile.email} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                <Input defaultValue={userProfile.phone} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Localisation</label>
                <Input defaultValue={userProfile.location} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea 
                className="w-full px-3 py-2 border border-border rounded-lg resize-none"
                rows={3}
                defaultValue={userProfile.bio}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setIsEditing(false)}>Sauvegarder</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 text-muted-foreground mr-2" />
                <span>{userProfile.phone}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                <span>{userProfile.location}</span>
              </div>
            </div>
            <p className="text-muted-foreground">{userProfile.bio}</p>
          </div>
        )}
      </div>

      {/* Préférences de mission */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Préférences de mission</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Catégories favorites</label>
            <div className="flex flex-wrap gap-2">
              {userProfile.preferences.categories.map((category, index) => (
                <Badge key={index} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Distance maximale</label>
              <p className="text-muted-foreground">{userProfile.preferences.maxDistance}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Durées préférées</label>
              <div className="flex space-x-2">
                {userProfile.preferences.preferredDurations.map((duration, index) => (
                  <Badge key={index} variant="outline">
                    {duration}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Activité récente</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="flex-shrink-0">
                {activity.type === 'mission' && <Heart className="h-5 w-5 text-success" />}
                {activity.type === 'badge' && <Award className="h-5 w-5 text-warning" />}
                {activity.type === 'level' && <Star className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{activity.title}</p>
                {activity.association && (
                  <p className="text-sm text-muted-foreground">{activity.association}</p>
                )}
                <p className="text-xs text-muted-foreground">{activity.date}</p>
              </div>
              {activity.points && (
                <div className="text-sm font-medium text-success">
                  +{activity.points} pts
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBadgesTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Vos badges</h2>
        <p className="text-muted-foreground">
          Débloquez des badges en complétant des missions et en vous engageant dans la communauté
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-xl border transition-all ${
              badge.earned 
                ? 'bg-card border-success/20 shadow-sm' 
                : 'bg-muted/50 border-border opacity-60'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{badge.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
              
              {badge.earned ? (
                <Badge className="bg-success text-success-foreground">
                  Obtenu {badge.date}
                </Badge>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {badge.description2}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-success/10 rounded-xl p-6 text-center">
        <Award className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Continuez à débloquer des badges !
        </h3>
        <p className="text-muted-foreground mb-4">
          Plus vous participez, plus vous débloquez de récompenses et de privilèges
        </p>
        <Button>Explorer les missions</Button>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Paramètres</h2>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
        <div className="space-y-4">
          {Object.entries(userProfile.preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  {key === 'newMissions' && 'Nouvelles missions'}
                  {key === 'reminders' && 'Rappels de mission'}
                  {key === 'achievements' && 'Succès et badges'}
                  {key === 'newsletter' && 'Newsletter hebdomadaire'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {key === 'newMissions' && 'Soyez averti des nouvelles missions près de chez vous'}
                  {key === 'reminders' && 'Rappels avant vos missions programmées'}
                  {key === 'achievements' && 'Notifications pour vos accomplissements'}
                  {key === 'newsletter' && 'Actualités et conseils pour les bénévoles'}
                </p>
              </div>
              <input 
                type="checkbox" 
                defaultChecked={value}
                className="h-4 w-4 text-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Confidentialité */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          <Shield className="h-5 w-5 inline mr-2" />
          Confidentialité
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Profil public</p>
              <p className="text-sm text-muted-foreground">Permettre aux autres bénévoles de voir votre profil</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Partage de localisation</p>
              <p className="text-sm text-muted-foreground">Partager votre position pour des recommandations personnalisées</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-destructive/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-destructive mb-4">Zone de danger</h3>
        <div className="space-y-4">
          <Button variant="outline" className="text-destructive border-destructive">
            Supprimer mon compte
          </Button>
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation par onglets */}
      <div className="flex space-x-1 p-1 bg-muted rounded-lg">
        {[
          { key: 'profile', label: 'Profil', icon: User },
          { key: 'impact', label: 'Impact', icon: Heart },
          { key: 'badges', label: 'Badges', icon: Award },
          { key: 'settings', label: 'Paramètres', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'impact' && <ImpactStats />}
      {activeTab === 'badges' && renderBadgesTab()}
      {activeTab === 'settings' && renderSettingsTab()}
    </div>
  );
};

export default Profile;

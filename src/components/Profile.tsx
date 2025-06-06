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
import { useUserProfile } from '@/hooks/useUserProfile';

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'impact' | 'badges' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const { userStats, badges } = useUserProfile();

  // Affichage du profil (exemple simplifié)
  const renderProfileTab = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
          <User className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <div className="font-semibold text-lg">Profil utilisateur</div>
          <div className="text-sm text-muted-foreground">Langues : {userStats.languages?.join(', ') || 'Non renseigné'}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {userStats.languages?.map((lang, i) => (
          <Badge key={i} variant="secondary">{lang}</Badge>
        ))}
      </div>
    </div>
  );

  const renderBadgesTab = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground mb-3">Tous mes badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.length === 0 && <span className="text-muted-foreground text-sm">Aucun badge obtenu</span>}
        {badges.map(badge => (
          <span key={badge.id} className="badge-earned flex items-center gap-1" title={badge.name}>
            <img src={badge.icon_url} alt={badge.name} className="w-5 h-5 inline-block mr-1" />
            {badge.name}
          </span>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground mb-3">Paramètres</h3>
      <p className="text-muted-foreground">(À compléter selon les besoins)</p>
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

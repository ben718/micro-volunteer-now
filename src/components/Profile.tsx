import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
import { LanguageLevelsForm } from './LanguageLevelsForm';
import { toast } from '@/components/ui/use-toast';

// Définir le type pour la disponibilité (doit correspondre à celui du hook)
interface Availability {
  [day: string]: { // par exemple, 'lundi', 'mardi'
    morning?: boolean;
    afternoon?: boolean;
    evening?: boolean;
  };
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'impact' | 'badges' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const { userProfile, userStats, badges, loading, error, updateUserProfile, availability, setMaxDistance, setPreferredCategories } = useUserProfile();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    bio: '',
    // interests et max_distance sont gérés par des setters spécifiques pour l'instant,
    // mais pourraient être intégrés ici si nécessaire.
  });
  // Ajouter l'état local pour la disponibilité dans le formulaire d'édition
  const [editAvailability, setEditAvailability] = useState<Availability | null>(null);

  // Synchroniser les données du profil et de la disponibilité lors du chargement ou de l'entrée en mode édition
  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        bio: userProfile.bio || '',
      });
      setEditAvailability(availability || null);
    }
  }, [userProfile, availability]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Gérer le changement de disponibilité
  const handleAvailabilityChange = (day: string, timeSlot: 'morning' | 'afternoon' | 'evening', checked: boolean) => {
    setEditAvailability(prev => {
      const newAvailability = { ...prev };
      if (!newAvailability[day]) {
        newAvailability[day] = {};
      }
      newAvailability[day][timeSlot] = checked;
      // Nettoyer le jour si tous les créneaux sont décochés
      if (!newAvailability[day].morning && !newAvailability[day].afternoon && !newAvailability[day].evening) {
          delete newAvailability[day];
      }
      return newAvailability;
    });
  };

  const handleSaveProfile = async () => {
    // Préparer les données à envoyer, y compris la disponibilité
    const updates = {
      ...formData,
      availability: editAvailability, // Inclure la disponibilité
      // Si vous souhaitez également mettre à jour interests et max_distance ici,
      // ajoutez-les au formData et incluez-les dans les updates.
    };

    const success = await updateUserProfile(updates);

    if (success) {
      toast({ title: "Profil mis à jour", description: "Votre profil a été enregistré avec succès." });
      setIsEditing(false);
    } else {
       toast({ title: "Erreur", description: error || "Une erreur est survenue lors de la mise à jour du profil.", variant: "destructive" });
    }
  };

  // Affichage du profil (mode lecture)
  const renderProfileView = () => (
    <div className="space-y-6">
       {/* Informations générales du profil */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
          <User className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <div className="font-semibold text-lg">{userProfile?.first_name} {userProfile?.last_name}</div>
          <div className="text-sm text-muted-foreground">{userProfile?.email}</div>
          <div className="text-sm text-muted-foreground">Téléphone : {userProfile?.phone || 'Non renseigné'}</div>
          <div className="text-sm text-muted-foreground">Adresse : {userProfile?.address || 'Non renseignée'}, {userProfile?.city || ''} {userProfile?.postal_code || ''}</div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-foreground mb-2">À propos</h3>
        <p className="text-muted-foreground text-sm">{userProfile?.bio || 'Pas de description.'}</p>
      </div>

      {/* Affichage de la Disponibilité (mode lecture) */}
      <div>
          <h3 className="font-semibold text-foreground mb-2">Mes disponibilités</h3>
          {availability && Object.keys(availability).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  {Object.entries(availability).map(([day, timeSlots]) => (
                      <div key={day}>
                          <span className="font-medium capitalize">{day} : </span>
                          {Object.entries(timeSlots)
                              .filter(([_, available]) => available)
                              .map(([slot, _], index, arr) => (
                                  <span key={slot}>
                                      {slot.replace('morning', 'matin').replace('afternoon', 'après-midi').replace('evening', 'soir')}{
                                          index < arr.length - 1 ? ', ' : ''
                                      }
                                  </span>
                              ))
                              .reduce((prev, curr) => [prev, ', ', curr], [] as any) // Pour ajouter des virgules entre les créneaux
                          }
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-muted-foreground text-sm">Disponibilités non renseignées.</p>
          )}
      </div>

      {/* Language Levels Form */}
      <LanguageLevelsForm />

      {/* Ajoutez d'autres sections du profil en mode lecture ici (Compétences, Intérêts, etc.) */}

    </div>
  );

  // Affichage du profil (mode édition)
  const renderProfileEditForm = () => {
      const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
      const timeSlots = ['morning', 'afternoon', 'evening'];

      return (
          <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input id="first_name" value={formData.first_name} onChange={handleInputChange} />
                  </div>
                  <div>
                      <Label htmlFor="last_name">Nom</Label>
                      <Input id="last_name" value={formData.last_name} onChange={handleInputChange} />
                  </div>
              </div>
              <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" value={formData.address} onChange={handleInputChange} />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input id="city" value={formData.city} onChange={handleInputChange} />
                  </div>
                   <div>
                      <Label htmlFor="postal_code">Code Postal</Label>
                      <Input id="postal_code" value={formData.postal_code} onChange={handleInputChange} />
                  </div>
              </div>
              <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
              </div>

              {/* Section Disponibilité (mode édition) */}
              <div>
                  <h3 className="font-semibold text-foreground mb-3">Mes disponibilités</h3>
                  <div className="space-y-3">
                      {daysOfWeek.map(day => (
                          <div key={day} className="flex items-center space-x-4">
                              <div className="w-24 text-right font-medium capitalize">{day}</div>
                              <div className="flex items-center space-x-4">
                                  {timeSlots.map(slot => (
                                      <div key={slot} className="flex items-center space-x-1">
                                          <Checkbox
                                              id={`${day}-${slot}`}
                                              checked={editAvailability?.[day]?.[slot as 'morning' | 'afternoon' | 'evening'] || false}
                                              onCheckedChange={(checked) => handleAvailabilityChange(day, slot as 'morning' | 'afternoon' | 'evening', checked as boolean)}
                                          />
                                          <Label htmlFor={`${day}-${slot}`} className="text-sm">
                                              {slot === 'morning' ? 'Matin' : slot === 'afternoon' ? 'Après-midi' : 'Soir'}
                                          </Label>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              {/* Ajoutez d'autres champs du profil en mode édition ici (Compétences, Intérêts, etc.) */}

              <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                  </Button>
                  <Button type="submit">
                      Enregistrer les modifications
                  </Button>
              </div>
          </form>
      );
  };

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
          {isEditing ? renderProfileEditForm() : renderProfileView()}
        </div>

         {/* Impact Stats and Badges displayed below the main profile info */}
        {/* Move these sections outside the main profile card if they are separate tabs */}
        {activeTab === 'impact' && <ImpactStats />}
        {activeTab === 'badges' && renderBadgesTab()}
        {activeTab === 'settings' && renderSettingsTab()} {/* Assuming settings are separate or integrated */}

      </div>
    </div>
  );
};

export default Profile;

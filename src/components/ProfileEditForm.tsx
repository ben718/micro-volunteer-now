
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useCategories } from '@/hooks/useCategories';

interface ProfileEditFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onSave, onCancel }) => {
  const { userProfile, updateUserProfile, availability } = useUserProfile();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    bio: '',
    interests: [] as string[],
    max_distance: 15
  });

  const [editAvailability, setEditAvailability] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        postal_code: userProfile.postal_code || '',
        bio: userProfile.bio || '',
        interests: userProfile.interests || [],
        max_distance: userProfile.max_distance || 15
      });
      setEditAvailability(availability || {});
    }
  }, [userProfile, availability]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (categoryName: string) => {
    const categoryLower = categoryName.toLowerCase();
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(categoryLower)
        ? prev.interests.filter(interest => interest !== categoryLower)
        : [...prev.interests, categoryLower]
    }));
  };

  const handleAvailabilityChange = (day: string, timeSlot: string, checked: boolean) => {
    setEditAvailability(prev => {
      const newAvailability = { ...prev };
      if (!newAvailability[day]) {
        newAvailability[day] = {};
      }
      newAvailability[day][timeSlot] = checked;
      
      // Nettoyer le jour si aucun créneau n'est sélectionné
      if (!newAvailability[day].morning && !newAvailability[day].afternoon && !newAvailability[day].evening) {
        delete newAvailability[day];
      }
      
      return newAvailability;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates = {
        ...formData,
        availability: editAvailability,
      };

      const success = await updateUserProfile(updates);

      if (success) {
        toast({ 
          title: "Profil mis à jour", 
          description: "Vos informations ont été sauvegardées avec succès." 
        });
        onSave();
      } else {
        toast({ 
          title: "Erreur", 
          description: "Impossible de mettre à jour votre profil.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: "Une erreur inattendue s'est produite.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
  const timeSlots = [
    { key: 'morning', label: 'Matin' },
    { key: 'afternoon', label: 'Après-midi' },
    { key: 'evening', label: 'Soir' }
  ];

  const distanceOptions = [5, 10, 15, 25, 50];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations personnelles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">Prénom *</Label>
            <Input
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="last_name">Nom *</Label>
            <Input
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div className="mt-4">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="postal_code">Code postal</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="bio">À propos de moi</Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            placeholder="Parlez-nous de vous, vos motivations..."
          />
        </div>
      </div>

      {/* Distance maximale */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Préférences de mission</h3>
        <div>
          <Label>Distance maximale de déplacement</Label>
          <div className="flex gap-2 mt-2">
            {distanceOptions.map((distance) => (
              <button
                key={distance}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, max_distance: distance }))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.max_distance === distance
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {distance} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catégories d'intérêt */}
      <div>
        <Label>Catégories d'intérêt</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleInterestToggle(category.name)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                formData.interests.includes(category.name.toLowerCase())
                  ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Disponibilités */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Mes disponibilités</h3>
        <div className="space-y-3">
          {daysOfWeek.map(day => (
            <div key={day} className="flex items-center space-x-4">
              <div className="w-24 text-right font-medium capitalize">{day}</div>
              <div className="flex items-center space-x-4">
                {timeSlots.map(slot => (
                  <div key={slot.key} className="flex items-center space-x-1">
                    <Checkbox
                      id={`${day}-${slot.key}`}
                      checked={editAvailability?.[day]?.[slot.key] || false}
                      onCheckedChange={(checked) => 
                        handleAvailabilityChange(day, slot.key, checked as boolean)
                      }
                    />
                    <Label htmlFor={`${day}-${slot.key}`} className="text-sm">
                      {slot.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </form>
  );
};

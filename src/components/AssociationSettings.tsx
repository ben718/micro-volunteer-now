import { useState, useEffect } from 'react';
import { useAssociation } from '@/hooks/useAssociation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { useCategories } from '@/hooks/useCategories';

export const AssociationSettings = () => {
  const { association, loading, error, updateAssociation, updateNotificationPreferences } = useAssociation();
  const { categories: availableCategories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postal_code: '',
    categories: [] as string[],
    logo_url: '',
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    new_volunteer: false,
    mission_reminder: false,
    mission_completed: false,
    platform_updates: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (association) {
      setFormData({
        name: association.name || '',
        description: association.description || '',
        website: association.website || '',
        phone: association.phone || '',
        email: association.email || '',
        address: association.address || '',
        city: association.city || '',
        postal_code: association.postal_code || '',
        categories: association.categories || [],
        logo_url: association.logo_url || '',
      });
      setNotificationPreferences({
        new_volunteer: association.notification_preferences?.new_volunteer || false,
        mission_reminder: association.notification_preferences?.mission_reminder || false,
        mission_completed: association.notification_preferences?.mission_completed || false,
        platform_updates: association.notification_preferences?.platform_updates || false,
      });
    }
  }, [association]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter(cat => cat !== value),
    }));
  };

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotificationPreferences(prev => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const associationUpdates = {
      name: formData.name,
      description: formData.description,
      website: formData.website,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postal_code,
      categories: formData.categories,
      logo_url: formData.logo_url,
    };

    const notificationUpdates = notificationPreferences;

    const success1 = await updateAssociation(associationUpdates);
    const success2 = await updateNotificationPreferences(notificationUpdates);

    if (success1 && success2) {
      toast({
        title: "Paramètres enregistrés",
        description: "Vos informations et préférences ont été mises à jour.",
      });
    } else {
      toast({
        title: "Erreur",
        description: error || "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  if (loading || categoriesLoading) return <div>Chargement...</div>;
  if (error || categoriesError) return <div>Erreur: {error || categoriesError}</div>;
  if (!association) return <div>Association non trouvée.</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres de l'association</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de l'association</Label>
            <Input id="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="logo_url">URL du Logo</Label>
            <Input id="logo_url" value={formData.logo_url} onChange={handleInputChange} placeholder="https://votre-logo.com/logo.png" />
            {formData.logo_url && (
              <img src={formData.logo_url} alt="Logo de l'association" className="mt-2 max-h-24" />
            )}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="website">Site web</Label>
            <Input id="website" value={formData.website} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="email">Email (non modifiable)</Label>
            <Input id="email" value={formData.email} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adresse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" value={formData.address} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input id="city" value={formData.city} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="postal_code">Code postal</Label>
            <Input id="postal_code" value={formData.postal_code} onChange={handleInputChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catégories d'intervention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {availableCategories.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={category.name}
                value={category.name}
                checked={formData.categories.includes(category.name)}
                onChange={handleCategoryChange}
                className="form-checkbox"
              />
              <Label htmlFor={category.name}>{category.name}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences de notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="new_volunteer">Nouvelle inscription à une mission</Label>
            <Switch
              id="new_volunteer"
              checked={notificationPreferences.new_volunteer}
              onCheckedChange={(checked) => handleNotificationChange('new_volunteer', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="mission_reminder">Rappel de mission à venir</Label>
            <Switch
              id="mission_reminder"
              checked={notificationPreferences.mission_reminder}
              onCheckedChange={(checked) => handleNotificationChange('mission_reminder', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="mission_completed">Mission marquée comme terminée</Label>
            <Switch
              id="mission_completed"
              checked={notificationPreferences.mission_completed}
              onCheckedChange={(checked) => handleNotificationChange('mission_completed', checked)}
            />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="platform_updates">Mises à jour de la plateforme</Label>
            <Switch
              id="platform_updates"
              checked={notificationPreferences.platform_updates}
              onCheckedChange={(checked) => handleNotificationChange('platform_updates', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} disabled={isSaving}>
        {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </Button>
    </div>
  );
}; 
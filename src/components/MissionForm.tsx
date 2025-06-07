
import { useState, useEffect } from 'react';
import { useAssociationMissions } from '@/hooks/useAssociationMissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const MissionForm = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const { missions, createMission, updateMission, loading: missionsLoading } = useAssociationMissions();
  const navigate = useNavigate();
  const isEditing = !!missionId;
  const existingMission = isEditing ? missions.find(m => m.id === missionId) : null;

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    category: '',
    image_url: '',
    address: '',
    city: '',
    postal_code: '',
    date: new Date(),
    start_time: '',
    end_time: '',
    duration: 0,
    spots_available: 1,
    min_age: 18,
    requirements: [] as string[],
    skills_needed: [] as string[],
    languages_needed: [] as string[],
    materials_provided: [] as string[],
    materials_to_bring: [] as string[],
    impact_description: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
        if (existingMission) {
          setFormData({
            title: existingMission.title,
            short_description: existingMission.short_description,
            description: existingMission.description,
            category: existingMission.category,
            image_url: existingMission.image_url || '',
            address: existingMission.address,
            city: existingMission.city,
            postal_code: existingMission.postal_code,
            date: new Date(existingMission.date),
            start_time: existingMission.start_time,
            end_time: existingMission.end_time,
            duration: existingMission.duration,
            spots_available: existingMission.spots_available,
            min_age: existingMission.min_age || 18,
            requirements: existingMission.requirements || [],
            skills_needed: existingMission.skills_needed || [],
            languages_needed: existingMission.languages_needed || [],
            materials_provided: existingMission.materials_provided || [],
            materials_to_bring: existingMission.materials_to_bring || [],
            impact_description: existingMission.impact_description || '',
          });
        } else if (!missionsLoading) {
          setFormError("Mission non trouvée.");
        }
    }
  }, [isEditing, existingMission, missionsLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: parseInt(value, 10) || 0 }));
  };

   const handleArrayInputChange = (id: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value.split(',').map(item => item.trim()).filter(item => item !== '') }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    if (!formData.title || !formData.short_description || !formData.description || !formData.category || !formData.address || !formData.city || !formData.postal_code || !formData.date || !formData.start_time || !formData.end_time || formData.spots_available <= 0) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      setIsSaving(false);
      return;
    }

    const [startHour, startMinute] = formData.start_time.split(':').map(Number);
    const [endHour, endMinute] = formData.end_time.split(':').map(Number);
    const durationInMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    const finalDuration = Math.max(durationInMinutes > 0 ? durationInMinutes : 0, 15);

    const missionDataToSend = {
       ...formData,
       date: formData.date.toISOString().split('T')[0],
       duration: finalDuration,
       latitude: null,
       longitude: null,
       status: 'draft' as const,
       is_recurring: false,
       recurring_pattern: null,
       impact_metrics: null,
    };

    try {
      let success = false;
      if (isEditing && missionId) {
        success = await updateMission(missionId, missionDataToSend);
      } else {
         success = await createMission(missionDataToSend);
      }

      if (success) {
        toast({
          title: isEditing ? "Mission modifiée" : "Mission créée",
          description: `La mission "${formData.title}" a été ${isEditing ? 'modifiée' : 'créée'} avec succès.`,
        });
        navigate('/association');
      } else {
        const errorMessage = isEditing ? "Échec de la modification de la mission." : "Échec de la création de la mission.";
        setFormError(errorMessage);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      const errorMessage = isEditing ? "Échec de la modification de la mission." : "Échec de la création de la mission.";
      setFormError(errorMessage);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }

    setIsSaving(false);
  };

  if (isEditing && missionsLoading) return <div>Chargement de la mission...</div>;
  if (isEditing && !existingMission && !missionsLoading) return <div>Mission non trouvée ou vous n'avez pas les droits.</div>;
  if (formError && !formError.includes("Mission non trouvée")) return <div>Erreur : {formError}</div>;

  const availableCategories = ["Environnement", "Social", "Éducation", "Santé", "Culture", "Sport"];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">{isEditing ? 'Modifier la mission' : 'Créer une nouvelle mission'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre de la mission</Label>
              <Input id="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="short_description">Courte description</Label>
              <Input id="short_description" value={formData.short_description} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="description">Description complète</Label>
              <Textarea id="description" value={formData.description} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input id="category" value={formData.category} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="image_url">URL de l'image (optionnel)</Label>
              <Input id="image_url" type="url" value={formData.image_url} onChange={handleInputChange} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Date, heure et lieu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time">Heure de début</Label>
                <Input id="start_time" type="time" value={formData.start_time} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="end_time">Heure de fin</Label>
                <Input id="end_time" type="time" value={formData.end_time} onChange={handleInputChange} required />
              </div>
            </div>
             <div>
               <Label>Durée estimée (calculée)</Label>
               <p className="text-muted-foreground">{/* Afficher la durée calculée ici */}</p>
             </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={formData.address} onChange={handleInputChange} required />
            </div>
             <div>
              <Label htmlFor="city">Ville</Label>
              <Input id="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="postal_code">Code postal</Label>
              <Input id="postal_code" value={formData.postal_code} onChange={handleInputChange} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacité et exigences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="spots_available">Places disponibles</Label>
              <Input id="spots_available" type="number" value={formData.spots_available} onChange={handleNumberInputChange} required min="1" />
            </div>
             <div>
              <Label htmlFor="min_age">Âge minimum (optionnel)</Label>
              <Input id="min_age" type="number" value={formData.min_age} onChange={handleNumberInputChange} min="0" />
            </div>
             <div>
              <Label htmlFor="requirements">Pré-requis (séparés par des virgules, optionnel)</Label>
              <Input id="requirements" value={formData.requirements.join(', ')} onChange={(e) => handleArrayInputChange('requirements', e.target.value)} />
            </div>
             <div>
              <Label htmlFor="skills_needed">Compétences recherchées (séparées par des virgules, optionnel)</Label>
              <Input id="skills_needed" value={formData.skills_needed.join(', ')} onChange={(e) => handleArrayInputChange('skills_needed', e.target.value)} />
            </div>
             <div>
              <Label htmlFor="languages_needed">Langues requises (séparées par des virgules, optionnel)</Label>
              <Input id="languages_needed" value={formData.languages_needed.join(', ')} onChange={(e) => handleArrayInputChange('languages_needed', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Matériel et Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
              <Label htmlFor="materials_provided">Matériel fourni (séparé par des virgules, optionnel)</Label>
              <Input id="materials_provided" value={formData.materials_provided.join(', ')} onChange={(e) => handleArrayInputChange('materials_provided', e.target.value)} />
            </div>
             <div>
              <Label htmlFor="materials_to_bring">Matériel à apporter par les bénévoles (séparé par des virgules, optionnel)</Label>
              <Input id="materials_to_bring" value={formData.materials_to_bring.join(', ')} onChange={(e) => handleArrayInputChange('materials_to_bring', e.target.value)} />
            </div>
             <div>
              <Label htmlFor="impact_description">Description de l'impact (optionnel)</Label>
              <Textarea id="impact_description" value={formData.impact_description} onChange={handleInputChange} />
            </div>
          </CardContent>
        </Card>

        {formError && (
          <div className="text-red-500 text-sm">{formError}</div>
        )}

        <div className="flex justify-end space-x-2">
           <Button type="button" variant="outline" onClick={() => navigate('/association/missions')}>
             Annuler
           </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Enregistrement...' : (isEditing ? 'Modifier la mission' : 'Créer la mission')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MissionForm;

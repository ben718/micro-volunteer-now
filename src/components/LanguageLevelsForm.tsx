import { useState } from 'react';
import { useLanguageLevels, LanguageLevel } from '@/hooks/useLanguageLevels';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';

// Liste des langues courantes (à adapter selon vos besoins)
const commonLanguages = [
  'Français',
  'Anglais',
  'Espagnol',
  'Allemand',
  'Italien',
  'Portugais',
  'Arabe',
  'Chinois',
  'Russe',
  'Japonais',
  // Ajoutez d'autres langues si nécessaire
];

// Niveaux de langue disponibles
const availableLevels = ['débutant', 'intermédiaire', 'avancé', 'natif'] as const;

export const LanguageLevelsForm = () => {
  const { languageLevels, loading, error, addLanguageLevel, removeLanguageLevel } = useLanguageLevels();
  const [newLanguage, setNewLanguage] = useState('');
  const [newLevel, setNewLevel] = useState<LanguageLevel['level']>('intermédiaire');
  const [isPrimary, setIsPrimary] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAddLanguage = async () => {
    if (!newLanguage) {
      toast({ title: "Erreur", description: "Veuillez entrer une langue.", variant: "destructive" });
      return;
    }

    // Vérifier si la langue existe déjà
    if (languageLevels.some(lang => lang.language.toLowerCase() === newLanguage.toLowerCase())) {
      toast({ title: "Erreur", description: "Cette langue est déjà ajoutée.", variant: "destructive" });
      return;
    }

    setIsAdding(true);
    const success = await addLanguageLevel(newLanguage, newLevel, isPrimary);
    if (success) {
      setNewLanguage('');
      setNewLevel('intermédiaire');
      setIsPrimary(false);
      toast({ title: "Langue ajoutée", description: `${newLanguage} a été ajouté à vos langues.` });
    } else {
      toast({ title: "Erreur", description: error || "Une erreur est survenue lors de l'ajout de la langue.", variant: "destructive" });
    }
    setIsAdding(false);
  };

  const handleRemoveLanguage = async (language: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${language} ?`)) {
      setIsRemoving(true);
      const success = await removeLanguageLevel(language);
      if (success) {
        toast({ title: "Langue supprimée", description: `${language} a été supprimé de vos langues.` });
      } else {
        toast({ title: "Erreur", description: error || "Une erreur est survenue lors de la suppression de la langue.", variant: "destructive" });
      }
      setIsRemoving(false);
    }
  };

  if (loading) return <div>Chargement des langues...</div>;
  if (error) return <div>Erreur lors du chargement des langues : {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes langues</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Liste des langues existantes */}
          {languageLevels.length > 0 ? (
            <div className="space-y-2">
              {languageLevels.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-sm text-muted-foreground ml-2">({lang.level})</span>
                    {lang.is_primary && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Principale</span>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => handleRemoveLanguage(lang.language)}
                    disabled={isRemoving}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucune langue ajoutée.</p>
          )}

          {/* Formulaire d'ajout de langue */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-4">Ajouter une langue</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="language" className="text-right">Langue</Label>
                <Select onValueChange={setNewLanguage} value={newLanguage}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonLanguages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">Niveau</Label>
                <Select onValueChange={(value) => setNewLevel(value as LanguageLevel['level'])} value={newLevel}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLevels.map(level => (
                      <SelectItem key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center space-x-2">
                  <Checkbox
                    id="isPrimary"
                    checked={isPrimary}
                    onCheckedChange={(checked) => setIsPrimary(checked as boolean)}
                  />
                  <Label htmlFor="isPrimary">Définir comme langue principale</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                  <Button onClick={handleAddLanguage} disabled={isAdding || !newLanguage}>
                    {isAdding ? 'Ajout...' : 'Ajouter la langue'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 
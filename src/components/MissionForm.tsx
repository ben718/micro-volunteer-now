
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssociation } from '@/hooks/useAssociation'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface MissionFormData {
  title: string
  short_description: string
  description: string
  category: string
  image_url: string
  address: string
  city: string
  postal_code: string
  date: string
  start_time: string
  end_time: string
  duration: number
  spots_available: number
  min_age: number
  is_recurring: boolean
  requirements: string[]
  skills_needed: string[]
  languages_needed: string[]
  materials_provided: string[]
  materials_to_bring: string[]
  status: string
  impact_description: string
}

export default function MissionForm() {
  const { association } = useAssociation()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<MissionFormData>({
    title: '',
    short_description: '',
    description: '',
    category: '',
    image_url: '',
    address: '',
    city: '',
    postal_code: '',
    date: '',
    start_time: '',
    end_time: '',
    duration: 60,
    spots_available: 1,
    min_age: 16,
    is_recurring: false,
    requirements: [],
    skills_needed: [],
    languages_needed: [],
    materials_provided: [],
    materials_to_bring: [],
    status: 'draft',
    impact_description: ''
  })

  const categories = [
    'alimentaire',
    'social',
    'environnement',
    'education',
    'sante',
    'culture',
    'sport',
    'urgence'
  ]

  const handleInputChange = (field: keyof MissionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!association?.id) {
      toast({
        title: "Erreur",
        description: "Association non trouvée",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const missionData = {
        ...formData,
        association_id: association.id,
        latitude: null,
        longitude: null,
        recurring_pattern: null,
        impact_metrics: null,
        spots_taken: 0
      }

      const { data, error } = await supabase
        .from('missions')
        .insert([missionData])
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Succès",
        description: "Mission créée avec succès"
      })

      // Reset form
      setFormData({
        title: '',
        short_description: '',
        description: '',
        category: '',
        image_url: '',
        address: '',
        city: '',
        postal_code: '',
        date: '',
        start_time: '',
        end_time: '',
        duration: 60,
        spots_available: 1,
        min_age: 16,
        is_recurring: false,
        requirements: [],
        skills_needed: [],
        languages_needed: [],
        materials_provided: [],
        materials_to_bring: [],
        status: 'draft',
        impact_description: ''
      })

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une nouvelle mission</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre de la mission</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="short_description">Description courte</Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="postal_code">Code postal</Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleInputChange('postal_code', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="start_time">Heure de début</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="end_time">Heure de fin</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="spots_available">Places disponibles</Label>
              <Input
                id="spots_available"
                type="number"
                value={formData.spots_available}
                onChange={(e) => handleInputChange('spots_available', parseInt(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="min_age">Âge minimum</Label>
              <Input
                id="min_age"
                type="number"
                value={formData.min_age}
                onChange={(e) => handleInputChange('min_age', parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="impact_description">Description de l'impact</Label>
            <Textarea
              id="impact_description"
              value={formData.impact_description}
              onChange={(e) => handleInputChange('impact_description', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Création en cours...' : 'Créer la mission'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

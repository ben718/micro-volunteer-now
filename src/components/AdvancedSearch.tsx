import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import Button from './Button';
import toast from 'react-hot-toast';

interface SearchFilters {
  query: string;
  category: string;
  date: string;
  duration: string;
  location: string;
  status: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onReset,
  className = '',
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    date: '',
    duration: '',
    location: '',
    status: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('active', true)
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        toast.error('Erreur lors du chargement des catégories: ' + error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      category: '',
      date: '',
      duration: '',
      location: '',
      status: '',
    });
    onReset();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <form onSubmit={handleSubmit}>
        {/* Barre de recherche principale */}
        <div className="relative">
          <input
            type="text"
            name="query"
            value={filters.query}
            onChange={handleInputChange}
            placeholder="Rechercher une mission..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vs-blue-primary focus:border-vs-blue-primary"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-2.5 text-vs-blue-primary hover:text-vs-blue-dark"
          >
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
                />
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée
                </label>
                <select
                  name="duration"
                  value={filters.duration}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
                >
                  <option value="">Toutes les durées</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="120">2 heures</option>
                  <option value="180">3 heures</option>
                </select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleInputChange}
                  placeholder="Ville ou code postal"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
                />
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-vs-blue-primary focus:ring-vs-blue-primary"
                >
                  <option value="">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                Réinitialiser
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Rechercher
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdvancedSearch; 
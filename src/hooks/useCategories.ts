
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .eq('active', true)
          .order('name', { ascending: true });

        if (fetchError) throw fetchError;

        const typedCategories: Category[] = (data || []).map((category: any) => ({
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          description: category.description,
          active: category.active,
          created_at: category.created_at,
          updated_at: category.updated_at
        }));

        setCategories(typedCategories);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des catégories.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.color || 'bg-gray-500';
  };

  return {
    categories,
    loading,
    error,
    getCategoryColor,
  };
};

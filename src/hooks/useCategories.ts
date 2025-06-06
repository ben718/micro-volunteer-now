import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  active?: boolean;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;

        setCategories(data || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    return category?.color || 'bg-gray-100 text-gray-700';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    return category?.icon || '📋';
  };

  return {
    categories,
    loading,
    error,
    getCategoryColor,
    getCategoryIcon
  };
}; 
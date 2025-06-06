import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useAssociation } from './useAssociation';

export interface ImpactReport {
  id: string;
  association_id: string;
  period_start: string;
  period_end: string;
  total_missions: number;
  completed_missions: number;
  total_volunteers: number;
  total_hours: number;
  impact_metrics: any; // Ou une interface plus précise si la structure est définie
  created_at: string;
}

export const useImpactReports = () => {
  const { user, loading: authLoading } = useAuth();
  const { association, loading: associationLoading } = useAssociation();
  const [reports, setReports] = useState<ImpactReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImpactReports() {
      if (authLoading || !user || associationLoading || !association) {
        setLoading(false);
        setReports([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('impact_reports')
          .select('*')
          .eq('association_id', association.id)
          .order('period_end', { ascending: false }); // Afficher les rapports les plus récents en premier

        if (fetchError) throw fetchError;

        setReports(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des rapports d\'impact.');
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    fetchImpactReports();
  }, [user, authLoading, association, associationLoading]);

  // Vous pourriez ajouter ici des fonctions pour créer de nouveaux rapports (peut-être déclenchés manuellement ou par un processus)
  // ou pour supprimer des rapports si nécessaire.

  return {
    reports,
    loading,
    error,
  };
}; 
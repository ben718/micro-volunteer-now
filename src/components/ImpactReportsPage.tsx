import { useImpactReports } from '@/hooks/useImpactReports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ImpactReportsPage = () => {
  const { reports, loading, error } = useImpactReports();

  if (loading) return <div>Chargement des rapports d'impact...</div>;
  if (error) return <div>Erreur lors du chargement des rapports d'impact : {error}</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Rapports d'impact</h1>

      {reports.length === 0 ? (
        <p className="text-muted-foreground">Aucun rapport d'impact disponible pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <Card key={report.id}>
              <CardHeader>
                <CardTitle>
                  Rapport du {format(new Date(report.period_start), 'PPP', { locale: fr })} au {format(new Date(report.period_end), 'PPP', { locale: fr })}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Missions totales</p>
                  <p className="text-2xl font-bold">{report.total_missions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Missions complétées</p>
                  <p className="text-2xl font-bold">{report.completed_missions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bénévoles engagés</p>
                  <p className="text-2xl font-bold">{report.total_volunteers}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Heures bénévoles totales</p>
                  <p className="text-2xl font-bold">{report.total_hours}</p>
                </div>
                {/* Vous pouvez ajouter plus de détails ici si impact_metrics contient des données structurées */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImpactReportsPage; 
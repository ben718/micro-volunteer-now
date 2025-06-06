import React from 'react';
import { Heart, Users, Clock, Award } from 'lucide-react';
import { useImpactStats } from '@/hooks/useImpactStats';
import { useAuth } from '@/hooks/useAuth';

const ImpactStats = () => {
  const { user } = useAuth();
  const { data, loading, error } = useImpactStats(user?.id || '');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="impact-stat animate-pulse">
              <div className="h-6 w-6 bg-muted rounded-full mx-auto mb-2" />
              <div className="h-8 w-16 bg-muted rounded mx-auto mb-1" />
              <div className="h-4 w-24 bg-muted rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Une erreur est survenue lors du chargement des statistiques.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-2 gap-4">
        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-success" />
          </div>
          <div className="text-2xl font-bold text-foreground">{data.stats.missionsCompleted}</div>
          <div className="text-sm text-muted-foreground">missions complétées</div>
        </div>

        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-impact" />
          </div>
          <div className="text-2xl font-bold text-foreground">{data.stats.associationsHelped}</div>
          <div className="text-sm text-muted-foreground">associations aidées</div>
        </div>

        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-foreground">{data.stats.timeVolunteered}</div>
          <div className="text-sm text-muted-foreground">minutes données</div>
        </div>

        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-6 w-6 text-warning" />
          </div>
          <div className="text-2xl font-bold text-foreground">{data.stats.pointsEarned}</div>
          <div className="text-sm text-muted-foreground">points d'impact</div>
        </div>
      </div>

      {/* Progression du niveau */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">Niveau actuel</h3>
            <p className="text-sm text-primary font-medium">{data.level.current}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Prochain niveau</p>
            <p className="text-sm font-medium text-foreground">{data.level.nextLevel}</p>
          </div>
        </div>

        <div className="progress-bar mb-2">
          <div 
            className="progress-fill" 
            style={{ width: `${data.level.progress}%` }}
          ></div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Encore {data.level.missionsToNext} missions pour passer au niveau supérieur
        </p>
      </div>

      {/* Badges récents */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">Badges récents</h3>
        <div className="flex flex-wrap gap-2">
          {data.recentBadges.map(badge => (
            <span 
              key={badge.id} 
              className={`badge-earned ${badge.earned ? '' : 'opacity-50'}`}
            >
              {badge.icon} {badge.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImpactStats;

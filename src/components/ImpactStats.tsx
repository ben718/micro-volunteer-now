
import React from 'react';
import { Heart, Users, Clock, Award } from 'lucide-react';

interface ImpactStatsProps {
  stats: {
    missionsCompleted: number;
    associationsHelped: number;
    timeVolunteered: number;
    pointsEarned: number;
  };
  level: {
    current: string;
    progress: number;
    nextLevel: string;
    missionsToNext: number;
  };
}

const ImpactStats = ({ stats, level }: ImpactStatsProps) => {
  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-2 gap-4">
        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Heart className="h-6 w-6 text-success" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.missionsCompleted}</div>
          <div className="text-sm text-muted-foreground">missions complétées</div>
        </div>

        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-impact" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.associationsHelped}</div>
          <div className="text-sm text-muted-foreground">associations aidées</div>
        </div>

        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.timeVolunteered}</div>
          <div className="text-sm text-muted-foreground">minutes données</div>
        </div>

        <div className="impact-stat">
          <div className="flex items-center justify-center mb-2">
            <Award className="h-6 w-6 text-warning" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats.pointsEarned}</div>
          <div className="text-sm text-muted-foreground">points d'impact</div>
        </div>
      </div>

      {/* Progression du niveau */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">Niveau actuel</h3>
            <p className="text-sm text-primary font-medium">{level.current}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Prochain niveau</p>
            <p className="text-sm font-medium text-foreground">{level.nextLevel}</p>
          </div>
        </div>

        <div className="progress-bar mb-2">
          <div 
            className="progress-fill" 
            style={{ width: `${level.progress}%` }}
          ></div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Encore {level.missionsToNext} missions pour passer au niveau supérieur
        </p>
      </div>

      {/* Badges récents */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">Badges récents</h3>
        <div className="flex flex-wrap gap-2">
          <span className="badge-earned">🌟 Premier pas</span>
          <span className="badge-earned">⏰ Ponctuel</span>
          <span className="badge-earned">🤝 Solidaire</span>
        </div>
      </div>
    </div>
  );
};

export default ImpactStats;


import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface UserStatsCardProps {
  title?: string;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ title = "Votre impact" }) => {
  const { userStats } = useUserProfile();

  return (
    <div className="bg-card rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-foreground mb-3">{title}</h3>
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{userStats.total_missions_completed}</div>
          <div className="text-xs text-muted-foreground">Missions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{userStats.total_hours_volunteered}</div>
          <div className="text-xs text-muted-foreground">Heures données</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-warning">{userStats.associations_helped}</div>
          <div className="text-xs text-muted-foreground">Associations</div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;

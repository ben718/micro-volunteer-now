import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface UserStatsCardProps {
  title?: string;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ title = "Votre impact" }) => {
  const { userStats } = useUserProfile();

  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{userStats.total_missions_completed}</div>
          <div className="text-xs text-gray-500">Missions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.total_hours_volunteered}</div>
          <div className="text-xs text-gray-500">Heures données</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{userStats.associations_helped}</div>
          <div className="text-xs text-gray-500">Associations</div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;


import React from 'react';
import { UserStats } from '@/types/mission';

interface UserStatsCardProps {
  stats: UserStats;
  title?: string;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ stats, title = "Votre impact" }) => {
  return (
    <div className="bg-white rounded-xl p-4">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="flex justify-between">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.missions}</div>
          <div className="text-xs text-gray-500">Missions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.timeGiven}</div>
          <div className="text-xs text-gray-500">Temps donné</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.associations}</div>
          <div className="text-xs text-gray-500">Associations</div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;

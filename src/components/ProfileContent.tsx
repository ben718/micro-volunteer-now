import React from 'react';
import { User } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LanguageLevelsForm } from './LanguageLevelsForm';

export const ProfileContent = () => {
  const { userStats } = useUserProfile();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold">
          <User className="w-8 h-8 text-gray-500" />
        </div>
        <div>
          <div className="font-semibold text-lg">Profil utilisateur</div>
          <div className="text-sm text-muted-foreground">Langues : {userStats.languages?.join(', ') || 'Non renseigné'}</div>
        </div>
      </div>

      <LanguageLevelsForm />
    </div>
  );
}; 
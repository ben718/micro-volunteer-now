
export interface Mission {
  id: string;
  title: string;
  description: string;
  association: string;
  duration: string;
  distance: string;
  startTime: string;
  category: string;
  isUrgent?: boolean;
  participants: {
    current: number;
    max: number;
  };
  date?: string;
  time?: string;
  location: string;
  status?: 'upcoming' | 'completed' | 'cancelled' | 'today';
  points?: number;
  rating?: number;
}

export interface UserStats {
  missions: number;
  timeGiven: string;
  associations: number;
}

export interface Badge {
  name: string;
  icon: string;
  color: string;
  earned: boolean;
}

export interface Category {
  name: string;
  icon: string;
  color: string;
  active?: boolean;
}

export interface Association {
  name: string;
  missions: number;
  avatar: string;
}

export interface ActivityCost {
  energy?: number;
  money?: number;
  stress?: number;
}

export interface ActivityReward {
  knowledge?: number;
  money?: number;
  social?: number;
  energy?: number;
}

export interface ActivityEffect {
  id: string;
  type: string;
  value: number;
  duration?: number;
  target?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  duration: number; // in hours
  costs: ActivityCost;
  rewards: ActivityReward;
  requirements?: {
    energy?: number;
    money?: number;
  };
}
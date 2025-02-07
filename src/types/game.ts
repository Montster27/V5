export interface ResourceDisplayProps {
  money: number;
  knowledge: number;
  socialPoints: number;
  energy: number;
  stress: number;
}

export interface GameState {
  resources: ResourceDisplayProps;
  // Add other state properties as needed
}

export interface GameError extends Error {
  code?: string;
  details?: any;
}
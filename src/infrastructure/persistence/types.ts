import { RootState } from '../../application/store';

export interface SaveGame {
  id: string;
  name: string;
  timestamp: number;
  gameState: Partial<RootState>;
  screenshot?: string;
  version: string;
}

export interface SaveMetadata {
  id: string;
  name: string;
  timestamp: number;
  characterInfo: {
    name: string;
    major: string;
    day: number;
  };
  version: string;
}

export const CURRENT_SAVE_VERSION = '1.0.0';
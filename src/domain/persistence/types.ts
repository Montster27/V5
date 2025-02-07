import { GameTime } from '../time/types';
import { Resource } from '../resources/types';

export interface GameState {
  time: GameTime;
  resources: Resource[];
  version: string;
}

export interface SaveService {
  saveGame(state: GameState, slotId: string): Promise<void>;
  loadGame(slotId: string): Promise<GameState>;
}
import { GameTime } from '../time/types';
import { Resources } from '../resources/types';
import { GameEvent } from '../events/types';

export interface GameState {
  time: GameTime;
  resources: Resources;
  activeEvents: GameEvent[];
  scheduledEvents: GameEvent[];
  version: string;
}

export interface SaveService {
  saveGame(state: GameState, slotId: string): Promise<void>;
  loadGame(slotId: string): Promise<GameState>;
  listSaves(): Promise<string[]>;
  deleteSave(slotId: string): Promise<void>;
}
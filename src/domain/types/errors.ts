export enum ErrorLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export enum ErrorType {
  GENERAL = 'GENERAL',
  REACT = 'REACT',
  STATE = 'STATE',
  NETWORK = 'NETWORK',
  PERSISTENCE = 'PERSISTENCE',
  RESOURCE = 'RESOURCE',
  GAME_LOGIC = 'GAME_LOGIC'
}

export interface GameError {
  timestamp: Date;
  message: string;
  type: ErrorType;
  level: ErrorLevel;
  stack?: string;
}
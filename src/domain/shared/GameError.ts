// /Users/montysharma/Documents/V5/mmv_clean/src/domain/shared/GameError.ts

export class GameError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly severity: 'warning' | 'error' | 'fatal' = 'error',
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'GameError';
  }
}
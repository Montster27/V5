// /Users/montysharma/Documents/V5/mmv_clean/src/domain/events/EventTypes.ts

export type EventType = 'ACTIVITY' | 'STATUS_CHANGE' | 'MILESTONE' | 'SYSTEM';

export interface GameEvent {
  id: string;
  type: EventType;
  timestamp: number;
  title: string;
  description: string;
  severity?: 'info' | 'warning' | 'critical';
  metadata?: Record<string, any>;
}

export interface ActivityEvent extends GameEvent {
  type: 'ACTIVITY';
  metadata: {
    activityType: 'rest' | 'study' | 'work' | 'social';
    duration: number;
    energyImpact: number;
    stressImpact: number;
  };
}

export interface StatusChangeEvent extends GameEvent {
  type: 'STATUS_CHANGE';
  metadata: {
    statusType: 'energy' | 'stress';
    oldValue: number;
    newValue: number;
    reason: string;
  };
}

export interface MilestoneEvent extends GameEvent {
  type: 'MILESTONE';
  metadata: {
    milestoneType: string;
    achievement: string;
  };
}
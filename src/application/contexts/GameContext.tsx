import React, { createContext, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { timeSlice } from '../store/slices/timeSlice';
import { resourceSlice } from '../store/slices/resourceSlice';
import { EventChoice, TimeState } from '../../domain/types/gameState';

interface GameContextValue {
  // Time management
  currentTime: { day: number; hour: number };
  allocatedHours: TimeState['allocatedHours'];
  updateTimeAllocation: (newHours: Partial<TimeState['allocatedHours']>) => void;
  
  // Resource management
  resources: RootState['resources'];
  applyEventChoice: (choice: EventChoice) => void;
  
  // Game state
  isGamePaused: boolean;
  togglePause: () => void;
  
  // Utility functions
  formatTime: (hour: number) => string;
  calculateEfficiency: (activity: keyof TimeState['allocatedHours']) => number;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const time = useSelector((state: RootState) => state.time);
  const resources = useSelector((state: RootState) => state.resources);
  const [isGamePaused, setIsGamePaused] = React.useState(false);

  const updateTimeAllocation = useCallback((newHours: Partial<TimeState['allocatedHours']>) => {
    dispatch(timeSlice.actions.allocateHours(newHours));
  }, [dispatch]);

  const applyEventChoice = useCallback((choice: EventChoice) => {
    if (choice.consequences.resources) {
      dispatch(resourceSlice.actions.applyEventEffect(choice.consequences.resources));
    }
  }, [dispatch]);

  const togglePause = useCallback(() => {
    setIsGamePaused(prev => !prev);
  }, []);

  const formatTime = useCallback((hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  }, []);

  const calculateEfficiency = useCallback((activity: keyof TimeState['allocatedHours']) => {
    // Base efficiency starts at 1.0
    let efficiency = 1.0;

    // Apply energy impact
    if (resources.energy < 50) {
      efficiency *= 0.7;
    } else if (resources.energy < 25) {
      efficiency *= 0.4;
    }

    // Apply stress impact
    if (resources.stress > 75) {
      efficiency *= 0.6;
    } else if (resources.stress > 50) {
      efficiency *= 0.8;
    }

    // Activity-specific modifiers
    switch (activity) {
      case 'study':
        // Study efficiency drops more sharply with low energy
        if (resources.energy < 50) {
          efficiency *= 0.6;
        }
        break;
      case 'work':
        // Work efficiency is less affected by stress
        efficiency = Math.min(1.0, efficiency * 1.2);
        break;
      case 'social':
        // Social activities are less affected by energy
        efficiency = Math.min(1.0, efficiency * 1.1);
        break;
    }

    // Ensure efficiency stays between 0.3 and 1.0
    return Math.max(0.3, Math.min(1.0, efficiency));
  }, [resources.energy, resources.stress]);

  const value = {
    currentTime: { day: time.currentDay, hour: time.currentHour },
    allocatedHours: time.allocatedHours,
    updateTimeAllocation,
    resources,
    applyEventChoice,
    isGamePaused,
    togglePause,
    formatTime,
    calculateEfficiency,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
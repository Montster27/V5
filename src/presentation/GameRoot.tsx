import React, { useEffect, useState } from 'react';
import { GameEngine } from '../application/GameEngine';
import { GameTime } from '../domain/time/types';
import { Resources } from '../domain/resources/types';
import { GameEvent } from '../domain/events/types';

export const GameRoot: React.FC = () => {
  const [engine] = useState(() => GameEngine.create());
  const [time, setTime] = useState<GameTime>();
  const [resources, setResources] = useState<Resources>();
  const [events, setEvents] = useState<GameEvent[]>();

  useEffect(() => {
    const eventBus = (engine as any).eventBus;
    
    eventBus.subscribe('TIME_UPDATED', setTime);
    eventBus.subscribe('RESOURCE_CHANGED', setResources);
    eventBus.subscribe('EVENT_ACTIVATED', (event: GameEvent) => {
      setEvents(prev => [...(prev || []), event]);
    });

    engine.start();
    return () => engine.stop();
  }, [engine]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Time Display */}
      {time && (
        <div className="absolute top-4 right-4">
          Day {time.day}, {time.hour}:{time.minute.toString().padStart(2, '0')}
        </div>
      )}

      {/* Resources */}
      {resources && (
        <div className="absolute top-4 left-4 space-y-2">
          <div>Energy: {resources.energy}</div>
          <div>Stress: {resources.stress}</div>
          <div>Money: ${resources.money}</div>
          <div>Knowledge: {resources.knowledge}</div>
          <div>Social: {resources.social}</div>
        </div>
      )}

      {/* Active Events */}
      {events && events.length > 0 && (
        <div className="absolute bottom-4 right-4">
          {events.map(event => (
            <div key={event.id} className="bg-gray-800 p-4 rounded-lg mb-2">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
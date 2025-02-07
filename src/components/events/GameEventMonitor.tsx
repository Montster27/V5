// src/components/events/GameEventMonitor.tsx

import React, { useState, useCallback } from 'react';
import { useEventBus, useGameEvent } from '@/hooks/useEventBus';
import type { GameEvent } from '@/domain/events/types';

interface EventLogEntry {
  id: number;
  event: GameEvent;
  receivedAt: number;
}

export const GameEventMonitor: React.FC = () => {
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const { dispatch } = useEventBus();
  
  // Keep last 50 events
  const addToLog = useCallback((event: GameEvent) => {
    setEventLog(prev => [
      {
        id: Date.now(),
        event,
        receivedAt: Date.now()
      },
      ...prev.slice(0, 49)
    ]);
  }, []);

  // Subscribe to all game events
  useGameEvent('*', addToLog);

  // Example of dispatching a test event
  const dispatchTestEvent = useCallback(() => {
    dispatch({
      type: 'TEST_EVENT',
      payload: {
        message: 'Test event dispatched',
        timestamp: Date.now()
      }
    });
  }, [dispatch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Game Event Monitor</h2>
        <button
          onClick={dispatchTestEvent}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Dispatch Test Event
        </button>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-2">Time</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Payload</th>
            </tr>
          </thead>
          <tbody>
            {eventLog.map(entry => (
              <tr key={entry.id} className="border-t">
                <td className="p-2">
                  {new Date(entry.receivedAt).toLocaleTimeString()}
                </td>
                <td className="p-2 font-mono text-sm">
                  {entry.event.type}
                </td>
                <td className="p-2">
                  <pre className="text-sm">
                    {JSON.stringify(entry.event.payload, null, 2)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
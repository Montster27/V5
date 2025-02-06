import React from 'react';
import { GameEvent, EventChoice } from '../../domain/events/types';

interface EventDialogProps {
  event: GameEvent;
  onChoiceSelected: (choice: EventChoice) => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({ event, onChoiceSelected }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{event.title}</h2>
        <p className="mb-6">{event.description}</p>
        
        <div className="space-y-4">
          {event.choices.map(choice => (
            <button
              key={choice.id}
              onClick={() => onChoiceSelected(choice)}
              className="w-full p-3 text-left hover:bg-gray-100 rounded"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
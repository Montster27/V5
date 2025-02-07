import React from 'react';
import ResourceDisplay from './ResourceDisplay';
import EventDisplay from './EventDisplay';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { ResourceDisplayProps } from '../types/game';
import { EventDisplayProps } from '../types/events';

interface GameInterfaceProps {
  resources: ResourceDisplayProps;
  event?: EventDisplayProps;
  onChooseOption: (optionId: string) => void;
}

const GameInterface: React.FC<GameInterfaceProps> = ({
  resources,
  event,
  onChooseOption
}) => {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleError = (error: Error) => {
    setErrorMessage(error.message);
  };

  return (
    <div className="p-4">
      <ResourceDisplay resources={resources} />
      {event && <EventDisplay event={event} onChooseOption={onChooseOption} />}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};

export default GameInterface;

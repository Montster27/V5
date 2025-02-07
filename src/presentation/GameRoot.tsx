import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { GameEngine } from '../application/GameEngine';
import GameInterface from '../components/GameInterface';
import { ErrorDialog } from '../components/ErrorDialog';

 

interface GameRootProps {
  error?: Error;
}

const GameRoot: React.FC<GameRootProps> = ({ error }) => {
  const gameEngine = React.useRef<GameEngine>(new GameEngine());
  const [isStarted, setIsStarted] = React.useState(false);

  React.useEffect(() => {
    const engine = gameEngine.current;
    
    engine.initialize();
    engine.create();
    engine.registerErrorHandler((error: Error) => {
      console.error('Game Engine Error:', error);
    });

    engine.start();
    setIsStarted(true);

    return () => {
      engine.stop();
      setIsStarted(false);
    };
  }, []);

  const handleRestart = () => {
    gameEngine.current.onRestart();
  };

  return (
    <Provider store={store}>
      <div className="game-root">
        <GameInterface
          resources={store.getState().resources}
          onChooseOption={(optionId) => {
            // Handle option selection
          }}
        />
        {error && (
          <ErrorDialog
            isOpen={true}
            onClose={handleRestart}
            message={error.message}
          />
        )}
      </div>
    </Provider>
  );
};

export default GameRoot;

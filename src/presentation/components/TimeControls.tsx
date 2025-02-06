import React, { useState } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';

interface TimeControlsProps {
  onPause: () => void;
  onPlay: () => void;
  onSpeedChange: (speed: number) => void;
}

export const TimeControls: React.FC<TimeControlsProps> = ({ 
  onPause, 
  onPlay, 
  onSpeedChange 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handlePlayPause}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isPlaying ? (
              <PauseIcon className="w-6 h-6" />
            ) : (
              <PlayIcon className="w-6 h-6" />
            )}
          </button>

          <div className="flex space-x-2">
            {[1, 2, 3].map(speedOption => (
              <button
                key={speedOption}
                onClick={() => handleSpeedChange(speedOption)}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  speed === speedOption
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {speedOption}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
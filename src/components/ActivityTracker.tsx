import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { BookOpen, Briefcase, Users, Coffee } from 'lucide-react';

interface ActivityTrackerProps {
  onError: (message: string) => void;
}

interface Activity {
  id: string;
  name: string;
  icon: React.ReactNode;
  duration: number;
  energy: number;
  stress: number;
  knowledge?: number;
  social?: number;
  money?: number;
}

export const ActivityTracker: React.FC<ActivityTrackerProps> = ({ onError }) => {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [duration, setDuration] = useState(1);

  const activities: Activity[] = [
    {
      id: 'study',
      name: 'Study',
      icon: <BookOpen className="w-5 h-5" />,
      duration: 1,
      energy: -10,
      stress: 15,
      knowledge: 20
    },
    {
      id: 'work',
      name: 'Work',
      icon: <Briefcase className="w-5 h-5" />,
      duration: 4,
      energy: -20,
      stress: 20,
      money: 50
    },
    {
      id: 'socialize',
      name: 'Socialize',
      icon: <Users className="w-5 h-5" />,
      duration: 2,
      energy: -5,
      stress: -10,
      social: 15
    },
    {
      id: 'rest',
      name: 'Rest',
      icon: <Coffee className="w-5 h-5" />,
      duration: 1,
      energy: 15,
      stress: -15
    }
  ];

  const handleActivitySelect = (id: string) => {
    setSelectedActivity(id);
    const activity = activities.find(a => a.id === id);
    if (activity) {
      setDuration(activity.duration);
    }
  };

  const handleStart = () => {
    if (!selectedActivity) {
      onError('Please select an activity first');
      return;
    }

    const activity = activities.find(a => a.id === selectedActivity);
    if (!activity) return;

    // This would normally dispatch to your game state
    console.log('Starting activity:', {
      activity: selectedActivity,
      duration,
      effects: {
        energy: activity.energy * duration,
        stress: activity.stress * duration,
        knowledge: activity.knowledge ? activity.knowledge * duration : 0,
        social: activity.social ? activity.social * duration : 0,
        money: activity.money ? activity.money * duration : 0
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Activities</h2>
        <div className="grid grid-cols-2 gap-4">
          {activities.map((activity) => (
            <Card
              key={activity.id}
              className={`p-4 cursor-pointer transition ${
                selectedActivity === activity.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleActivitySelect(activity.id)}
            >
              <div className="flex items-center space-x-3">
                {activity.icon}
                <div>
                  <h3 className="font-medium">{activity.name}</h3>
                  <p className="text-sm text-gray-600">
                    {activity.duration}hr
                    {activity.duration > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Energy</span>
                  <span className={activity.energy > 0 ? 'text-green-600' : 'text-red-600'}>
                    {activity.energy > 0 ? '+' : ''}{activity.energy}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stress</span>
                  <span className={activity.stress < 0 ? 'text-green-600' : 'text-red-600'}>
                    {activity.stress > 0 ? '+' : ''}{activity.stress}
                  </span>
                </div>
                {activity.knowledge && (
                  <div className="flex items-center justify-between">
                    <span>Knowledge</span>
                    <span className="text-blue-600">+{activity.knowledge}</span>
                  </div>
                )}
                {activity.social && (
                  <div className="flex items-center justify-between">
                    <span>Social</span>
                    <span className="text-purple-600">+{activity.social}</span>
                  </div>
                )}
                {activity.money && (
                  <div className="flex items-center justify-between">
                    <span>Money</span>
                    <span className="text-green-600">+${activity.money}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedActivity && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <span className="font-medium">Duration (hours):</span>
              <input
                type="number"
                min="1"
                max="8"
                value={duration}
                onChange={(e) => setDuration(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                className="w-20 px-2 py-1 border rounded"
              />
            </label>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Start Activity
          </button>
        </div>
      )}
    </div>
  );
};
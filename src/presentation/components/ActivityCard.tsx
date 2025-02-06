import React from 'react';
import { Activity } from '../../domain/activities/types';

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  active?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onSelect, active }) => {
  const energyCost = activity.effects.find(e => e.attribute === 'energy')?.value || 0;
  const stressCost = activity.effects.find(e => e.attribute === 'stress')?.value || 0;

  return (
    <button
      onClick={() => onSelect(activity)}
      className={`w-full p-4 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-blue-100 border-2 border-blue-500 shadow-lg' 
          : 'bg-white border border-gray-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{activity.name}</h3>
        <span className="text-sm text-gray-500">{activity.duration}h</span>
      </div>

      <p className="text-gray-600 mb-3">{activity.description}</p>

      <div className="flex space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
          <span>Energy: {energyCost}</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-400 mr-2" />
          <span>Stress: {stressCost}</span>
        </div>
      </div>

      {activity.requirements && (
        <div className="mt-2 pt-2 border-t text-sm text-gray-500">
          <p>Requirements:</p>
          <ul className="list-disc list-inside">
            {activity.requirements.map((req, i) => (
              <li key={i}>{req.attribute}: {req.value}</li>
            ))}
          </ul>
        </div>
      )}
    </button>
  );
};
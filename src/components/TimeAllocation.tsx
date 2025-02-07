import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';
import { useGame } from '../application/contexts/GameContext';

const ACTIVITY_LABELS = {
  study: 'Study Time',
  sleep: 'Sleep',
  social: 'Social Activities',
  work: 'Work',
  leisure: 'Leisure'
};

export const TimeAllocation: React.FC = () => {
  const { allocatedHours, updateTimeAllocation, calculateEfficiency } = useGame();
  
  const handleSliderChange = (activity: string, newValue: number[]) => {
    const value = newValue[0];
    updateTimeAllocation({ [activity]: value });
  };

  const renderActivitySlider = (activity: string, label: string) => {
    const efficiency = calculateEfficiency(activity as keyof typeof allocatedHours);
    const efficiencyColor = efficiency > 0.8 ? 'text-green-500' : 
                           efficiency > 0.5 ? 'text-yellow-500' : 
                           'text-red-500';

    return (
      <div className="mb-4" key={activity}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {allocatedHours[activity as keyof typeof allocatedHours]}h
            </span>
            <span className={`text-xs ${efficiencyColor}`}>
              ({Math.round(efficiency * 100)}% efficiency)
            </span>
          </div>
        </div>
        <Slider
          value={[allocatedHours[activity as keyof typeof allocatedHours]]}
          max={24}
          step={1}
          className="w-full"
          onValueChange={(value) => handleSliderChange(activity, value)}
        />
      </div>
    );
  };

  const totalHours = Object.values(allocatedHours).reduce((sum, hours) => sum + hours, 0);

  return (
    <Card className="bg-slate-50 border-slate-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <CardTitle className="text-lg font-semibold text-slate-800">Time Allocation</CardTitle>
        </div>
        <div className="text-sm text-slate-500">
          Total Hours: {totalHours}/24
        </div>
      </CardHeader>
      <CardContent>
        {Object.entries(ACTIVITY_LABELS).map(([activity, label]) => 
          renderActivitySlider(activity, label)
        )}
      </CardContent>
    </Card>
  );
};

export default TimeAllocation;
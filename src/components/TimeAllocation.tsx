import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { BookOpen, Briefcase, Users, Moon } from 'lucide-react';

interface TimeAllocationProps {
  onTimeChange: (allocations: TimeAllocations) => void;
}

interface TimeAllocations {
  study: number;
  work: number;
  social: number;
  sleep: number;
}

export const TimeAllocation: React.FC<TimeAllocationProps> = ({ onTimeChange }) => {
  const [allocations, setAllocations] = useState<TimeAllocations>({
    study: 8,
    work: 4,
    social: 4,
    sleep: 8
  });

  const MAX_HOURS = 20;
  const MIN_SLEEP = 1;

  const handleTimeChange = (activity: keyof TimeAllocations, value: number[]) => {
    const newValue = value[0];
    const totalOtherTime = Object.entries(allocations)
      .filter(([key]) => key !== activity)
      .reduce((sum, [_, val]) => sum + val, 0);

    // Ensure we don't exceed 24 hours total
    if (totalOtherTime + newValue > 24) {
      return;
    }

    // Ensure minimum sleep requirement
    if (activity === 'sleep' && newValue < MIN_SLEEP) {
      return;
    }

    // Ensure maximum study time
    if (activity === 'study' && newValue > MAX_HOURS) {
      return;
    }

    setAllocations(prev => {
      const updated = { ...prev, [activity]: newValue };
      onTimeChange(updated);
      return updated;
    });
  };

  const activityConfig = {
    study: {
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      label: 'Study',
      color: 'indigo'
    },
    work: {
      icon: <Briefcase className="w-4 h-4 text-amber-600" />,
      label: 'Work',
      color: 'amber'
    },
    social: {
      icon: <Users className="w-4 h-4 text-rose-600" />,
      label: 'Social',
      color: 'rose'
    },
    sleep: {
      icon: <Moon className="w-4 h-4 text-sky-600" />,
      label: 'Sleep',
      color: 'sky'
    }
  };

  const getLabel = (activity: keyof TimeAllocations) => {
    const config = activityConfig[activity];
    const hours = allocations[activity];
    
    return (
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center space-x-2">
          {config.icon}
          <span className="text-slate-700 font-medium">{config.label}</span>
        </div>
        <span className={`text-sm font-medium text-${config.color}-600`}>
          {hours}h
        </span>
      </div>
    );
  };

  // Calculate remaining hours
  const totalHours = Object.values(allocations).reduce((sum, val) => sum + val, 0);
  const remainingHours = 24 - totalHours;

  return (
    <Card className="bg-slate-50 border-slate-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Daily Time Allocation</h2>
        <div className="space-y-6">
          {(Object.keys(allocations) as Array<keyof TimeAllocations>).map((activity) => (
            <div key={activity} className="space-y-2">
              {getLabel(activity)}
              <Slider
                value={[allocations[activity]]}
                min={activity === 'sleep' ? MIN_SLEEP : 0}
                max={activity === 'study' ? MAX_HOURS : 12}
                step={1}
                onValueChange={(value) => handleTimeChange(activity, value)}
                className={`w-full`}
              />
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Hours Allocated</span>
              <span className={totalHours > 24 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
                {totalHours}/24
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-600">Remaining</span>
              <span className={`font-medium ${remainingHours < 0 ? 'text-red-600' : 'text-slate-700'}`}>
                {remainingHours}h
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { StressEnergyDisplay } from './StressEnergyDisplay';
import { TimeAllocation } from './TimeAllocation';
import { ResourceDisplay } from './ResourceDisplay';
import { EventDisplay } from './EventDisplay';
import { NewsGossip } from './NewsGossip';
import { ErrorDialog } from './ErrorDialog';

const GameInterface = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Mock data - would normally come from game state
  const resources = {
    money: 1000,
    knowledge: 500,
    social: 300
  };

  const currentEvent = {
    title: "Study Group Invitation",
    description: "Sarah from your Economics class is forming a study group for the upcoming midterm. She's invited you to join. How do you respond?",
    options: [
      {
        id: "1",
        text: "Join the study group - it could help improve your grades and make new friends",
        impact: { knowledge: 20, social: 10, money: -5 }
      },
      {
        id: "2",
        text: "Decline politely - you prefer to study alone",
        impact: { knowledge: 5, social: -5 }
      },
      {
        id: "3",
        text: "Suggest an alternative time that works better for you",
        impact: { knowledge: 15, social: 5 }
      }
    ]
  };

  const newsItems = [
    {
      id: "1",
      type: "news" as const,
      title: "New Computer Lab Opening",
      content: "The university is opening a state-of-the-art computer lab next week. Early access available for CS majors.",
      timestamp: "2 hours ago"
    },
    {
      id: "2",
      type: "gossip" as const,
      title: "Drama in the Dorms",
      content: "Rumor has it that the RA on the third floor is dating a professor...",
      timestamp: "4 hours ago"
    }
  ];

  const handleError = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
  };

  const handleTimeChange = (allocations: any) => {
    console.log('Time allocations changed:', allocations);
  };

  const handleEventChoice = (optionId: string) => {
    console.log('Event choice made:', optionId);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-slate-300" />
            <span className="text-lg font-semibold">September 1, 1983</span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
          {/* Left Column - Stats and Resources */}
          <div className="col-span-3 space-y-6">
            <Card className="bg-slate-50 border-slate-200 p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Status</h2>
              <StressEnergyDisplay />
            </Card>
            <Card className="bg-slate-50 border-slate-200 p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Resources</h2>
              <ResourceDisplay resources={resources} />
            </Card>
          </div>

          {/* Center Column - Current Event */}
          <div className="col-span-6">
            <EventDisplay event={currentEvent} onChooseOption={handleEventChoice} />
          </div>

          {/* Right Column - Time Allocation and News */}
          <div className="col-span-3 space-y-6">
            <TimeAllocation onTimeChange={handleTimeChange} />
            <NewsGossip items={newsItems} />
          </div>
        </div>
      </div>

      {/* Error Dialog */}
      <ErrorDialog
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default GameInterface;
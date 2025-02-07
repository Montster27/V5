import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Brain, Users } from 'lucide-react';

interface ResourceChange {
  money?: number;
  knowledge?: number;
  social?: number;
}

interface EventOption {
  id: string;
  text: string;
  impact: ResourceChange;
}

interface EventDisplayProps {
  event: {
    title: string;
    description: string;
    options: EventOption[];
  };
  onChooseOption: (optionId: string) => void;
}

export const EventDisplay: React.FC<EventDisplayProps> = ({ event, onChooseOption }) => {
  const renderImpact = (impact: ResourceChange) => {
    return (
      <div className="flex gap-4 mt-2">
        {impact.money !== undefined && (
          <div className="flex items-center">
            <Coins className="w-4 h-4 mr-1 text-amber-600" />
            <span className={impact.money >= 0 ? "text-green-600" : "text-red-600"}>
              {impact.money > 0 ? "+" : ""}{impact.money}
            </span>
          </div>
        )}
        {impact.knowledge !== undefined && (
          <div className="flex items-center">
            <Brain className="w-4 h-4 mr-1 text-indigo-600" />
            <span className={impact.knowledge >= 0 ? "text-green-600" : "text-red-600"}>
              {impact.knowledge > 0 ? "+" : ""}{impact.knowledge}
            </span>
          </div>
        )}
        {impact.social !== undefined && (
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1 text-rose-600" />
            <span className={impact.social >= 0 ? "text-green-600" : "text-red-600"}>
              {impact.social > 0 ? "+" : ""}{impact.social}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{event.title}</h2>
        <p className="text-slate-600 text-lg mb-6">{event.description}</p>
        
        <div className="space-y-4">
          {event.options.map((option) => (
            <div key={option.id} className="border rounded-lg p-4 hover:border-slate-400 transition-colors">
              <Button
                variant="ghost"
                className="w-full text-left justify-start h-auto normal-case p-0 hover:no-underline"
                onClick={() => onChooseOption(option.id)}
              >
                <div>
                  <p className="text-slate-700 font-medium mb-1">{option.text}</p>
                  {renderImpact(option.impact)}
                </div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
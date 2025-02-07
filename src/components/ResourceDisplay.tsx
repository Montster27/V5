import React from 'react';
import { Card } from '@/components/ui/card';
import { Coins, Brain, Users } from 'lucide-react';

interface ResourceDisplayProps {
  resources: {
    money: number;
    knowledge: number;
    social: number;
  };
}

export const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources }) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <Card className="bg-slate-50 border-slate-200">
        <div className="flex items-center p-3">
          <Coins className="w-5 h-5 text-amber-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-slate-700">Money</p>
            <p className="text-lg font-semibold text-amber-600">${resources.money.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-50 border-slate-200">
        <div className="flex items-center p-3">
          <Brain className="w-5 h-5 text-indigo-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-slate-700">Knowledge</p>
            <p className="text-lg font-semibold text-indigo-600">{resources.knowledge.toLocaleString()} pts</p>
          </div>
        </div>
      </Card>

      <Card className="bg-slate-50 border-slate-200">
        <div className="flex items-center p-3">
          <Users className="w-5 h-5 text-rose-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-slate-700">Social</p>
            <p className="text-lg font-semibold text-rose-600">{resources.social.toLocaleString()} pts</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
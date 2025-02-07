import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResourceDisplayProps } from '../types/game';
import { Brain, Coins, Heart, Battery, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';

const CoinsFixed = Coins as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BrainFixed = Brain as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const HeartFixed = Heart as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const BatteryFixed = Battery as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const GaugeFixed = Gauge as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

const ResourceDisplay: React.FC<{ resources: ResourceDisplayProps }> = ({ resources }) => {
  const formatNumber = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(num);
  };

  const getCardClass = (value: number, isStress: boolean = false) => {
    const threshold = isStress ? 80 : 30;
    const condition = isStress ? value >= threshold : value <= threshold;
    
    return cn(
      'rounded-lg border text-card-foreground shadow-sm',
      condition ? 'bg-red-50 dark:bg-red-900/10' : 'bg-card'
    );
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      <Card role="article" className={cn('rounded-lg border bg-card text-card-foreground shadow-sm')}>
        <CardContent className="p-4 flex flex-col items-center">
          <CoinsFixed className="h-6 w-6 text-yellow-500" />
          <span className="mt-2 text-sm font-semibold">Money</span>
          <span className="text-lg" data-testid="money-value">
            ${formatNumber(resources.money)}
          </span>
        </CardContent>
      </Card>

      <Card role="article" className={cn('rounded-lg border bg-card text-card-foreground shadow-sm')}>
        <CardContent className="p-4 flex flex-col items-center">
          <BrainFixed className="h-6 w-6 text-blue-500" />
          <span className="mt-2 text-sm font-semibold">Knowledge</span>
          <span className="text-lg" data-testid="knowledge-value">
            {formatNumber(resources.knowledge)}
          </span>
        </CardContent>
      </Card>

      <Card role="article" className={cn('rounded-lg border bg-card text-card-foreground shadow-sm')}>
        <CardContent className="p-4 flex flex-col items-center">
          <HeartFixed className="h-6 w-6 text-red-500" />
          <span className="mt-2 text-sm font-semibold">Social</span>
          <span className="text-lg" data-testid="social-value">
            {formatNumber(resources.socialPoints)}
          </span>
        </CardContent>
      </Card>

      <Card role="article" className={getCardClass(resources.energy)}>
        <CardContent 
          className="p-4 flex flex-col items-center" 
          title="Current Energy Level"
          data-testid="energy-bar"
        >
          <BatteryFixed className="h-6 w-6 text-green-500" />
          <span className="mt-2 text-sm font-semibold">Energy</span>
          <span className="text-lg">
            {formatNumber(resources.energy)}%
          </span>
        </CardContent>
      </Card>

      <Card role="article" className={getCardClass(resources.stress, true)}>
        <CardContent className="p-4 flex flex-col items-center">
          <GaugeFixed className="h-6 w-6 text-purple-500" />
          <span className="mt-2 text-sm font-semibold">Stress</span>
          <span className="text-lg">
            {formatNumber(resources.stress)}%
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceDisplay;
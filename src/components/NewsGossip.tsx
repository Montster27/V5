import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Newspaper, MessageCircle } from 'lucide-react';

interface NewsItem {
  id: string;
  type: 'news' | 'gossip';
  title: string;
  content: string;
  timestamp: string;
}

interface NewsGossipProps {
  items: NewsItem[];
}

export const NewsGossip: React.FC<NewsGossipProps> = ({ items }) => {
  return (
    <Card className="bg-slate-50 border-slate-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">News & Gossip</h2>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg p-3 border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.type === 'news' ? (
                    <Newspaper className="w-4 h-4 text-blue-600" />
                  ) : (
                    <MessageCircle className="w-4 h-4 text-purple-600" />
                  )}
                  <span className="text-sm text-slate-500">{item.timestamp}</span>
                </div>
                <h3 className="font-medium text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};
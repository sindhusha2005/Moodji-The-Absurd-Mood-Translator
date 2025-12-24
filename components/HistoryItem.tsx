
import React from 'react';
import { EmojiTranslation } from '../types';

interface HistoryItemProps {
  item: EmojiTranslation;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all hover:bg-white/20">
      <div className="flex flex-col">
        <span className="text-xs text-indigo-200 uppercase tracking-widest font-bold">The Mood:</span>
        <span className="text-white font-medium italic">"{item.mood}"</span>
      </div>
      <div className="flex flex-col items-start sm:items-end">
        <span className="text-xs text-indigo-200 uppercase tracking-widest font-bold">The Chaos:</span>
        <span className="text-3xl tracking-tighter sm:tracking-normal">{item.emojis}</span>
      </div>
    </div>
  );
};

// src/components/atoms/LeagueStatusBadge.jsx
import React from 'react';
import { Radio } from 'lucide-react';

export const LeagueStatusBadge = ({ status = 'UPCOMING' }) => {
  const statusStyles = {
    LIVE: 'bg-red-500/15 text-red-400 border-red-500/30',
    UPCOMING: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    PAST: 'bg-slate-800 text-slate-400 border-slate-700'
  };

  const badgeStyle = statusStyles[status] || statusStyles.UPCOMING;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-black font-mono uppercase tracking-widest border flex items-center gap-1.5 ${badgeStyle}`}
    >
      {status === 'LIVE' && <Radio className="w-3.5 h-3.5 animate-pulse" />}
      <span>{status}</span>
    </span>
  );
};

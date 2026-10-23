// src/components/molecules/PlayerRosterSection.jsx
import React from 'react';
import { RosterPlayerCard } from '../atoms/RosterPlayerCard';

export const PlayerRosterSection = ({
  title,
  subtitle,
  players = [],
  isLeagueSquad = true,
  emptyMessage,
  icon: IconComponent
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          {IconComponent && (
            <IconComponent
              className={`w-5 h-5 ${
                isLeagueSquad ? 'text-emerald-400' : 'text-slate-400'
              }`}
            />
          )}
          <h2 className="text-lg font-black text-white">
            {title} ({players.length})
          </h2>
        </div>
        {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
      </div>

      {players.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 text-center text-xs text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((player) => (
            <RosterPlayerCard
              key={player.id}
              player={player}
              isLeagueSquad={isLeagueSquad}
            />
          ))}
        </div>
      )}
    </div>
  );
};

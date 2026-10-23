// src/components/atoms/RosterPlayerCard.jsx
import React from 'react';
import { Award, User } from 'lucide-react';

export const RosterPlayerCard = ({ player, isLeagueSquad = true }) => {
  return (
    <div
      className={`p-4 rounded-2xl border transition flex items-center gap-4 ${
        isLeagueSquad
          ? 'bg-slate-900/90 border-emerald-500/30 shadow-md shadow-emerald-500/5 hover:border-emerald-500/60'
          : 'bg-slate-900/40 border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700'
      }`}
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
        {player.profilePic ? (
          <img
            src={player.profilePic}
            alt={player.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-slate-600" />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono font-bold text-emerald-400 truncate">
            @{player.username}
          </span>
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
              isLeagueSquad
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isLeagueSquad ? 'League Squad' : 'Global Reserve'}
          </span>
        </div>

        <h4 className="text-sm font-black text-white truncate">{player.name}</h4>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">{player.skill}</span>
        </div>
      </div>
    </div>
  );
};

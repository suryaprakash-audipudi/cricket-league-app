// src/components/molecules/LeagueEnrolledTeamCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronRight, Shield } from 'lucide-react';

export const LeagueEnrolledTeamCard = ({ team, leagueId }) => {
  const targetLeagueId = leagueId || team.leagueId;

  return (
    <Link
      to={`/leagues-hub/${targetLeagueId}/team/${team.teamId}`}
      className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition duration-200 cursor-pointer flex flex-col justify-between shadow-lg block"
    >
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 p-2 shrink-0 flex items-center justify-center overflow-hidden">
          {team.logoUrl ? (
            <img
              src={team.logoUrl}
              alt={team.teamName}
              className="w-full h-full object-contain group-hover:scale-105 transition"
            />
          ) : (
            <Shield className="w-7 h-7 text-emerald-500" />
          )}
        </div>
        <div className="space-y-1 min-w-0">
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            POOL {team.poolId}
          </span>
          <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition truncate">
            {team.teamName}
          </h3>
          <p className="text-xs text-slate-400 truncate">
            Owner: {team.ownerName}
          </p>
        </div>
      </div>

      {/* Quick Points & Squad Stats */}
      <div className="grid grid-cols-4 gap-2 my-4 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-center font-mono text-xs">
        <div>
          <span className="text-[10px] text-slate-500 block">PLD</span>
          <span className="font-bold text-slate-200">{team.stats?.played ?? 0}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">WON</span>
          <span className="font-bold text-emerald-400">{team.stats?.won ?? 0}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">PTS</span>
          <span className="font-bold text-white">{team.stats?.points ?? 0}</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 block">SQUAD</span>
          <span className="font-bold text-emerald-400">{team.squadIds?.length ?? 0}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-emerald-400 pt-2 border-t border-slate-800/60">
        <span className="flex items-center gap-1.5">
          <Users className="w-4 h-4" />
          <span>Inspect League Squad & Bench</span>
        </span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </div>
    </Link>
  );
};

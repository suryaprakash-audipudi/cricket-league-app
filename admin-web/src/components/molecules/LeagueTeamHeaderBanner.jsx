// src/components/molecules/LeagueTeamHeaderBanner.jsx
import React from 'react';
import { Phone, Shield } from 'lucide-react';

export const LeagueTeamHeaderBanner = ({ enrollment, squadCount = 0 }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 p-2.5 flex items-center justify-center shrink-0 overflow-hidden">
          {enrollment.logoUrl ? (
            <img
              src={enrollment.logoUrl}
              alt={enrollment.teamName}
              className="w-full h-full object-contain"
            />
          ) : (
            <Shield className="w-8 h-8 text-emerald-500" />
          )}
        </div>

        <div className="space-y-1.5">
          <span className="inline-block text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase tracking-wider">
            Pool {enrollment.poolId} Contender
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {enrollment.teamName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span>
              Franchise Owner: <b className="text-slate-200">{enrollment.ownerName}</b>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              {enrollment.ownerPhone}
            </span>
          </div>
        </div>
      </div>

      {/* Tournament Standing Mini-Scoreboard */}
      <div className="grid grid-cols-4 gap-3 w-full lg:w-auto bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-2xl text-center font-mono">
        <div className="px-3">
          <span className="text-[10px] text-slate-500 block">PLAYED</span>
          <span className="text-sm font-black text-slate-200">
            {enrollment.stats?.played ?? 0}
          </span>
        </div>
        <div className="px-3 border-l border-slate-800">
          <span className="text-[10px] text-slate-500 block">WON</span>
          <span className="text-sm font-black text-emerald-400">
            {enrollment.stats?.won ?? 0}
          </span>
        </div>
        <div className="px-3 border-l border-slate-800">
          <span className="text-[10px] text-slate-500 block">POINTS</span>
          <span className="text-sm font-black text-white">
            {enrollment.stats?.points ?? 0}
          </span>
        </div>
        <div className="px-3 border-l border-slate-800">
          <span className="text-[10px] text-slate-500 block">SQUAD</span>
          <span className="text-sm font-black text-emerald-400">{squadCount}</span>
        </div>
      </div>
    </div>
  );
};

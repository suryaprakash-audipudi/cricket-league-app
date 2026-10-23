// src/components/molecules/LeagueHeroBanner.jsx
import React from 'react';
import { Trophy, Calendar, Layers, Image } from 'lucide-react';
import { LeagueStatusBadge } from '../atoms/LeagueStatusBadge';

export const LeagueHeroBanner = ({
  league,
  poolsCount,
  computedTimelineStatus,
  activeViewSection,
  onSelectViewSection
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <LeagueStatusBadge status={computedTimelineStatus} />

          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Season {league.seasonYear}
          </span>

          <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            {league.structureConfiguration?.formatType}
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
          {league.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>
              {new Date(league.targetHorizon?.startDate).toLocaleDateString()} to{' '}
              {new Date(league.targetHorizon?.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>
              {poolsCount} Regional Pools (Top{' '}
              {league.structureConfiguration?.qualifiersPerPool} Advance)
            </span>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Pools vs League Gallery */}
      <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-stretch md:self-auto">
        <button
          type="button"
          onClick={() => onSelectViewSection('POOLS')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeViewSection === 'POOLS'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Pools & Teams</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectViewSection('GALLERY')}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeViewSection === 'GALLERY'
              ? 'bg-emerald-500 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>League Gallery</span>
        </button>
      </div>
    </div>
  );
};

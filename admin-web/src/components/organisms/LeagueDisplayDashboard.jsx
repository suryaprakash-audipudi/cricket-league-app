// src/components/organisms/LeagueDisplayDashboard.jsx
import React from 'react';
import { useLeagueDisplay } from '../../hooks/useLeagueDisplay';
import { useNavigate } from 'react-router-dom';

import { Trophy, CalendarDays, Layers, ShieldCheck, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

export const LeagueDisplayDashboard = () => {
  const navigate = useNavigate();
  const { leagues, loading, error, triggerManualRefresh } = useLeagueDisplay('DISTRICT', 'PAL');

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-4">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Active League Systems Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">Explore configured multi-tenant tournament nodes active within the sector domain</p>
        </div>
        <button 
          onClick={() => triggerManualRefresh()}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl hover:text-emerald-400 hover:border-emerald-500/30 transition duration-150"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Systems</span>
        </button>
      </div>

      {/* Network Execution Progress State Interceptors */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
          <p className="text-xs font-bold text-slate-500 tracking-widest font-mono">SCANNING ACTIVE CLUSTERS...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-500/20 rounded-2xl text-red-400 text-sm max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
          <span className="font-semibold">Retrieval Interrupted: {error.message}</span>
        </div>
      )}

      {/* 🏆 Dynamic Tournament Dashboard Cards Display Grid */}
      {!loading && !error && (
        leagues.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-850 rounded-3xl bg-slate-900/10">
            <Trophy className="w-8 h-8 text-slate-700 mx-auto stroke-[1.5]" />
            <p className="text-xs font-bold text-slate-400 mt-4 font-mono uppercase tracking-wide">No active tournament frameworks configured for this domain zone</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leagues.map((league) => (
              <div 
                key={league.id}
                className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-850 rounded-2xl p-5 shadow-xl hover:border-slate-750 transition duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Decorative Status Bar Top Header */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-800 group-hover:bg-emerald-500 transition duration-200" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-extrabold text-base text-white tracking-tight group-hover:text-emerald-400 transition duration-150 leading-snug">
                      {league.title}
                    </h3>
                    <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest shrink-0">
                      {league.leagueStatus}
                    </span>
                  </div>

                  {/* Horizontal Meta Specs Matrix Display Panel */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono uppercase text-[10px] font-bold">
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                      <div className="text-slate-500 mb-0.5 flex items-center justify-center gap-1"><CalendarDays className="w-3 h-3" /> Year</div>
                      <div className="text-slate-200 font-extrabold">{league.seasonYear}</div>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                      <div className="text-slate-500 mb-0.5 flex items-center justify-center gap-1"><Layers className="w-3 h-3" /> Pools</div>
                      <div className="text-slate-200 font-extrabold">{league.structureConfiguration.activePoolIds.length} Nodes</div>
                    </div>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-850">
                      <div className="text-slate-500 mb-0.5 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Advance</div>
                      <div className="text-slate-200 font-extrabold">Top {league.structureConfiguration.qualifiersPerPool} Club</div>
                    </div>
                  </div>

                  {/* Operational Target Horizon Date Mapping Context Footprint */}
                  <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row justify-between text-xs text-slate-400 gap-1.5 font-sans">
                    <div>
                      <span className="text-slate-500 font-medium">Timeline Horizon:</span>{' '}
                      <span className="font-semibold text-slate-300">{new Date(league.targetHorizon.startDate).toLocaleDateString()}</span>
                      <span className="text-slate-600 font-bold mx-1.5">➔</span>
                      <span className="font-semibold text-slate-300">{new Date(league.targetHorizon.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="font-mono text-[11px] text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 font-bold self-start sm:self-center shrink-0">
                      {league.targetHorizon.totalDurationDays} Days Total
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/leagues-hub/${league.id}`);
                    }}
                    className="w-full bg-slate-950 group-hover:bg-emerald-500 text-slate-300 group-hover:text-slate-950 border border-slate-850 py-2.5 rounded-xl text-xs font-bold tracking-wide transition duration-150"
                  >
                    Open League Central Console
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

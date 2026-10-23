// src/components/organisms/LeagueRegistrationForm.jsx
import React from 'react';
import { useLeagueRegistration } from '../../hooks/useLeagueRegistration';
import { useGeoScopeRegistry } from '../../hooks/useGeoScopeRegistry'; // 🚀 Re-using our core generic intelligence hook!
import { Input } from '../atoms/Input';
import { Trophy, Calendar, Sliders, CheckSquare, Square, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export const LeagueRegistrationForm = () => {
  const {
    title, seasonYear, executionScope, startDate, endDate, formatType, activePoolIds, qualifiersPerPool, superFourEnabled, semisCount, finalsCount, actionStatus, statusType, loading,
    setTitle, setSeasonYear, setExecutionScope, setStartDate, setEndDate, setFormatType, setQualifiersPerPool, setSuperFourEnabled, setSemisCount, setFinalsCount,
    handlePoolToggle, handleRegisterLeague
  } = useLeagueRegistration();

  // Load the 7 segment pools dynamically using our single source of truth master collection query
  const { geoNodes: poolNodes, loading: poolLoading } = useGeoScopeRegistry('DISTRICT', 'CONSTITUENCY', ['PAL']);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-6">
      <div className="border-b border-slate-900 pb-4 flex items-center gap-3">
        <Trophy className="w-6 h-6 text-emerald-500" />
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">League Framework Generator</h2>
          <p className="text-xs text-slate-400 mt-0.5">Spin up multi-tenant localized dynamic tournament parameters instantly</p>
        </div>
      </div>

      <form onSubmit={handleRegisterLeague} className="space-y-6">
        {/* Profile Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Tournament Custom Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Palnadu Street Premier League" />
          <Input label="Season Year" type="number" required value={seasonYear} onChange={(e) => setSeasonYear(e.target.value)} placeholder="2026" />
        </div>

        {/* Target Horizon Time Bounds Configuration Container */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Target Horizon Timeline Boundary</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="League Commencement Date" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input label="League Culmination Date" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* Structural Rules Configuration Container */}
        <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <span>Format & Dynamic Stage Configurations</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Tournament Type</label>
              <select value={formatType} onChange={(e) => setFormatType(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/40">
                <option value="STAGED_POOLS">Staged Regional Pools</option>
                <option value="DIRECT_KNOCKOUT">Pure Direct Elimination</option>
              </select>
            </div>
            <Input label="Qualifiers Per Pool" type="number" required value={qualifiersPerPool} onChange={(e) => setQualifiersPerPool(e.target.value)} />
            <Input label="Global Semi-Finalists Count" type="number" required value={semisCount} onChange={(e) => setSemisCount(e.target.value)} />
          </div>
        </div>

        {/* Dynamic Regional Divisions Checklist Matrix */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 font-mono tracking-widest uppercase block">
            Map Divisional Segment Pools (Multi-Select Pools)
          </label>
          
          {poolLoading ? (
            <div className="flex items-center gap-2 py-2 text-xs font-mono text-slate-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
              <span>Scanning server master geo grid...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {poolNodes.map((pool) => {
                const isChecked = activePoolIds.includes(pool.id);
                return (
                  <button
                    type="button"
                    key={pool.id}
                    onClick={() => handlePoolToggle(pool.id)}
                    className={'flex items-center gap-3 p-3.5 rounded-xl border text-xs font-bold transition duration-150 ' + (
                      isChecked ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : 'bg-slate-900/30 border-slate-850 text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                    <span>{pool.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || statusType === 'PENDING'}
          className="w-full bg-emerald-500 text-slate-950 p-4 rounded-xl font-bold text-base hover:bg-emerald-400 active:scale-[0.99] transition disabled:opacity-50"
        >
          {loading || statusType === 'PENDING' ? 'Deploying Tournament Cluster Engine...' : 'Compile and Instantiate League'}
        </button>
      </form>

      {actionStatus && (
        <div className={'flex items-center gap-2.5 p-4 border rounded-xl text-sm font-semibold tracking-wide transition duration-150 ' + (
          statusType === 'SUCCESS' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' :
          statusType === 'ERROR' ? 'bg-red-950/40 border-red-500/30 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-200'
        )}>
          {statusType === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 stroke-[2.5] shrink-0" />}
          {statusType === 'ERROR' && <XCircle className="w-4 h-4 stroke-[2.5] shrink-0" />}
          {statusType === 'PENDING' && <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin shrink-0" />}
          <span>{actionStatus}</span>
        </div>
      )}
    </div>
  );
};

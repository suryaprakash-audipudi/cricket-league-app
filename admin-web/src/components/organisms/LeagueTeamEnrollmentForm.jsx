// src/components/organisms/LeagueTeamEnrollmentForm.jsx
import React from 'react';
import { useLeagueEnrollment } from '../../hooks/useLeagueEnrollment';
import { PlayerSelector } from '../molecules/PlayerSelector';
import { ShieldCheck, Trophy, Layers, Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export const LeagueTeamEnrollmentForm = () => {
  const {
    leagues,
    leaguesLoading,
    availablePools,
    globalTeams,
    teamsLoading,
    selectedLeagueId,
    selectedPoolId,
    selectedTeamId,
    squadIds,
    actionStatus,
    statusType,
    enrolling,
    setSelectedLeagueId,
    setSelectedPoolId,
    setSelectedTeamId,
    setSquadIds,
    handleEnrollSubmit
  } = useLeagueEnrollment();

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-6">
      <div className="border-b border-slate-900 pb-4 flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-500" />
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">League Team Enrollment & Squad Lock</h2>
          <p className="text-xs text-slate-400 mt-0.5">Assign global independent clubs into active tournament pools and finalize league roster</p>
        </div>
      </div>

      <form onSubmit={handleEnrollSubmit} className="space-y-6">
        {/* Step 1: Select Target League */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>1. Select Active Tournament</span>
          </label>
          <select
            required
            value={selectedLeagueId}
            onChange={(e) => setSelectedLeagueId(e.target.value)}
            disabled={leaguesLoading}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
          >
            <option value="">{leaguesLoading ? 'Loading active tournaments...' : 'Choose a league'}</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.title} ({league.seasonYear})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Select Target Pool / Constituency */}
        {selectedLeagueId && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>2. Select Divisional Pool</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availablePools.map((poolId) => (
                <button
                  type="button"
                  key={poolId}
                  onClick={() => setSelectedPoolId(poolId)}
                  className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold border transition duration-150 ${
                    selectedPoolId === poolId
                      ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Pool: {poolId}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Global Team from that Pool */}
        {selectedPoolId && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>3. Choose Eligible Club from {selectedPoolId} Sector</span>
            </label>
            <select
              required
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              disabled={teamsLoading}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50"
            >
              <option value="">
                {teamsLoading ? 'Scanning global clubs...' : globalTeams.length === 0 ? 'No registered clubs found in this constituency' : 'Select club to enroll'}
              </option>
              {globalTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.teamName} (Owner: {team.ownerName})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Step 4: Customize & Lock League Squad */}
        {selectedTeamId && (
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 tracking-wide">
                4. Verify & Customize Tournament Squad ({squadIds.length} Players Selected)
              </h4>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Pre-loaded from Global Team
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Existing team players are pre-selected below. You can add new players from the global talent pool or remove players specifically for this tournament.
            </p>
            <PlayerSelector selectedPlayers={squadIds} setSelectedPlayers={setSquadIds} />
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedTeamId || enrolling || statusType === 'PENDING'}
          className="w-full bg-emerald-500 text-slate-950 p-4 rounded-xl font-bold text-base hover:bg-emerald-400 active:scale-[0.99] transition disabled:opacity-50"
        >
          {enrolling ? 'Locking Club & Squad into League...' : 'Confirm Enrollment & Lock Squad'}
        </button>
      </form>

      {actionStatus && (
        <div className={`flex items-center gap-2.5 p-4 border rounded-xl text-sm font-semibold tracking-wide ${
          statusType === 'SUCCESS' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' :
          statusType === 'ERROR' ? 'bg-red-950/40 border-red-500/30 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          {statusType === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {statusType === 'ERROR' && <XCircle className="w-4 h-4 shrink-0" />}
          {statusType === 'PENDING' && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
          <span>{actionStatus}</span>
        </div>
      )}
    </div>
  );
};

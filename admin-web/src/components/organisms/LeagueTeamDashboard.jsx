// src/components/organisms/LeagueTeamDashboard.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeagueTeamRoster } from '../../hooks/useLeagueTeamRoster';
import { LeagueTeamHeaderBanner } from '../molecules/LeagueTeamHeaderBanner';
import { PlayerRosterSection } from '../molecules/PlayerRosterSection';
import { ArrowLeft, UserCheck, Users, Loader2, AlertCircle } from 'lucide-react';

export const LeagueTeamDashboard = () => {
  const { leagueId, teamId } = useParams();
  const navigate = useNavigate();

  const {
    enrollment,
    leagueSquadPlayers,
    otherGlobalPlayers,
    loading,
    error
  } = useLeagueTeamRoster(leagueId, teamId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          Hydrating Club Roster Cards...
        </p>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-950/30 border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span className="text-sm font-semibold">
          {error?.message || 'Team roster record not found for this league'}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Top Back Navigation */}
      <button
        type="button"
        onClick={() => navigate(`/leagues-hub/${leagueId}`)}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-400 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to League Pool Console</span>
      </button>

      {/* Molecule 1: Franchise Header & Tournament Stats */}
      <LeagueTeamHeaderBanner
        enrollment={enrollment}
        squadCount={leagueSquadPlayers.length}
      />

      {/* Molecule 2 (Instance A): Selected League Squad Players */}
      <PlayerRosterSection
        title="Selected Tournament Squad"
        subtitle="Active roster locked for this league"
        players={leagueSquadPlayers}
        isLeagueSquad={true}
        icon={UserCheck}
        emptyMessage="No active tournament squad players locked for this club yet."
      />

      {/* Molecule 2 (Instance B): Other Global Club Members (Bench / Reserve) */}
      <PlayerRosterSection
        title="Other Registered Club Members"
        subtitle="Global club members not in current tournament squad"
        players={otherGlobalPlayers}
        isLeagueSquad={false}
        icon={Users}
        emptyMessage="All global members of this club are already included in the active tournament squad above."
      />
    </div>
  );
};
